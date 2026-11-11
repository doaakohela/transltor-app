import { AudioSettings, PlaybackStage, VocabularyItem } from '../types.ts';

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Tiny valid silent WAV used to unlock HTMLAudioElement synchronously on user gesture (iOS/Android/Safari/Chrome)
const SILENT_UNLOCK_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

class SpeechService {
  private sharedAudio: HTMLAudioElement | null = null;
  private activeObjectUrl: string | null = null;
  private activeResolve: (() => void) | null = null;
  private activeTimeoutId: number | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private sequenceCache = new Map<string, string>();
  private isCancelled: boolean = false;

  /**
   * Must be called synchronously inside a click/tap handler before async fetch loops
   * so Mobile Safari, Android Chrome, Tablet & Desktop browsers permit continuous audio playback.
   */
  public unlockAudio(): void {
    this.isCancelled = false;
    try {
      if (!this.sharedAudio) {
        this.sharedAudio = new Audio();
        this.sharedAudio.preload = 'auto';
      }
      // Play tiny silent WAV synchronously inside the user gesture to unlock the element
      this.sharedAudio.src = SILENT_UNLOCK_WAV;
      this.sharedAudio.volume = 0.01;
      const playPromise = this.sharedAudio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Ignore unlock errors on browsers that don't require it
        });
      }
      setTimeout(() => {
        if (this.sharedAudio) {
          this.sharedAudio.volume = 1;
        }
      }, 40);
    } catch {
      // ignore unlock errors
    }

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
      }
    } catch {
      // ignore
    }
  }

  private clearActiveAudioHandlers(resolvePending = true): void {
    if (this.activeTimeoutId !== null) {
      window.clearTimeout(this.activeTimeoutId);
      this.activeTimeoutId = null;
    }

    if (this.sharedAudio) {
      this.sharedAudio.onended = null;
      this.sharedAudio.onerror = null;
      try {
        this.sharedAudio.pause();
        this.sharedAudio.currentTime = 0;
      } catch {
        // ignore
      }
    }

    if (this.activeObjectUrl) {
      try {
        URL.revokeObjectURL(this.activeObjectUrl);
      } catch {
        // ignore
      }
      this.activeObjectUrl = null;
    }

    if (resolvePending && this.activeResolve) {
      const done = this.activeResolve;
      this.activeResolve = null;
      done();
    } else {
      this.activeResolve = null;
    }
  }

  public playAudioFromBase64(base64: string, mimeType = 'audio/mp3'): Promise<void> {
    return new Promise((resolve) => {
      // Clean up only the previous track's audio without flipping isCancelled = true
      this.clearActiveAudioHandlers(true);
      if (this.isCancelled) {
        resolve();
        return;
      }

      if (!this.sharedAudio) {
        this.sharedAudio = new Audio();
        this.sharedAudio.preload = 'auto';
      }

      const audio = this.sharedAudio;
      audio.volume = 1;

      let audioSrc: string;
      try {
        const bin = atob(base64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          bytes[i] = bin.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType === 'audio/mp3' ? 'audio/mpeg' : mimeType });
        const objectUrl = URL.createObjectURL(blob);
        this.activeObjectUrl = objectUrl;
        audioSrc = objectUrl;
      } catch {
        audioSrc = `data:${mimeType};base64,${base64}`;
      }

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        this.clearActiveAudioHandlers(false);
        resolve();
      };

      this.activeResolve = finish;

      audio.onended = finish;
      audio.onerror = (e) => {
        console.warn('Audio playback error', e);
        finish();
      };

      // Safety fallback in case a mobile browser drops onended
      this.activeTimeoutId = window.setTimeout(() => {
        finish();
      }, 45000);

      audio.src = audioSrc;
      try {
        audio.load();
      } catch {
        // ignore
      }

      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => {
          console.warn('Playback interrupted or blocked:', err);
          finish();
        });
      }
    });
  }

  public getBaseUrl(): string {
    try {
      const custom = localStorage.getItem('vocabflow_backend_url');
      if (custom && custom.trim()) {
        return custom.trim().replace(/\/+$/, '');
      }
    } catch (e) {
      // ignore
    }
    return (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  }

  // Audition or speak a single word / phrase in ANY world language
  public async speakText(text: string, lang = 'en', voiceName = 'en-US-GuyNeural'): Promise<void> {
    this.isCancelled = false;
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/tts/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          lang,
          voice: voiceName,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS server responded with ${response.status}`);
      }

      const data = await response.json();
      if (!data.audioBase64) {
        throw new Error('No audio in response');
      }

      if (this.isCancelled) return;
      await this.playAudioFromBase64(data.audioBase64, data.mimeType || 'audio/mp3');
    } catch (err) {
      console.warn('Backend TTS failed, falling back to Web Speech API:', err);
      if (this.isCancelled) return;
      await this.speakUtterance(text, lang);
    }
  }

  // Backward compatibility alias: speak English
  public async speakEnglish(text: string, settings?: AudioSettings): Promise<void> {
    const voice = settings?.sourceVoice || settings?.enGeminiVoice || 'en-US-GuyNeural';
    await this.speakText(text, settings?.sourceLang || 'en-US', voice);
  }

  // Backward compatibility alias: speak Arabic
  public async speakArabic(text: string, settings?: AudioSettings): Promise<void> {
    const voice = settings?.targetVoice || settings?.arGeminiVoice || 'ar-EG-ShakirNeural';
    await this.speakText(text, settings?.targetLang || 'ar-EG', voice);
  }

  private getSequenceCacheKey(item: VocabularyItem, settings: AudioSettings): string {
    const sourceText = item.sourceText || item.english || '';
    const targetText = item.targetText || item.arabic || '';
    const sourceVoice = settings.sourceVoice || settings.enGeminiVoice || 'en-US-GuyNeural';
    const targetVoice = settings.targetVoice || settings.arGeminiVoice || 'es-ES-ElviraNeural';
    const sourceRepeats = settings.sourceRepeats ?? 2;
    const targetRepeats = settings.targetRepeats ?? 1;
    const pauseSourceMs = settings.pauseBetweenSource ?? settings.pauseBetweenEn ?? 600;
    const pauseTargetMs = settings.pauseBetweenLanguages ?? settings.pauseBetweenEnAndAr ?? 800;
    return `${sourceText}::${targetText}::${sourceVoice}::${targetVoice}::${sourceRepeats}::${targetRepeats}::${pauseSourceMs}::${pauseTargetMs}`;
  }

  private async fetchFullSequenceAudioBase64(
    item: VocabularyItem,
    settings: AudioSettings
  ): Promise<string> {
    const cacheKey = this.getSequenceCacheKey(item, settings);
    const cached = this.sequenceCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const sourceText = item.sourceText || item.english || '';
    const targetText = item.targetText || item.arabic || '';
    const sourceVoice = settings.sourceVoice || settings.enGeminiVoice || 'en-US-GuyNeural';
    const targetVoice = settings.targetVoice || settings.arGeminiVoice || 'es-ES-ElviraNeural';
    const sourceRepeats = settings.sourceRepeats ?? 2;
    const targetRepeats = settings.targetRepeats ?? 1;
    const pauseSourceMs = settings.pauseBetweenSource ?? settings.pauseBetweenEn ?? 600;
    const pauseTargetMs = settings.pauseBetweenLanguages ?? settings.pauseBetweenEnAndAr ?? 800;

    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/api/tts/full-word`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceText,
        targetText,
        sourceVoice,
        targetVoice,
        sourceRepeats,
        targetRepeats,
        pauseSourceMs,
        pauseTargetMs,
        // Legacy aliases
        english: sourceText,
        arabic: targetText,
        enVoice: sourceVoice,
        arVoice: targetVoice,
        pauseEnMs: pauseSourceMs,
        pauseArMs: pauseTargetMs,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    if (!data.audioBase64) {
      throw new Error('No audio returned');
    }

    // Keep client cache bounded cleanly
    if (this.sequenceCache.size > 80) {
      const firstKey = this.sequenceCache.keys().next().value;
      if (firstKey) this.sequenceCache.delete(firstKey);
    }
    this.sequenceCache.set(cacheKey, data.audioBase64);
    return data.audioBase64;
  }

  public prefetchFullSequence(item: VocabularyItem | undefined, settings: AudioSettings): void {
    if (!item) return;
    const cacheKey = this.getSequenceCacheKey(item, settings);
    if (this.sequenceCache.has(cacheKey)) return;
    this.fetchFullSequenceAudioBase64(item, settings).catch(() => {
      // Silent background prefetch
    });
  }

  // Play full sequence (e.g. 2x Source Word + Pause + 1x Target Translation)
  public async playFullSequence(
    item: VocabularyItem,
    settings: AudioSettings,
    onStageChange?: (stage: PlaybackStage) => void
  ): Promise<boolean> {
    this.isCancelled = false;
    onStageChange?.('source_1');

    try {
      const audioBase64 = await this.fetchFullSequenceAudioBase64(item, settings);

      if (this.isCancelled) {
        onStageChange?.('idle');
        return false;
      }

      onStageChange?.('source_2');
      await this.playAudioFromBase64(audioBase64, 'audio/mp3');
      onStageChange?.('idle');
      return !this.isCancelled;
    } catch (err) {
      console.warn('Sequence playback via backend failed, using Web Speech fallback:', err);
      if (this.isCancelled) {
        onStageChange?.('idle');
        return false;
      }
      // Fallback using browser speech
      return this.playFallbackWebSpeechSequence(item, settings, onStageChange);
    }
  }

  // Offline Web Speech Fallback for full sequence
  private async playFallbackWebSpeechSequence(
    item: VocabularyItem,
    settings: AudioSettings,
    onStageChange?: (stage: PlaybackStage) => void
  ): Promise<boolean> {
    if (!('speechSynthesis' in window)) return false;
    const sourceText = item.sourceText || item.english || '';
    const targetText = item.targetText || item.arabic || '';
    const sourceRepeats = settings.sourceRepeats ?? 2;
    const targetRepeats = settings.targetRepeats ?? 1;

    for (let i = 0; i < sourceRepeats; i++) {
      if (this.isCancelled) return false;
      onStageChange?.(i === 0 ? 'source_1' : 'source_2');
      await this.speakUtterance(sourceText, settings.sourceLang || 'en-US');
      if (this.isCancelled) return false;
      await sleep(settings.pauseBetweenSource || 500);
    }

    if (targetText && targetRepeats > 0) {
      if (this.isCancelled) return false;
      await sleep(settings.pauseBetweenLanguages || 600);
      for (let j = 0; j < targetRepeats; j++) {
        if (this.isCancelled) return false;
        onStageChange?.('target_1');
        await this.speakUtterance(targetText, settings.targetLang || 'es-ES');
        if (this.isCancelled) return false;
        if (j < targetRepeats - 1) {
          await sleep(500);
        }
      }
    }

    onStageChange?.('idle');
    return !this.isCancelled;
  }

  private speakUtterance(text: string, lang: string): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window) || !text.trim() || this.isCancelled) {
        resolve();
        return;
      }

      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }

      // Small delay prevents Chrome/Safari from cancelling the new utterance right after .cancel()
      window.setTimeout(() => {
        if (this.isCancelled) {
          resolve();
          return;
        }

        const u = new SpeechSynthesisUtterance(text);
        this.activeUtterance = u;
        u.lang = lang;
        u.rate = 0.95;

        let settled = false;
        const safetyMs = Math.max(4000, Math.min(18000, text.length * 180 + 2500));
        const timerId = window.setTimeout(() => done(), safetyMs);

        const done = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timerId);
          this.activeUtterance = null;
          resolve();
        };

        u.onend = done;
        u.onerror = done;

        try {
          window.speechSynthesis.speak(u);
        } catch {
          done();
        }
      }, 60);
    });
  }

  // Stop playback immediately
  public stop(): void {
    this.isCancelled = true;
    this.clearActiveAudioHandlers(true);
    this.activeUtterance = null;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  // Download sequence for single word
  public async downloadSequenceAudio(
    item: VocabularyItem,
    settings: AudioSettings
  ): Promise<boolean> {
    try {
      const sourceText = item.sourceText || item.english || '';
      const targetText = item.targetText || item.arabic || '';
      const sourceVoice = settings.sourceVoice || settings.enGeminiVoice || 'en-US-GuyNeural';
      const targetVoice = settings.targetVoice || settings.arGeminiVoice || 'es-ES-ElviraNeural';

      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/tts/full-word`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText,
          targetText,
          sourceVoice,
          targetVoice,
          sourceRepeats: settings.sourceRepeats ?? 2,
          targetRepeats: settings.targetRepeats ?? 1,
          pauseSourceMs: settings.pauseBetweenSource ?? 600,
          pauseTargetMs: settings.pauseBetweenLanguages ?? 800,
          // Legacy
          english: sourceText,
          arabic: targetText,
          enVoice: sourceVoice,
          arVoice: targetVoice,
        }),
      });

      if (!response.ok) throw new Error('Download failed');
      const data = await response.json();
      if (!data.audioBase64) throw new Error('No audio');

      const safeName = (sourceText || targetText || 'word').replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
      return this.triggerBrowserDownload(data.audioBase64, data.filename || `${safeName}_repetition.mp3`);
    } catch (e) {
      console.error('Download error:', e);
      return false;
    }
  }

  // Batch download full playlist as a single master MP3 file
  // Includes automatic resilient fallback: If serverless batch limits or 404 occurs,
  // it automatically fetches single words and concatenates into one seamless MP3 in the browser!
  public async downloadBatchAudio(
    items: VocabularyItem[],
    settings: AudioSettings,
    maxCount = 250,
    customFilename?: string,
    onProgress?: (current: number, total: number, statusText: string) => void
  ): Promise<boolean> {
    const itemsToExport = items.slice(0, maxCount).map((it) => ({
      sourceText: it.sourceText || it.english,
      targetText: it.targetText || it.arabic,
      english: it.sourceText || it.english,
      arabic: it.targetText || it.arabic,
    }));

    if (itemsToExport.length === 0) return false;

    const baseUrl = this.getBaseUrl();
    const filename = customFilename || `translation_${itemsToExport.length}_words.mp3`;

    onProgress?.(0, itemsToExport.length, 'Starting high-speed neural audio synthesis...');

    // Attempt 1: Direct high-speed server batch endpoint
    try {
      const response = await fetch(`${baseUrl}/api/tts/batch-download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsToExport,
          sourceVoice: settings.sourceVoice || settings.enGeminiVoice || 'en-US-GuyNeural',
          targetVoice: settings.targetVoice || settings.arGeminiVoice || 'es-ES-ElviraNeural',
          sourceRepeats: settings.sourceRepeats ?? 2,
          targetRepeats: settings.targetRepeats ?? 1,
          pauseSourceMs: settings.pauseBetweenSource ?? 600,
          pauseTargetMs: settings.pauseBetweenLanguages ?? 800,
          pauseBetweenWordsMs: settings.pauseBetweenWords ?? 1400,
          filename,
          // Legacy
          enVoice: settings.sourceVoice || settings.enGeminiVoice,
          arVoice: settings.targetVoice || settings.arGeminiVoice,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          onProgress?.(itemsToExport.length, itemsToExport.length, 'Complete! Generating MP3 file...');
          return this.triggerBrowserDownload(data.audioBase64, data.filename || filename);
        }
      }
    } catch (batchErr) {
      console.warn('Batch endpoint failed, falling back to resilient word-by-word assembler:', batchErr);
    }

    // Attempt 2: Resilient word-by-word assembler in browser with exact same studio neural voices
    try {
      onProgress?.(0, itemsToExport.length, 'Assembling studio neural audio in browser...');
      const audioChunks: Uint8Array[] = [];

      for (let i = 0; i < itemsToExport.length; i++) {
        const item = itemsToExport[i];
        const currentNum = i + 1;
        onProgress?.(
          currentNum,
          itemsToExport.length,
          `Synthesizing word ${currentNum} of ${itemsToExport.length}: "${item.sourceText || item.targetText}"`
        );

        try {
          const res = await fetch(`${baseUrl}/api/tts/full-word`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sourceText: item.sourceText,
              targetText: item.targetText,
              sourceVoice: settings.sourceVoice || 'en-US-GuyNeural',
              targetVoice: settings.targetVoice || 'es-ES-ElviraNeural',
              sourceRepeats: settings.sourceRepeats ?? 2,
              targetRepeats: settings.targetRepeats ?? 1,
              pauseSourceMs: settings.pauseBetweenSource ?? 600,
              pauseTargetMs: settings.pauseBetweenLanguages ?? 800,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.audioBase64) {
              const binStr = atob(data.audioBase64);
              const bytes = new Uint8Array(binStr.length);
              for (let b = 0; b < binStr.length; b++) {
                bytes[b] = binStr.charCodeAt(b);
              }
              audioChunks.push(bytes);
            }
          }
        } catch (itemErr) {
          console.warn(`Could not synthesize item ${i}:`, itemErr);
        }
      }

      if (audioChunks.length === 0) {
        throw new Error('Could not synthesize any words');
      }

      onProgress?.(itemsToExport.length, itemsToExport.length, 'Downloading final MP3...');
      const combinedBlob = new Blob(audioChunks as any, { type: 'audio/mp3' });
      return this.triggerBlobDownload(combinedBlob, filename);
    } catch (fallbackErr) {
      console.error('All batch download attempts failed:', fallbackErr);
      return false;
    }
  }

  public triggerBlobDownload(blob: Blob, filename: string): boolean {
    try {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(link.href), 10000);
      return true;
    } catch (err) {
      console.error('Failed to trigger blob download:', err);
      return false;
    }
  }

  private triggerBrowserDownload(base64: string, filename: string): boolean {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mp3' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      return true;
    } catch (err) {
      console.error('Failed to trigger download:', err);
      return false;
    }
  }

  // Get browser voices (for fallback)
  public getBrowserVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        return resolve([]);
      }
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        return resolve(voices);
      }
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
      setTimeout(() => resolve(window.speechSynthesis.getVoices()), 500);
    });
  }
}

export const speechService = new SpeechService();
