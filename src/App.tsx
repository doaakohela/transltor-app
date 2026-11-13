/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Download,
  Upload,
  Trash2,
  FileText,
  CheckCircle2,
  Loader2,
  Check,
  SkipForward,
  SkipBack,
  Sliders,
  Headphones,
  Layers,
  Sparkles,
  AlertCircle,
  FolderDown,
  Repeat,
} from 'lucide-react';
import { speechService, sleep } from './services/speechService.ts';
import { AudioSettings, PlaybackStage, VocabularyItem, AppView } from './types.ts';
import { SUPPORTED_LANGUAGES, getLanguageByCode, detectLanguageFromText } from './data/languages.ts';
import { Navbar } from './components/Navbar.tsx';
import { GoogleTranslateSection } from './components/GoogleTranslateSection.tsx';
import { LanguageSelector } from './components/LanguageSelector.tsx';
import { ContinuousPlayer } from './components/ContinuousPlayer.tsx';
import { FlashcardDeck } from './components/FlashcardDeck.tsx';
import { WordListTable } from './components/WordListTable.tsx';
import { VoiceStudio } from './components/VoiceStudioModal.tsx';
import { BulkImportModal } from './components/BulkImportModal.tsx';
import { WordInputBar } from './components/WordInputBar.tsx';
import { BulkTextareaWorkstation } from './components/BulkTextareaWorkstation.tsx';
import { AdSenseSlot } from './components/AdSenseSlot.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { CookiePolicyPage } from './pages/CookiePolicyPage.tsx';
import { INITIAL_VOCABULARY, PRESET_PACKS } from './data/presets.ts';
import { SeoFaqSection } from './components/SeoFaqSection.tsx';

