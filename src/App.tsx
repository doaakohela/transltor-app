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
  Puzzle,
  Globe,
  FolderDown,
} from 'lucide-react';
import { speechService, sleep } from './services/speechService.ts';
import { AudioSettings, PlaybackStage, VocabularyItem, AppView } from './types.ts';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from './data/languages.ts';
import { Navbar } from './components/Navbar.tsx';
import { GoogleTranslateSection } from './components/GoogleTranslateSection.tsx';
import { LanguageSelector } from './components/LanguageSelector.tsx';
import { ContinuousPlayer } from './components/ContinuousPlayer.tsx';
import { FlashcardDeck } from './components/FlashcardDeck.tsx';
import { WordListTable } from './components/WordListTable.tsx';
import { VoiceStudio } from './components/VoiceStudioModal.tsx';
import { BulkImportModal } from './components/BulkImportModal.tsx';
import { ChromeExtensionModal } from './components/ChromeExtensionModal.tsx';
import { WordInputBar } from './components/WordInputBar.tsx';
import { BulkTextareaWorkstation } from './components/BulkTextareaWorkstation.tsx';
import { INITIAL_VOCABULARY, PRESET_PACKS } from './data/presets.ts';

const DEFAULT_SETTINGS: AudioSettings = {
  sourceLang: 'en-US',
  targetLang: 'es-ES',
  sourceVoice: 'en-US-GuyNeural',
  targetVoice: 'es-ES-ElviraNeural',
  sourceRepeats: 2,
  targetRepeats: 1,

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
  const [currentView, setCurrentView] = useState<AppView>('player');

  // Hidden Admin Mode check: Visible only if URL contains ?admin=true (Private for you only)
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true') {
        setIsAdmin(true);
        localStorage.setItem('vocabflow_admin_mode', 'true');
      } else if (localStorage.getItem('vocabflow_admin_mode') === 'true') {
        setIsAdmin(true);
      }
    } catch (e) {
      // fallback
    }
  }, []);

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
            createdAt: item.createdAt || Date.now(),
          }));
        }
      }
    } catch (e) {
      console.warn('Could not read saved words:', e);
    }
    return [];
  });

  const [settings, setSettings] = useState<AudioSettings>(() => {
    try {
      const saved = localStorage.getItem('vocabflow_audio_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Could not read saved settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackStage, setPlaybackStage] = useState<PlaybackStage>('idle');

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('vocabflow_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (e) {
      // fallback
    }
    return 'dark';
  });

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

  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    localStorage.setItem('vocabflow_words_list', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('vocabflow_audio_settings', JSON.stringify(settings));
  }, [settings]);

  const sourceLang = getLanguageByCode(settings.sourceLang || 'en-US');
  const targetLang = getLanguageByCode(settings.targetLang || 'es-ES');

  const handleUpdateSettings = (newSettings: Partial<AudioSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleAddWord = (sourceText: string, targetText: string) => {
    if (!sourceText.trim()) return false;
    const newItem: VocabularyItem = {
      id: 'w-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      sourceText: sourceText.trim(),
      targetText: targetText.trim(),
      english: sourceText.trim(),
      arabic: targetText.trim(),
      mastered: false,
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    return true;
  };

  const handleBulkImport = (
    newItems: Omit<VocabularyItem, 'id' | 'createdAt'>[],
    replaceExisting: boolean
  ) => {
    const prepared: VocabularyItem[] = newItems.map((it, idx) => ({
      id: 'bulk-' + Date.now() + '-' + idx,
      sourceText: it.sourceText || it.english || '',
      targetText: it.targetText || it.arabic || '',
      english: it.sourceText || it.english || '',
      arabic: it.targetText || it.arabic || '',
      mastered: false,
      createdAt: Date.now() + idx,
    }));

    if (replaceExisting) {
      setItems(prepared);
      setCurrentIndex(0);
    } else {
      setItems((prev) => [...prepared, ...prev]);
    }
  };

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
      createdAt: Date.now() + idx,
    }));

    setItems((prev) => [...packItems, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (currentIndex >= items.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleToggleMastered = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, mastered: !it.mastered } : it))
    );
  };

  const handleUpdateItem = (id: string, sourceText: string, targetText: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              sourceText,
              targetText,
              english: sourceText,
              arabic: targetText,
            }
          : it
      )
    );
  };

  const runPlaybackSequence = async (index: number) => {
    const list = itemsRef.current;
    if (list.length === 0 || index >= list.length) {
      setIsPlaying(false);
      setPlaybackStage('idle');
      return;
    }

    const item = list[index];
    const currentSettings = settingsRef.current;

    const completed = await speechService.playFullSequence(
      item,
      currentSettings,
      (stage) => {
        setPlaybackStage(stage);
      }
    );

    if (!completed || !isPlayingRef.current) {
      setPlaybackStage('idle');
      return;
    }

    if (currentSettings.autoAdvance) {
      if (index + 1 < list.length) {
        setPlaybackStage('pause_next');
        await sleep(currentSettings.pauseBetweenWords || 1400);

        if (!isPlayingRef.current) {
          setPlaybackStage('idle');
          return;
        }

        setCurrentIndex(index + 1);
        runPlaybackSequence(index + 1);
      } else if (currentSettings.loopPlaylist && list.length > 0) {
        setPlaybackStage('pause_next');
        await sleep(currentSettings.pauseBetweenWords || 1400);
        if (!isPlayingRef.current) return;
        setCurrentIndex(0);
        runPlaybackSequence(0);
      } else {
        setIsPlaying(false);
        setPlaybackStage('idle');
      }
    } else {
      setIsPlaying(false);
      setPlaybackStage('idle');
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      setPlaybackStage('idle');
    } else {
      if (items.length === 0) return;
      setIsPlaying(true);
      const startIndex = currentIndex >= items.length ? 0 : currentIndex;
      setCurrentIndex(startIndex);
      runPlaybackSequence(startIndex);
    }
  };

  const handleNext = () => {
    speechService.stop();
    setIsPlaying(false);
    setPlaybackStage('idle');
    if (currentIndex + 1 < items.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    speechService.stop();
    setIsPlaying(false);
    setPlaybackStage('idle');
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSelectIndex = (index: number) => {
    speechService.stop();
    setIsPlaying(false);
    setPlaybackStage('idle');
    setCurrentIndex(index);
  };

  const handlePlayItem = async (item: VocabularyItem) => {
    speechService.stop();
    setIsPlaying(false);
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
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenAddModal={() => setIsBulkImportOpen(true)}
        onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
        totalWords={items.length}
        isPlaying={isPlaying}
        sourceFlag={sourceLang.flag}
        targetFlag={targetLang.flag}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main
        className={`flex-1 w-full mx-auto py-6 space-y-6 transition-all duration-300 ${
          isExpanded ? 'max-w-[98%] px-3 sm:px-6' : 'max-w-6xl px-4 sm:px-6'
        }`}
      >
        {isAdmin && (
          <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3 text-left">
              <span className="px-2.5 py-1 text-[11px] font-extrabold bg-amber-400 text-slate-950 rounded-lg shadow-sm shrink-0 uppercase tracking-wider">
                Admin Panel Mode
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                🔒 Admin mode active. Project controls are unlocked for you.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <span>{isExpanded ? '⤡ Compact View' : '⤢ Maximize View'}</span>
              </button>
            </div>
          </div>
        )}

        <GoogleTranslateSection
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onAddWord={handleAddWord}
        />

        <LanguageSelector
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />

        <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-2 gap-2 overflow-x-auto shadow-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('player')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                currentView === 'player'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Studio Workstation</span>
            </button>

            <button
              onClick={() => setCurrentView('flashcards')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                currentView === 'flashcards'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-400/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Flashcards Deck</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-950/60 text-amber-300">
                {items.length} cards
              </span>
            </button>

            <button
              onClick={() => setCurrentView('studio')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                currentView === 'studio'
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Voice Settings</span>
            </button>
          </div>
        </div>

        {currentView === 'player' && (
          <div className="space-y-6 animate-fade-in">
            <BulkTextareaWorkstation
              items={items}
              onSetItems={setItems}
              sourceLangName={sourceLang.name}
              targetLangName={targetLang.name}
            />

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
            />

            <WordListTable
              items={items}
              settings={settings}
              onDeleteItem={handleDeleteItem}
              onToggleMastered={handleToggleMastered}
              onUpdateItem={handleUpdateItem}
              onPlayItem={handlePlayItem}
            />
          </div>
        )}

        {currentView === 'flashcards' && (
          <FlashcardDeck
            items={items}
            settings={settings}
            onToggleMastered={handleToggleMastered}
          />
        )}

        {currentView === 'studio' && (
          <VoiceStudio
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={handleBulkImport}
        sourceLangName={sourceLang.name}
        targetLangName={targetLang.name}
      />

      <ChromeExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
      />

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>Translate Words, Texts &amp; Convert to MP3 — All Rights Reserved</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExtensionModalOpen(true)}
              className="text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Puzzle className="w-3.5 h-3.5 text-amber-400" />
              <span>Install Chrome Extension</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
