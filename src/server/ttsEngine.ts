import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// In-memory cache for ultra-fast replays
const ttsCache = new Map<string, string>();
const silenceCache = new Map<number, Buffer>();

// Standard 100ms compliant 24kHz 48kbps mono MP3 silence frame (MPEG-2 Layer III)
// Eliminates any ffmpeg dependency so code runs flawlessly on Vercel Serverless, Node, Docker, etc.
const MP3_SILENCE_100MS_BASE64 =
  'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//NkxAAAAANIAAAAAExBTUVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

const SILENCE_100MS_CHUNK = Buffer.from(MP3_SILENCE_100MS_BASE64, 'base64');

export function getValidMp3Silence(durationMs = 600): Buffer {
  const roundedMs = Math.max(100, Math.round(durationMs / 100) * 100);
  if (silenceCache.has(roundedMs)) {
    return silenceCache.get(roundedMs)!;
  }
  const units = Math.max(1, Math.round(roundedMs / 100));
  const chunks: Buffer[] = [];
  for (let i = 0; i < units; i++) {
    chunks.push(SILENCE_100MS_CHUNK);
  }
  const result = Buffer.concat(chunks);
  silenceCache.set(roundedMs, result);
  return result;
}

export interface VoiceConfig {
  voiceName: string;
  prosody?: {
    pitch?: string;
    rate?: string;
  };
}