const DEFAULT_SETTINGS: AudioSettings = {
  sourceLang: 'en-US',
  targetLang: 'es-ES',
  sourceVoice: 'en-US-GuyNeural',
  targetVoice: 'es-ES-ElviraNeural',
  sourceRepeats: 2,
  targetRepeats: 1,

  // Backward compatibility
  enGeminiVoice: 'en-US-GuyNeural',
  arGeminiVoice: 'es-ES-ElviraNeural',
  pauseBetweenEn: 600,
  pauseBetweenEnAndAr: 800,

  pauseBetweenSource: 600,
  pauseBetweenLanguages: 800,
  pauseBetweenWords: 1400,

  autoAdvance: true,
  loopPlaylist: false,
};

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const path = (window.location.pathname || '').replace(/^\//, '').toLowerCase();
      const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
      const target = path || hash;
      if (['privacy', 'terms', 'about', 'contact', 'cookies', 'flashcards', 'studio'].includes(target)) {
        return target as AppView;
      }
    } catch {
      // fallback
    }
    return 'player';
  });

  // Keep browser history and URL in sync for SEO and crawler navigation
  useEffect(() => {
    try {
      const currentPath = window.location.pathname.replace(/^\//, '').toLowerCase();
      const expectedPath = currentView === 'player' ? '/' : `/${currentView}`;
      if (currentPath !== expectedPath.replace(/^\//, '')) {
        window.history.pushState(null, '', expectedPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  }, [currentView]);

  // Dynamic SEO metadata synchronization (Title, Description, Canonical URL, OpenGraph)
  useEffect(() => {
    try {
      const pageMeta: Record<AppView, { title: string; desc: string; path: string }> = {
        player: {
          title: 'Translate Words, Texts & Convert to MP3 | Free Neural Audio Translator',
          desc: 'Translate words and texts across 140+ world languages with natural voice pronunciation and free downloadable MP3 audio with dual repetition memorization.',
          path: '',
        },
        words: {
          title: 'Discovered Vocabulary Table | Translate Words, Texts & Convert to MP3',
          desc: 'View, filter, search, and manage your custom vocabulary list with instant pronunciation and master MP3 downloads.',
          path: '',
        },
        flashcards: {
          title: 'Flashcards Deck (1 Word Focus) | Auditory Vocabulary Memorization',
          desc: 'Interactive 3D flashcards with dual-repetition speech loops to memorize foreign language vocabulary effortlessly.',
          path: 'flashcards',
        },
        studio: {
          title: 'Voice Studio & Audio Settings | Neural Speech Generator',
          desc: 'Customize studio voices, speech speed, repetition rules, and silent pause intervals across 140+ world languages.',
          path: 'studio',
        },
        about: {
          title: 'About Us | Translate Words, Texts & Convert to MP3 (transltor.xyz)',
          desc: 'Learn about transltor.xyz, the free global translation workstation and neural speech audio generator for learners and polyglots worldwide.',
          path: 'about',
        },
        contact: {
          title: 'Contact Us & Support | Translate Words, Texts & Convert to MP3',
          desc: 'Get in touch with the transltor.xyz team for feedback, support inquiries, and partnership requests.',
          path: 'contact',
        },
        privacy: {
          title: 'Privacy Policy | Translate Words, Texts & Convert to MP3',
          desc: 'Privacy Policy for transltor.xyz explaining how your data is handled with zero tracking of personal vocabulary lists.',
          path: 'privacy',
        },
        terms: {
          title: 'Terms of Service | Translate Words, Texts & Convert to MP3',
          desc: 'Terms of service and usage policies for the transltor.xyz translation and audio workstation.',
          path: 'terms',
        },
        cookies: {
          title: 'Cookie Policy | Translate Words, Texts & Convert to MP3',
          desc: 'Cookie policy and consent preferences for transltor.xyz adhering to GDPR and CCPA standards.',
          path: 'cookies',
        },
      };

      const meta = pageMeta[currentView] || pageMeta.player;
      const canonicalUrl = meta.path ? `https://www.transltor.xyz/${meta.path}` : 'https://www.transltor.xyz/';

      document.title = meta.title;

      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) descTag.setAttribute('content', meta.desc);

      const canonicalTag = document.querySelector('link[rel="canonical"]');
      if (canonicalTag) canonicalTag.setAttribute('href', canonicalUrl);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', meta.title);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', meta.desc);

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', meta.title);

      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', meta.desc);
    } catch {
      // ignore
    }
  }, [currentView]);

  useEffect(() => {
    const handlePopState = () => {
      const path = (window.location.pathname || '').replace(/^\//, '').toLowerCase();
      const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
      const target = path || hash;
      if (['privacy', 'terms', 'about', 'contact', 'cookies', 'flashcards', 'studio'].includes(target)) {
        setCurrentView(target as AppView);
      } else {
        setCurrentView('player');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load items from localStorage or defaults
  const [items, setItems] = useState<VocabularyItem[]>(() => {
    try {
      const saved = localStorage.getItem('vocabflow_words_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter((item: any) => {
            const s = (item.sourceText || item.english || '').toLowerCase().trim();
            const t = (item.targetText || item.arabic || '').trim();
            return !(s === 'schedule' || t === 'جدول مواعيد' || t.includes('جدول مواعيد'));
          });
          return cleaned.map((item: any) => ({
            id: item.id || 'v-' + Math.random().toString(36).substring(2, 9),
            sourceText: item.sourceText || item.english || '',
            targetText: item.targetText || item.arabic || '',
            english: item.sourceText || item.english || '',
            arabic: item.targetText || item.arabic || '',
            phonetic: item.phonetic,
            category: item.category,
            mastered: Boolean(item.mastered),
            sourceLang: item.sourceLang,
            targetLang: item.targetLang,
            sourceVoice: item.sourceVoice,
            targetVoice: item.targetVoice,
            createdAt: item.createdAt || Date.now(),
          }));
        }
      }
    } catch (e) {
      console.warn('Could not read saved words:', e);
    }
    return [];
  });

  // Settings state (always enforce autoAdvance: true so "Start Listening to List" advances through all words)
  const [settings, setSettings] = useState<AudioSettings>(() => {
    try {
      const saved = localStorage.getItem('vocabflow_audio_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed, autoAdvance: true };
      }
    } catch (e) {
      console.warn('Could not read saved settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackStage, setPlaybackStage] = useState<PlaybackStage>('idle');

  // Theme state: 'dark' | 'light' (Day / Night Mode)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('vocabflow_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (e) {
      // fallback to dark
    }
    return 'dark';
  });

  // Apply theme to document element
  useEffect(() => {
    try {
      localStorage.setItem('vocabflow_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.remove('light-theme');
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.warn('Could not persist theme:', e);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modals and UI state
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const playbackSessionRef = useRef(0);

  // Keep currentIndex within bounds whenever the vocabulary list changes
  useEffect(() => {
    if (items.length === 0) {
      if (currentIndex !== 0) setCurrentIndex(0);
    } else if (currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  // Stop active playback cleanly on unmount
  useEffect(() => {
    return () => {
      playbackSessionRef.current += 1;
      isPlayingRef.current = false;
      speechService.stop();
    };
  }, []);

  // Persist items
  useEffect(() => {
    localStorage.setItem('vocabflow_words_list', JSON.stringify(items));
  }, [items]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('vocabflow_audio_settings', JSON.stringify(settings));
  }, [settings]);

  // Current language objects
  const sourceLang = getLanguageByCode(settings.sourceLang || 'en-US');
  const targetLang = getLanguageByCode(settings.targetLang || 'es-ES');

  const handleUpdateSettings = (newSettings: Partial<AudioSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const is2x1x = (settings.sourceRepeats ?? 2) === 2 && (settings.targetRepeats ?? 1) === 1;

  const handleToggleRepetitionPattern = () => {
    if (is2x1x) {
      handleUpdateSettings({ sourceRepeats: 1, targetRepeats: 2 });
    } else {
      handleUpdateSettings({ sourceRepeats: 2, targetRepeats: 1 });
    }
  };

  const resolveValidatedLanguagePair = (meta?: {
    sourceLang?: string;
    targetLang?: string;
    sourceVoice?: string;
    targetVoice?: string;
  }) => {
    const curSettings = settingsRef.current;
    const srcLangObj = getLanguageByCode(meta?.sourceLang || curSettings.sourceLang || 'en-US');
    const tgtLangObj = getLanguageByCode(meta?.targetLang || curSettings.targetLang || 'es-ES');

    const candidateSrcVoice = meta?.sourceVoice || curSettings.sourceVoice || srcLangObj.defaultVoice;
    const candidateTgtVoice = meta?.targetVoice || curSettings.targetVoice || tgtLangObj.defaultVoice;

    const sourceVoice = srcLangObj.voices.some((v) => v.id === candidateSrcVoice)
      ? candidateSrcVoice
      : srcLangObj.defaultVoice;
    const targetVoice = tgtLangObj.voices.some((v) => v.id === candidateTgtVoice)
      ? candidateTgtVoice
      : tgtLangObj.defaultVoice;

    return {
      sourceLang: srcLangObj.code,
      targetLang: tgtLangObj.code,
      sourceVoice,
      targetVoice,
    };
  };

  // Add a single word (persists its original source/target language & voice)
  const handleAddWord = (
    sourceText: string,
    targetText: string,
    meta?: {
      sourceLang?: string;
      targetLang?: string;
      sourceVoice?: string;
      targetVoice?: string;
    }
  ) => {
    if (!sourceText.trim()) return false;
    const resolved = resolveValidatedLanguagePair(meta);
    const newItem: VocabularyItem = {
      id: 'w-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      sourceText: sourceText.trim(),
      targetText: targetText.trim(),
      english: sourceText.trim(),
      arabic: targetText.trim(),
      mastered: false,
      sourceLang: resolved.sourceLang,
      targetLang: resolved.targetLang,
      sourceVoice: resolved.sourceVoice,
      targetVoice: resolved.targetVoice,
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    return true;
  };

  // Bulk Import
  const handleBulkImport = (
    newItems: Omit<VocabularyItem, 'id' | 'createdAt'>[],
    replaceExisting: boolean
  ) => {
    const prepared: VocabularyItem[] = newItems.map((it, idx) => {
      const resolved = resolveValidatedLanguagePair({
        sourceLang: it.sourceLang,
        targetLang: it.targetLang,
        sourceVoice: it.sourceVoice,
        targetVoice: it.targetVoice,
      });
      return {
        id: 'bulk-' + Date.now() + '-' + idx,
        sourceText: it.sourceText || it.english || '',
        targetText: it.targetText || it.arabic || '',
        english: it.sourceText || it.english || '',
        arabic: it.targetText || it.arabic || '',
        mastered: false,
        sourceLang: resolved.sourceLang,
        targetLang: resolved.targetLang,
        sourceVoice: resolved.sourceVoice,
        targetVoice: resolved.targetVoice,
        createdAt: Date.now() + idx,
      };
    });

    if (replaceExisting) {
      setItems(prepared);
      setCurrentIndex(0);
    } else {
      setItems((prev) => [...prepared, ...prev]);
    }
  };

  // Load preset pack (English -> Arabic)
  const handleLoadPack = (packName: string) => {
    const pack = PRESET_PACKS.find((p) => p.name === packName);
    if (!pack) return;

    const packItems: VocabularyItem[] = pack.items.map((it, idx) => ({
      id: 'pack-' + Date.now() + '-' + idx,
      sourceText: it.english,
      targetText: it.arabic,
      english: it.english,
      arabic: it.arabic,
      mastered: false,
      sourceLang: 'en-US',
      targetLang: 'ar-EG',
      sourceVoice: 'en-US-GuyNeural',
      targetVoice: 'ar-EG-ShakirNeural',
      createdAt: Date.now() + idx,
    }));

    setItems((prev) => [...packItems, ...prev]);
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (currentIndex >= items.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Clear all items and stop any active playback
  const handleClearAllItems = () => {
    playbackSessionRef.current += 1;
    isPlayingRef.current = false;
    speechService.stop();
    setIsPlaying(false);
    setPlaybackStage('idle');
    setItems([]);
    setCurrentIndex(0);
  };

  // Toggle mastered status
  const handleToggleMastered = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, mastered: !it.mastered } : it))
    );
  };

  const resolveLanguageAndVoiceForBase = (
    detectedLangCode: string,
    previousLangCode: string,
    previousVoice?: string
  ) => {
    const prevLangObj = getLanguageByCode(previousLangCode);
    const detectedObj = getLanguageByCode(detectedLangCode);
    const prevBase = prevLangObj.code.split('-')[0].split('_')[0].toLowerCase();
    const detectedBase = detectedObj.code.split('-')[0].split('_')[0].toLowerCase();

    if (detectedBase === prevBase) {
      const validPrevVoice =
        previousVoice && prevLangObj.voices.some((v) => v.id === previousVoice)
          ? previousVoice
          : prevLangObj.defaultVoice;
      return { lang: prevLangObj.code, voice: validPrevVoice };
    }

    const cur = settingsRef.current;
    const curSrcBase = (cur.sourceLang || '').split('-')[0].split('_')[0].toLowerCase();
    const curTgtBase = (cur.targetLang || '').split('-')[0].split('_')[0].toLowerCase();

    if (curSrcBase === detectedBase) {
      const srcObj = getLanguageByCode(cur.sourceLang);
      const validVoice = srcObj.voices.some((v) => v.id === cur.sourceVoice)
        ? (cur.sourceVoice as string)
        : srcObj.defaultVoice;
      return { lang: srcObj.code, voice: validVoice };
    }

    if (curTgtBase === detectedBase) {
      const tgtObj = getLanguageByCode(cur.targetLang);
      const validVoice = tgtObj.voices.some((v) => v.id === cur.targetVoice)
        ? (cur.targetVoice as string)
        : tgtObj.defaultVoice;
      return { lang: tgtObj.code, voice: validVoice };
    }

    return { lang: detectedObj.code, voice: detectedObj.defaultVoice };
  };

  const detectEditedFieldLanguage = async (
    text: string,
    previousLangCode: string,
    previousVoice?: string
  ) => {
    const trimmed = text.trim();
    if (!trimmed) {
      const prevObj = getLanguageByCode(previousLangCode);
      return { lang: prevObj.code, voice: previousVoice || prevObj.defaultVoice };
    }

    // Check backend Google auto-detection so same-script languages (e.g. French <-> English) are detected accurately
    try {
      const baseUrl = speechService.getBaseUrl();
      const res = await fetch(`${baseUrl}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          sourceLang: 'auto',
          targetLang: 'en',
        }),
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.detectedLang && typeof data.detectedLang === 'string') {
          return resolveLanguageAndVoiceForBase(
            data.detectedLang,
            previousLangCode,
            previousVoice
          );
        }
      }
    } catch {
      // Fall back to script-level detector below
    }

    const scriptDetected = detectLanguageFromText(trimmed);
    return resolveLanguageAndVoiceForBase(
      scriptDetected.code,
      previousLangCode,
      previousVoice
    );
  };

  // Update item: automatically updates language/voice, invalidates old audio, and pronounces the updated text
  const handleUpdateItem = async (id: string, sourceText: string, targetText: string) => {
    const cleanSource = sourceText.trim();
    const cleanTarget = targetText.trim();
    const existingIdx = itemsRef.current.findIndex((it) => it.id === id);
    const existingItem = existingIdx >= 0 ? itemsRef.current[existingIdx] : undefined;

    if (!existingItem) return;

    const oldSource = (existingItem.sourceText || existingItem.english || '').trim();
    const oldTarget = (existingItem.targetText || existingItem.arabic || '').trim();
    const sourceChanged = cleanSource !== oldSource;
    const targetChanged = cleanTarget !== oldTarget;

    if (!sourceChanged && !targetChanged) return;

    const curSettings = settingsRef.current;
    const prevSourceLang = existingItem.sourceLang || curSettings.sourceLang || 'en-US';
    const prevTargetLang = existingItem.targetLang || curSettings.targetLang || 'es-ES';
    const prevSourceVoice = existingItem.sourceVoice || curSettings.sourceVoice;
    const prevTargetVoice = existingItem.targetVoice || curSettings.targetVoice;

    // Unlock audio synchronously inside click/Enter gesture and stop any stale audio for this item
    const wasContinuousPlaying = isPlayingRef.current;
    speechService.invalidateItemCache(existingItem, curSettings);
    speechService.unlockAudio();
    playbackSessionRef.current += 1;
    isPlayingRef.current = false;
    speechService.stop();
    setIsPlaying(false);
    setPlaybackStage('idle');

    // Immediate script-level adjustment for instant UI feedback while async detection completes
    let immediateSrcLang = prevSourceLang;
    let immediateSrcVoice = prevSourceVoice;
    if (sourceChanged && cleanSource) {
      const quickSrc = detectLanguageFromText(cleanSource);
      if (quickSrc.script !== getLanguageByCode(prevSourceLang).script) {
        const resolved = resolveLanguageAndVoiceForBase(quickSrc.code, prevSourceLang, prevSourceVoice);
        immediateSrcLang = resolved.lang;
        immediateSrcVoice = resolved.voice;
      }
    }

    let immediateTgtLang = prevTargetLang;
    let immediateTgtVoice = prevTargetVoice;
    if (targetChanged && cleanTarget) {
      const quickTgt = detectLanguageFromText(cleanTarget);
      if (quickTgt.script !== getLanguageByCode(prevTargetLang).script) {
        const resolved = resolveLanguageAndVoiceForBase(quickTgt.code, prevTargetLang, prevTargetVoice);
        immediateTgtLang = resolved.lang;
        immediateTgtVoice = resolved.voice;
      }
    }

    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              sourceText: cleanSource,
              targetText: cleanTarget,
              english: cleanSource,
              arabic: cleanTarget,
              sourceLang: immediateSrcLang,
              targetLang: immediateTgtLang,
              sourceVoice: immediateSrcVoice,
              targetVoice: immediateTgtVoice,
            }
          : it
      )
    );

    // Accurate multi-language detection (handles Latin languages like French -> English too)
    const [finalSrc, finalTgt] = await Promise.all([
      sourceChanged && cleanSource
        ? detectEditedFieldLanguage(cleanSource, prevSourceLang, prevSourceVoice)
        : Promise.resolve({ lang: immediateSrcLang, voice: immediateSrcVoice }),
      targetChanged && cleanTarget
        ? detectEditedFieldLanguage(cleanTarget, prevTargetLang, prevTargetVoice)
        : Promise.resolve({ lang: immediateTgtLang, voice: immediateTgtVoice }),
    ]);

    const updatedItem: VocabularyItem = {
      ...existingItem,
      sourceText: cleanSource,
      targetText: cleanTarget,
      english: cleanSource,
      arabic: cleanTarget,
      sourceLang: finalSrc.lang,
      targetLang: finalTgt.lang,
      sourceVoice: finalSrc.voice,
      targetVoice: finalTgt.voice,
    };

    const nextItems = itemsRef.current.map((it) => (it.id === id ? updatedItem : it));
    itemsRef.current = nextItems;
    setItems(nextItems);

    // Automatically pronounce the newly edited text with its updated voice/language
    if (existingIdx !== -1) {
      setCurrentIndex(existingIdx);
      if (wasContinuousPlaying) {
        startListPlayback(existingIdx);
      } else {
        await speechService.playFullSequence(updatedItem, settingsRef.current);
      }
    }
  };

  // Sequential full-list playback loop (Desktop, Tablet & Mobile)
  const startListPlayback = async (startIndex: number) => {
    const sessionId = ++playbackSessionRef.current;
    isPlayingRef.current = true;
    setIsPlaying(true);

    let idx = Math.max(0, startIndex);

    while (playbackSessionRef.current === sessionId && isPlayingRef.current) {
      const list = itemsRef.current;
      if (list.length === 0) break;

      if (idx >= list.length) {
        if (settingsRef.current.loopPlaylist) {
          idx = 0;
        } else {
          break;
        }
      }

      const item = list[idx];
      const currentSettings = settingsRef.current;
      setCurrentIndex(idx);

      // Background prefetch of next item so transitions between words are seamless on Mobile/Tablet/Desktop
      if (idx + 1 < list.length) {
        window.setTimeout(() => {
          if (playbackSessionRef.current === sessionId && isPlayingRef.current) {
            speechService.prefetchFullSequence(itemsRef.current[idx + 1], settingsRef.current);
          }
        }, 150);
      }

      const completed = await speechService.playFullSequence(
        item,
        currentSettings,
        (stage) => {
          if (playbackSessionRef.current === sessionId && isPlayingRef.current) {
            setPlaybackStage(stage);
          }
        }
      );

      if (playbackSessionRef.current !== sessionId || !isPlayingRef.current) {
        break;
      }

      if (!completed) {
        // Wait a tiny beat and continue to next item rather than silently stranding the list
        await sleep(250);
        if (playbackSessionRef.current !== sessionId || !isPlayingRef.current) {
          break;
        }
      }

      const latestList = itemsRef.current;
      if (idx + 1 < latestList.length) {
        setPlaybackStage('pause_next');
        await sleep(currentSettings.pauseBetweenWords || 1400);

        if (playbackSessionRef.current !== sessionId || !isPlayingRef.current) {
          break;
        }
        idx += 1;
      } else if (currentSettings.loopPlaylist && latestList.length > 0) {
        setPlaybackStage('pause_next');
        await sleep(currentSettings.pauseBetweenWords || 1400);

        if (playbackSessionRef.current !== sessionId || !isPlayingRef.current) {
          break;
        }
        idx = 0;
      } else {
        break;
      }
    }

    if (playbackSessionRef.current === sessionId) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      setPlaybackStage('idle');
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      playbackSessionRef.current += 1;
      isPlayingRef.current = false;
      speechService.stop();
      setIsPlaying(false);
      setPlaybackStage('idle');
    } else {
      const list = itemsRef.current;
      if (list.length === 0) return;

      // Unlock browser HTMLAudioElement synchronously inside the click/tap gesture (critical for iOS/Android/Safari)
      speechService.unlockAudio();

      // If at or past the last word in a multi-word list, start cleanly from the first word (index 0)
      const startIndex =
        currentIndex < 0 ||
        currentIndex >= list.length ||
        (list.length > 1 && currentIndex >= list.length - 1)
          ? 0
          : currentIndex;

      setCurrentIndex(startIndex);
      startListPlayback(startIndex);
    }
  };

  const handleNext = () => {
    playbackSessionRef.current += 1;
    isPlayingRef.current = false;
    speechService.stop();
    setIsPlaying(false);
    setPlaybackStage('idle');
    if (currentIndex + 1 < items.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    playbackSessionRef.current += 1;
    isPlayingRef.current = false;
    speechService.stop();
    setIsPlaying(false);
    setPlaybackStage('idle');
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSelectIndex = (index: number) => {
    playbackSessionRef.current += 1;
    isPlayingRef.current = false;
    speechService.stop();
    setIsPlaying(false);
    setPlaybackStage('idle');
    setCurrentIndex(index);
  };

  const handlePlayItem = async (item: VocabularyItem) => {
    playbackSessionRef.current += 1;
    isPlayingRef.current = false;
    speechService.stop();
    speechService.unlockAudio();
    setIsPlaying(false);
    setPlaybackStage('idle');
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx !== -1) setCurrentIndex(idx);
    await speechService.playFullSequence(item, settingsRef.current);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 text-left ${
      theme === 'light'
        ? 'bg-slate-50 text-slate-900 selection:bg-amber-300 selection:text-slate-950'
        : 'bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950'
    }`} dir="ltr">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenAddModal={() => setIsBulkImportOpen(true)}
        totalWords={items.length}
        isPlaying={isPlaying}
        sourceFlag={sourceLang.flag}
        targetFlag={targetLang.flag}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area (Auto-maximized on mobile for maximum workspace width) */}
      <main className="flex-1 w-full mx-auto py-3 sm:py-4 space-y-5 sm:space-y-6 max-w-[98%] px-2 sm:px-4 md:max-w-6xl md:px-6 transition-all duration-300">

        {/* Top Google AdSense Responsive Leaderboard Unit */}
        <AdSenseSlot format="leaderboard" />

        {/* Studio Workstation Views (Translation, Live Player, Vocabulary Table, Bulk Input, MP3 Download, Voices) */}
        {currentView === 'player' && (
          <div className="space-y-6 animate-fade-in">
            {/* Card 1: Top Google Translate Section */}
            <GoogleTranslateSection
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onAddWord={handleAddWord}
              theme={theme}
            />

            {/* Card 2: Live Listening Continuous Player (Immediately after Translation) */}
            <ContinuousPlayer
              items={items}
              currentIndex={currentIndex}
              isPlaying={isPlaying}
              stage={playbackStage}
              settings={settings}
              onPlayToggle={handleTogglePlay}
              onNext={handleNext}
              onPrev={handlePrev}
              onSelectIndex={handleSelectIndex}
              onToggleMastered={handleToggleMastered}
              onUpdateSettings={handleUpdateSettings}
              theme={theme}
              viewSection="player"
            />

            {/* Card 3: Vocabulary Table with Actions Column */}
            <WordListTable
              items={items}
              settings={settings}
              onDeleteItem={handleDeleteItem}
              onClearAll={handleClearAllItems}
              onToggleMastered={handleToggleMastered}
              onUpdateItem={handleUpdateItem}
              onPlayItem={handlePlayItem}
              theme={theme}
            />

            {/* Card 4: Bulk Word & Text Input */}
            <BulkTextareaWorkstation
              items={items}
              onSetItems={setItems}
              sourceLangName={sourceLang.name}
              targetLangName={targetLang.name}
              sourceLangCode={sourceLang.code}
              targetLangCode={targetLang.code}
              sourceVoice={
                sourceLang.voices.some((v) => v.id === settings.sourceVoice)
                  ? settings.sourceVoice
                  : sourceLang.defaultVoice
              }
              targetVoice={
                targetLang.voices.some((v) => v.id === settings.targetVoice)
                  ? settings.targetVoice
                  : targetLang.defaultVoice
              }
              theme={theme}
            />

            {/* Card 5: Download MP3 Audio Files (All Words & Parts) */}
            <ContinuousPlayer
              items={items}
              currentIndex={currentIndex}
              isPlaying={isPlaying}
              stage={playbackStage}
              settings={settings}
              onPlayToggle={handleTogglePlay}
              onNext={handleNext}
              onPrev={handlePrev}
              onSelectIndex={handleSelectIndex}
              onToggleMastered={handleToggleMastered}
              onUpdateSettings={handleUpdateSettings}
              theme={theme}
              viewSection="download"
            />

            {/* Mid-Content In-Feed Google AdSense Slot */}
            <AdSenseSlot format="in-feed" />

            {/* Card 6: Universal Language & Studio Voice Selector */}
            <LanguageSelector
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              theme={theme}
            />

            {/* Card 7: View Switcher Tabs Bar (Flashcards & Voice Settings) */}
            <div
              className={`flex items-center justify-between rounded-2xl p-2 gap-2 overflow-x-auto border transition-colors ${
                theme === 'light'
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-900/90 border-slate-800 shadow-lg'
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('player')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap border ${
                    theme === 'light'
                      ? 'bg-[#174ea6] hover:bg-[#1557b0] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] shadow-md shadow-blue-500/25'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-md shadow-indigo-600/25'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Studio Workstation</span>
                </button>

                <button
                  onClick={() => setCurrentView('flashcards')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border ${
                    theme === 'light'
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Layers className={`w-4 h-4 ${theme === 'light' ? 'text-white' : ''}`} />
                  <span>Flashcards Deck (1 Word Focus)</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      theme === 'light'
                        ? 'bg-[#174ea6] text-white font-bold border border-white/25'
                        : 'bg-slate-950/60 text-amber-300'
                    }`}
                  >
                    {items.length} cards
                  </span>
                </button>

                <button
                  onClick={() => setCurrentView('studio')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border ${
                    theme === 'light'
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <Sliders className={`w-4 h-4 ${theme === 'light' ? 'text-white' : 'text-amber-400'}`} />
                  <span>Voice Settings</span>
                </button>
              </div>

              {/* Repetition Mode Quick Toggle Icon Button */}
              <div className="flex items-center gap-2 pr-2 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleRepetitionPattern}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95 whitespace-nowrap ${
                    theme === 'light'
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                      : is2x1x
                      ? 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-700/80'
                      : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-600/80'
                  }`}
                  title="Click to switch audio repetition mode: (2x Source + 1x Target) ⇄ (1x Source + 2x Target)"
                >
                  <Repeat
                    className={`w-3.5 h-3.5 ${
                      theme === 'light'
                        ? 'text-white'
                        : is2x1x
                        ? 'text-indigo-400'
                        : 'text-amber-400 animate-pulse'
                    }`}
                  />
                  <span>{is2x1x ? '2x Source + 1x Target' : '1x Source + 2x Target'}</span>
                  <span className="text-[10px] opacity-85">⇄</span>
                </button>
              </div>
            </div>

            {/* Semantic SEO & FAQ Guide for Search Engine Ranking */}
            <SeoFaqSection theme={theme} />
          </div>
        )}

        {/* View 2: Flashcards Deck */}
        {currentView === 'flashcards' && (
          <FlashcardDeck
            items={items}
            settings={settings}
            onToggleMastered={handleToggleMastered}
            theme={theme}
          />
        )}

        {/* View 3: Voice Studio */}
        {currentView === 'studio' && (
          <VoiceStudio
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            theme={theme}
          />
        )}

        {/* Google AdSense Mandatory Legal & Information Pages */}
        {currentView === 'privacy' && (
          <PrivacyPolicyPage
            onBack={() => setCurrentView('player')}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'terms' && (
          <TermsPage
            onBack={() => setCurrentView('player')}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onBack={() => setCurrentView('player')}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage
            onBack={() => setCurrentView('player')}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'cookies' && (
          <CookiePolicyPage
            onBack={() => setCurrentView('player')}
            onNavigate={setCurrentView}
          />
        )}

        {/* Bottom Google AdSense Leaderboard Placement */}
        <AdSenseSlot format="footer" />
      </main>

      {/* Modals */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={handleBulkImport}
        sourceLangName={sourceLang.name}
        targetLangName={targetLang.name}
        theme={theme}
      />

      {/* Professional AdSense-Compliant Multi-Column Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 pt-10 pb-8 text-xs text-slate-400 mt-12 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            {/* Col 1: Brand & Mission */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs">
                  <Volume2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-white">
                  Translate Words, Texts &amp; Convert to MP3
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                100% Free Lifetime global translation workstation. Repeat source words twice and translations once for rapid auditory memorization, with genuine offline MP3 generation.
              </p>
              <div className="text-xs text-slate-400 pt-1">
                Official Web App:{' '}
                <a href="https://www.transltor.xyz" className="text-amber-400 hover:underline font-semibold">
                  www.transltor.xyz
                </a>{' '}
                <span className="text-slate-600">(doaa.transltor.xyz)</span>
              </div>
            </div>

            {/* Col 2: Navigation & Tools */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-white">Platform &amp; Tools</div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => setCurrentView('player')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Studio Workstation
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('flashcards')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Flashcards Deck (1 Word)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('studio')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Voice Settings &amp; Speeds
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsBulkImportOpen(true)} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Bulk Word Importer (TXT/CSV)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: AdSense Policy & Legal Pages */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-white">Legal &amp; Policies</div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => setCurrentView('privacy')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('terms')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('cookies')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Cookie Policy &amp; Consent
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('about')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('contact')} className="hover:text-amber-400 transition-colors cursor-pointer">
                    Contact Us &amp; Support
                  </button>
                </li>
                <li className="pt-1">
                  <a href="mailto:doaa@transltor.xyz" className="text-amber-400/90 hover:underline font-mono text-[11px]">
                    ✉ doaa@transltor.xyz
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* AdSense Notice & Copyright Bottom Bar */}
          <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <p>
              © 2026 Translate Words, Texts &amp; Convert to MP3 (www.transltor.xyz). All rights reserved.
            </p>
            <p className="text-slate-500">
              Monetized via Google AdSense · Zero tracking of personal vocabulary
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