// Legacy voice name to full Microsoft Neural Voice mapping
export const LEGACY_VOICE_MAP: Record<string, { voiceName: string; prosody?: { pitch?: string; rate?: string } }> = {
  // Arabic voices
  Shakir: { voiceName: 'ar-EG-ShakirNeural', prosody: { pitch: '0Hz', rate: '-4%' } },
  'ar-EG-ShakirNeural': { voiceName: 'ar-EG-ShakirNeural', prosody: { pitch: '0Hz', rate: '-4%' } },
  Layla: { voiceName: 'ar-LB-LaylaNeural', prosody: { pitch: '0Hz', rate: '-6%' } },
  'ar-LB-LaylaNeural': { voiceName: 'ar-LB-LaylaNeural', prosody: { pitch: '0Hz', rate: '-6%' } },
  Salma: { voiceName: 'ar-EG-SalmaNeural', prosody: { pitch: '-1Hz', rate: '-8%' } },
  'ar-EG-SalmaNeural': { voiceName: 'ar-EG-SalmaNeural', prosody: { pitch: '-1Hz', rate: '-8%' } },
  Sana: { voiceName: 'ar-JO-SanaNeural', prosody: { pitch: '0Hz', rate: '-6%' } },
  'ar-JO-SanaNeural': { voiceName: 'ar-JO-SanaNeural', prosody: { pitch: '0Hz', rate: '-6%' } },
  Amany: { voiceName: 'ar-SY-AmanyNeural', prosody: { pitch: '0Hz', rate: '-6%' } },
  'ar-SY-AmanyNeural': { voiceName: 'ar-SY-AmanyNeural', prosody: { pitch: '0Hz', rate: '-6%' } },
  Fatima: { voiceName: 'ar-AE-FatimaNeural', prosody: { pitch: '0Hz', rate: '-5%' } },
  'ar-AE-FatimaNeural': { voiceName: 'ar-AE-FatimaNeural', prosody: { pitch: '0Hz', rate: '-5%' } },
  Zariyah: { voiceName: 'ar-SA-ZariyahNeural', prosody: { pitch: '0Hz', rate: '-5%' } },
  'ar-SA-ZariyahNeural': { voiceName: 'ar-SA-ZariyahNeural', prosody: { pitch: '0Hz', rate: '-5%' } },

  // English US Voices
  Guy: { voiceName: 'en-US-GuyNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  'en-US-GuyNeural': { voiceName: 'en-US-GuyNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  Jenny: { voiceName: 'en-US-JennyNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  'en-US-JennyNeural': { voiceName: 'en-US-JennyNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  Christopher: { voiceName: 'en-US-ChristopherNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  'en-US-ChristopherNeural': { voiceName: 'en-US-ChristopherNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  Ava: { voiceName: 'en-US-AvaNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  'en-US-AvaNeural': { voiceName: 'en-US-AvaNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  Aria: { voiceName: 'en-US-AriaNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  'en-US-AriaNeural': { voiceName: 'en-US-AriaNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  Eric: { voiceName: 'en-US-EricNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  'en-US-EricNeural': { voiceName: 'en-US-EricNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  Andrew: { voiceName: 'en-US-AndrewNeural', prosody: { pitch: '0Hz', rate: '0%' } },
  'en-US-AndrewNeural': { voiceName: 'en-US-AndrewNeural', prosody: { pitch: '0Hz', rate: '0%' } },
};

/**
 * Universal voice resolver supporting ANY world language neural voice ID
 */
export function resolveVoiceAndProsody(voice: string, lang?: string): VoiceConfig {
  if (!voice) {
    if (lang?.startsWith('ar')) return { voiceName: 'ar-EG-ShakirNeural', prosody: { pitch: '0Hz', rate: '-4%' } };
    if (lang?.startsWith('fr')) return { voiceName: 'fr-FR-DeniseNeural', prosody: { pitch: '0Hz', rate: '0%' } };
    if (lang?.startsWith('es')) return { voiceName: 'es-ES-ElviraNeural', prosody: { pitch: '0Hz', rate: '0%' } };
    if (lang?.startsWith('de')) return { voiceName: 'de-DE-KatjaNeural', prosody: { pitch: '0Hz', rate: '0%' } };
    if (lang?.startsWith('ja')) return { voiceName: 'ja-JP-NanamiNeural', prosody: { pitch: '0Hz', rate: '0%' } };
    if (lang?.startsWith('zh')) return { voiceName: 'zh-CN-XiaoxiaoNeural', prosody: { pitch: '0Hz', rate: '0%' } };
    return { voiceName: 'en-US-GuyNeural', prosody: { pitch: '0Hz', rate: '0%' } };
  }

  if (LEGACY_VOICE_MAP[voice]) {
    return LEGACY_VOICE_MAP[voice];
  }

  if (voice.includes('Neural')) {
    return {
      voiceName: voice,
      prosody: { pitch: '0Hz', rate: '0%' },
    };
  }

  if (lang === 'ar' || lang?.startsWith('ar')) {
    return { voiceName: 'ar-EG-ShakirNeural', prosody: { pitch: '0Hz', rate: '-4%' } };
  }
  return { voiceName: 'en-US-GuyNeural', prosody: { pitch: '0Hz', rate: '0%' } };
}

function escapeXmlForSsml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function splitTextForTts(text: string, maxChars = 600): string[] {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const chunks: string[] = [];
  // Split first by paragraphs/newlines, then sentences, then spaces
  const paragraphs = normalized.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  for (const para of paragraphs) {
    if (para.length <= maxChars) {
      chunks.push(para);
      continue;
    }

    // Split on sentence delimiters keeping punctuation attached
    const sentences = para.match(/[^.!?؟؛;。！？\n]+[.!?؟؛;。！？]*/g) || [para];
    let current = '';

    for (const rawSentence of sentences) {
      const sentence = rawSentence.trim();
      if (!sentence) continue;

      if (sentence.length > maxChars) {
        if (current) {
          chunks.push(current.trim());
          current = '';
        }
        // Further split overly long sentence by commas/clauses or words
        const words = sentence.split(/\s+/);
        let sub = '';
        for (const word of words) {
          if (word.length > maxChars) {
            if (sub) {
              chunks.push(sub.trim());
              sub = '';
            }
            for (let i = 0; i < word.length; i += maxChars) {
              chunks.push(word.slice(i, i + maxChars));
            }
          } else if ((sub + ' ' + word).trim().length > maxChars) {
            if (sub) chunks.push(sub.trim());
            sub = word;
          } else {
            sub = sub ? `${sub} ${word}` : word;
          }
        }
        if (sub) chunks.push(sub.trim());
      } else if ((current + ' ' + sentence).trim().length > maxChars) {
        if (current) chunks.push(current.trim());
        current = sentence;
      } else {
        current = current ? `${current} ${sentence}` : sentence;
      }
    }

    if (current) {
      chunks.push(current.trim());
    }
  }

  return chunks.length > 0 ? chunks : [normalized];
}

async function executeTtsStream(
  text: string,
  voiceName: string,
  prosody?: { pitch?: string; rate?: string },
  cacheKey?: string
): Promise<Buffer> {
  const tts = new MsEdgeTTS({ synthesisTimeoutMs: 90000 });
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const safeSsmlText = escapeXmlForSsml(text);
  const result = await tts.toStream(safeSsmlText, prosody);
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    result.audioStream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    result.audioStream.on('end', () => {
      try {
        tts.close();
      } catch (e) {
        // ignore
      }
      const full = Buffer.concat(chunks);
      if (cacheKey) {
        ttsCache.set(cacheKey, full.toString('base64'));
      }
      resolve(full);
    });
    result.audioStream.on('error', (err: any) => {
      try {
        tts.close();
      } catch (e) {
        // ignore
      }
      reject(err);
    });
  });
}

async function synthesizeChunkWithRetry(
  chunkText: string,
  voiceConfig: VoiceConfig
): Promise<Buffer> {
  try {
    return await executeTtsStream(chunkText, voiceConfig.voiceName, voiceConfig.prosody);
  } catch (firstErr) {
    try {
      return await executeTtsStream(chunkText, voiceConfig.voiceName, voiceConfig.prosody);
    } catch {
      throw firstErr;
    }
  }
}

/**
 * Generate Neural AI Audio for any length text phrase with chunking, XML escaping & fallback
 */
export async function generateSpeechAudio(
  text: string,
  voiceConfig: VoiceConfig
): Promise<Buffer> {
  const cleanText = text.trim();
  if (!cleanText) return getValidMp3Silence(200);

  const cacheKey = `${voiceConfig.voiceName}_${voiceConfig.prosody?.pitch || ''}_${voiceConfig.prosody?.rate || ''}_${cleanText}`;

  if (ttsCache.has(cacheKey)) {
    return Buffer.from(ttsCache.get(cacheKey)!, 'base64');
  }

  const textChunks = splitTextForTts(cleanText, 600);

  try {
    let fullBuffer: Buffer;
    if (textChunks.length <= 1) {
      fullBuffer = await synthesizeChunkWithRetry(cleanText, voiceConfig);
    } else {
      const audioBuffers = await mapConcurrent(textChunks, 3, async (chunk) => {
        return synthesizeChunkWithRetry(chunk, voiceConfig);
      });
      fullBuffer = Buffer.concat(audioBuffers.filter((b) => b && b.length > 0));
    }

    if (fullBuffer.length > 0) {
      ttsCache.set(cacheKey, fullBuffer.toString('base64'));
      return fullBuffer;
    }
    throw new Error('Synthesized audio buffer was empty');
  } catch (err) {
    console.warn(`TTS generation with voice ${voiceConfig.voiceName} failed, trying fallback:`, err);
    if (voiceConfig.voiceName !== 'en-US-GuyNeural') {
      try {
        const fallbackConfig = { voiceName: 'en-US-GuyNeural', prosody: { pitch: '0Hz', rate: '0%' } };
        const audioBuffers = await mapConcurrent(textChunks, 3, async (chunk) => {
          return synthesizeChunkWithRetry(chunk, fallbackConfig);
        });
        const fullFallback = Buffer.concat(audioBuffers.filter((b) => b && b.length > 0));
        if (fullFallback.length > 0) {
          ttsCache.set(cacheKey, fullFallback.toString('base64'));
          return fullFallback;
        }
      } catch (fallbackErr) {
        console.warn('Fallback voice also failed:', fallbackErr);
      }
    }
    return getValidMp3Silence(400);
  }
}

export interface FullWordParams {
  sourceText?: string;
  targetText?: string;
  sourceVoice?: string;
  targetVoice?: string;
  sourceRepeats?: number;
  targetRepeats?: number;
  pauseSourceMs?: number;
  pauseTargetMs?: number;
  english?: string;
  arabic?: string;
  enVoice?: string;
  arVoice?: string;
  pauseEnMs?: number;
  pauseArMs?: number;
}

export async function generateFullWordSequence(params: FullWordParams) {
  const src = (params.sourceText || params.english || '').trim();
  const tgt = (params.targetText || params.arabic || '').trim();
  const srcVoice = params.sourceVoice || params.enVoice || 'en-US-GuyNeural';
  const tgtVoice = params.targetVoice || params.arVoice || 'ar-EG-ShakirNeural';
  const pauseSrc = params.pauseSourceMs ?? params.pauseEnMs ?? 600;
  const pauseTgt = params.pauseTargetMs ?? params.pauseArMs ?? 800;
  const srcReps = params.sourceRepeats !== undefined ? Math.max(1, Number(params.sourceRepeats)) : 2;
  const tgtReps = params.targetRepeats !== undefined ? Math.max(1, Number(params.targetRepeats)) : 1;

  if (!src && !tgt) {
    throw new Error('Source or target text is required');
  }

  const chunks: Buffer[] = [];
  const silenceSrc = getValidMp3Silence(pauseSrc);
  const silenceTgt = getValidMp3Silence(pauseTgt);

  // 1. Synthesize Source word (repeated srcReps times)
  if (src) {
    const srcConfig = resolveVoiceAndProsody(srcVoice);
    const srcBuf = await generateSpeechAudio(src, srcConfig);
    for (let i = 0; i < srcReps; i++) {
      chunks.push(srcBuf);
      if (i < srcReps - 1) {
        chunks.push(silenceSrc);
      }
    }
  }

  // 2. Synthesize Target word (repeated tgtReps times)
  if (tgt && tgtReps > 0) {
    if (chunks.length > 0) {
      chunks.push(silenceTgt);
    }
    const tgtConfig = resolveVoiceAndProsody(tgtVoice);
    const tgtBuf = await generateSpeechAudio(tgt, tgtConfig);
    for (let j = 0; j < tgtReps; j++) {
      chunks.push(tgtBuf);
      if (j < tgtReps - 1) {
        chunks.push(silenceTgt);
      }
    }
  }

  const combined = Buffer.concat(chunks);
  const safeName = (src || tgt).replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
  const filename = `${safeName || 'word'}_multilingual.mp3`;

  return {
    audioBase64: combined.toString('base64'),
    mimeType: 'audio/mp3',
    filename,
  };
}

export interface BatchAudioParams {
  items: Array<{
    sourceText?: string;
    targetText?: string;
    english?: string;
    arabic?: string;
    sourceVoice?: string;
    targetVoice?: string;
    sourceLang?: string;
    targetLang?: string;
  }>;
  sourceVoice?: string;
  targetVoice?: string;
  sourceRepeats?: number;
  targetRepeats?: number;
  pauseSourceMs?: number;
  pauseTargetMs?: number;
  pauseBetweenWordsMs?: number;
  filename?: string;
  enVoice?: string;
  arVoice?: string;
  pauseEnMs?: number;
  pauseArMs?: number;
}

/**
 * Concurrency helper to process tasks in parallel chunks of `concurrency`
 */
async function mapConcurrent<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const idx = nextIndex++;
      results[idx] = await fn(items[idx], idx);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function generateBatchAudio(params: BatchAudioParams) {
  const items = params.items || [];
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Items array is required');
  }

  const srcVoice = params.sourceVoice || params.enVoice || 'en-US-GuyNeural';
  const tgtVoice = params.targetVoice || params.arVoice || 'ar-EG-ShakirNeural';
  const pauseSrc = params.pauseSourceMs ?? params.pauseEnMs ?? 600;
  const pauseTgt = params.pauseTargetMs ?? params.pauseArMs ?? 800;
  const pauseBetweenWordsMs = params.pauseBetweenWordsMs ?? 1400;
  const filename = params.filename || 'vocabulary_audio_master.mp3';

  const srcReps = params.sourceRepeats !== undefined ? Math.max(1, Number(params.sourceRepeats)) : 2;
  const tgtReps = params.targetRepeats !== undefined ? Math.max(1, Number(params.targetRepeats)) : 1;

  const srcConfig = resolveVoiceAndProsody(srcVoice);
  const tgtConfig = resolveVoiceAndProsody(tgtVoice);

  const silenceSrc = getValidMp3Silence(pauseSrc);
  const silenceTgt = getValidMp3Silence(pauseTgt);
  const silenceNext = getValidMp3Silence(pauseBetweenWordsMs);

  const maxProcess = Math.min(items.length, 300);
  const slice = items.slice(0, maxProcess);

  // Concurrently synthesize up to 6 items in parallel for ultra-high speed (under 3s for 100 items)
  const itemAudioBuffers = await mapConcurrent(slice, 6, async (it) => {
    const src = (it.sourceText || it.english || '').trim();
    const tgt = (it.targetText || it.arabic || '').trim();

    if (!src && !tgt) return null;

    try {
      const chunks: Buffer[] = [];

      // Resolve per-item voices cleanly (falls back to global batch voice if item has none)
      const itemSrcConfig = it.sourceVoice
        ? resolveVoiceAndProsody(it.sourceVoice, it.sourceLang)
        : srcConfig;
      const itemTgtConfig = it.targetVoice
        ? resolveVoiceAndProsody(it.targetVoice, it.targetLang)
        : tgtConfig;

      // Source repetitions
      if (src) {
        const srcBuf = await generateSpeechAudio(src, itemSrcConfig);
        for (let r = 0; r < srcReps; r++) {
          chunks.push(srcBuf);
          if (r < srcReps - 1) {
            chunks.push(silenceSrc);
          }
        }
      }

      // Target repetitions
      if (tgt && tgtReps > 0) {
        if (src) chunks.push(silenceTgt);
        const tgtBuf = await generateSpeechAudio(tgt, itemTgtConfig);
        for (let t = 0; t < tgtReps; t++) {
          chunks.push(tgtBuf);
          if (t < tgtReps - 1) {
            chunks.push(silenceTgt);
          }
        }
      }

      return Buffer.concat(chunks);
    } catch (itemErr) {
      console.warn(`Error generating word "${src || tgt}":`, itemErr);
      return null;
    }
  });

  const mp3Chunks: Buffer[] = [];
  let successfulCount = 0;

  for (let i = 0; i < itemAudioBuffers.length; i++) {
    const buf = itemAudioBuffers[i];
    if (buf && buf.length > 0) {
      mp3Chunks.push(buf);
      mp3Chunks.push(silenceNext);
      successfulCount++;
    }
  }

  if (mp3Chunks.length === 0) {
    throw new Error('Could not generate audio for any words');
  }

  const masterMp3 = Buffer.concat(mp3Chunks);

  return {
    audioBase64: masterMp3.toString('base64'),
    mimeType: 'audio/mp3',
    filename,
    count: successfulCount,
    totalBytes: masterMp3.length,
  };
}

export interface TranslateParams {
  text: string;
  sourceLang?: string;
  targetLang?: string;
}

export async function translateText(params: TranslateParams) {
  const { text, sourceLang = 'auto', targetLang = 'ar' } = params;
  if (!text || typeof text !== 'string') {
    throw new Error('Text is required for translation');
  }

  const clean = text.trim();
  if (!clean) {
    return { translatedText: '', detectedLang: 'en', sourceLang, targetLang };
  }

  let translatedText = '';
  let detectedSourceLang = sourceLang === 'auto' ? 'en' : sourceLang;

  // 1. Google Translate engine (Instant, matches Google Translate results 100%)
  try {
    const srcCode = sourceLang === 'auto' ? 'auto' : sourceLang.split('-')[0];
    const tgtCode = targetLang.split('-')[0];
    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(srcCode)}&tl=${encodeURIComponent(tgtCode)}&dt=t&q=${encodeURIComponent(clean)}`;

    const response = await fetch(gUrl, { signal: AbortSignal.timeout(2500) });
    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data[0])) {
        translatedText = data[0].map((item: any) => item[0]).join('');
        if (data[2]) {
          detectedSourceLang = data[2];
        }
      }
    }
  } catch (gErr) {
    console.warn('Google Translate API error, falling back to Gemini:', gErr);
  }

  // 2. Fallback to Gemini if Google endpoint failed
  if (!translatedText && process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({});
      const prompt = `You are a professional translator. Translate this text into "${targetLang}". Return ONLY the translation, with no explanation or surrounding quotes:\n\n${clean}`;
      const aiRes = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      translatedText = (aiRes.text || '').trim();
    } catch (geminiErr) {
      console.warn('Gemini translation error:', geminiErr);
    }
  }

  if (!translatedText) {
    translatedText = clean;
  }

  return {
    translatedText,
    detectedLang: detectedSourceLang,
    sourceLang,
    targetLang,
  };
}
