import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeftRight,
  Volume2,
  Copy,
  Check,
  X,
  Plus,
  Sparkles,
  Loader2,
  ChevronDown,
  Globe,
  Search,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  getLanguageByCode,
  detectLanguageFromText,
} from '../data/languages.ts';
import { AudioSettings } from '../types.ts';
import { speechService } from '../services/speechService.ts';

interface GoogleTranslateSectionProps {
  settings: AudioSettings;
  onUpdateSettings: (newSettings: Partial<AudioSettings>) => void;
  onAddWord: (sourceText: string, targetText: string) => boolean;
  theme?: 'dark' | 'light';
}

const POPULAR_LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'ar-EG', name: 'Arabic', flag: '🇪🇬' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
];

export const GoogleTranslateSection: React.FC<GoogleTranslateSectionProps> = ({
  settings,
  onUpdateSettings,
  onAddWord,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [detectedLangCode, setDetectedLangCode] = useState<string>('en-US');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingSource, setIsPlayingSource] = useState(false);
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Google Translate-style Full Panel Picker state: 'source' | 'target' | null
  const [activePicker, setActivePicker] = useState<'source' | 'target' | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastTranslatedKeyRef = useRef<string>('');

  const currentSourceLang = isAutoDetect
    ? getLanguageByCode(detectedLangCode)
    : getLanguageByCode(settings.sourceLang || 'en-US');
  const currentTargetLang = getLanguageByCode(settings.targetLang || 'es-ES');

  // Focus search input whenever picker opens
  useEffect(() => {
    if (activePicker) {
      setPickerSearch('');
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [activePicker]);

  // Close picker on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePicker) {
        setActivePicker(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePicker]);

  // Trigger translation with multi-tier engine (Direct Google Translate + Server Proxy)
  const translateText = async (text: string, srcCode: string, tgtCode: string) => {
    const clean = text.trim();
    if (!clean) {
      setTranslatedText('');
      setIsTranslating(false);
      lastTranslatedKeyRef.current = '';
      return;
    }

    const sl = isAutoDetect ? 'auto' : srcCode.split('-')[0];
    const tl = tgtCode.split('-')[0];
    const requestKey = `${clean}::${sl}::${tl}`;

    // Skip if identical request is already completed
    if (requestKey === lastTranslatedKeyRef.current && translatedText) {
      setIsTranslating(false);
      return;
    }

    // Abort previous in-flight request to prevent race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsTranslating(true);

    // 1. Try Direct Google Translate (Native browser query - matches Google Translate 100%)
    try {
      const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
        sl
      )}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(clean)}`;
      const res = await fetch(gUrl, { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data[0])) {
          const directTranslation = data[0].map((item: any) => item[0]).join('');
          if (directTranslation) {
            setTranslatedText(directTranslation);
            lastTranslatedKeyRef.current = requestKey;
            if (data[2] && isAutoDetect) {
              const matchedLang = getLanguageByCode(data[2]);
              if (matchedLang.code !== detectedLangCode) {
                setDetectedLangCode(matchedLang.code);
              }
            }
            setIsTranslating(false);
            return;
          }
        }
      }
    } catch (directErr: any) {
      if (directErr?.name === 'AbortError') return;
      // Fallback to server route
    }

    // 2. Server Proxy Route Fallback
    try {
      const baseUrl = speechService.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: clean,
          sourceLang: isAutoDetect ? 'auto' : srcCode,
          targetLang: tgtCode,
        }),
        signal: controller.signal,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translatedText) {
          setTranslatedText(data.translatedText);
          lastTranslatedKeyRef.current = requestKey;
        }
        if (data.detectedLang && isAutoDetect) {
          const matchedLang = getLanguageByCode(data.detectedLang);
          if (matchedLang.code !== detectedLangCode) {
            setDetectedLangCode(matchedLang.code);
          }
        }
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.warn('Translation proxy failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Debounced translation on source text change (WITHOUT circular onUpdateSettings feedback loops)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const clean = sourceText.trim();
    if (!clean) {
      setTranslatedText('');
      setIsTranslating(false);
      lastTranslatedKeyRef.current = '';
      return;
    }

    // Quick local script detection (updates local state without mutating parent settings on every keystroke)
    if (isAutoDetect) {
      const detected = detectLanguageFromText(sourceText);
      if (detected.code !== detectedLangCode) {
        setDetectedLangCode(detected.code);
      }
    }

    debounceTimerRef.current = setTimeout(() => {
      translateText(sourceText, settings.sourceLang || 'en-US', settings.targetLang || 'es-ES');
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [sourceText, settings.sourceLang, settings.targetLang, isAutoDetect]);

  // Handle Swap
  const handleSwap = () => {
    if (isAutoDetect) {
      setIsAutoDetect(false);
    }
    const oldSource = currentSourceLang.code;
    const oldTarget = currentTargetLang.code;

    onUpdateSettings({
      sourceLang: oldTarget,
      sourceVoice: currentTargetLang.defaultVoice,
      targetLang: oldSource,
      targetVoice: currentSourceLang.defaultVoice,
    });

    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  // Select language from picker
  const handleSelectLanguage = (langCode: string) => {
    const lang = getLanguageByCode(langCode);
    if (activePicker === 'source') {
      setIsAutoDetect(false);
      onUpdateSettings({
        sourceLang: lang.code,
        sourceVoice: lang.defaultVoice,
      });
    } else if (activePicker === 'target') {
      onUpdateSettings({
        targetLang: lang.code,
        targetVoice: lang.defaultVoice,
      });
    }
    setActivePicker(null);
  };

  // Listen to source text
  const handleListenSource = async () => {
    if (isPlayingSource || !sourceText.trim()) return;
    setIsPlayingSource(true);
    try {
      const voice = settings.sourceVoice || currentSourceLang.defaultVoice;
      await speechService.speakText(sourceText.trim(), currentSourceLang.code, voice);
    } finally {
      setIsPlayingSource(false);
    }
  };

  // Listen to target text
  const handleListenTarget = async () => {
    if (isPlayingTarget || !translatedText.trim()) return;
    setIsPlayingTarget(true);
    try {
      const voice = settings.targetVoice || currentTargetLang.defaultVoice;
      await speechService.speakText(translatedText.trim(), currentTargetLang.code, voice);
    } finally {
      setIsPlayingTarget(false);
    }
  };

  // Copy target text
  const handleCopyTarget = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopiedTarget(true);
    setTimeout(() => setCopiedTarget(false), 2000);
  };

  // Add translated word to vocabulary list
  const handleAddToVocab = () => {
    if (!sourceText.trim()) return;
    const ok = onAddWord(sourceText.trim(), translatedText.trim());
    if (ok) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    }
  };

  // Filter languages for the full picker across all 140+ languages
  const filteredPickerLanguages = SUPPORTED_LANGUAGES.filter((l) => {
    const query = pickerSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      l.name.toLowerCase().includes(query) ||
      l.nativeName.toLowerCase().includes(query) ||
      l.code.toLowerCase().includes(query)
    );
  });

  return (
    <div
      className={`relative border rounded-3xl shadow-xl overflow-hidden transition-all text-left ${
        isLight
          ? 'bg-white border-slate-200'
          : 'bg-slate-900/95 border-slate-800'
      }`}
    >
      {/* Mobile-Only Compact Language Bar (< 768px): 2 clear language buttons + swap */}
      <div
        className={`flex md:hidden items-center justify-between gap-2 px-3 py-2.5 border-b ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-950/70 border-slate-800'
        }`}
      >
        <button
          type="button"
          onClick={() => setActivePicker('source')}
          className={`flex-1 min-w-0 min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-1.5 cursor-pointer border ${
            isLight
              ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] shadow-sm'
              : 'bg-indigo-950/70 text-indigo-200 border-indigo-500/40'
          }`}
          title="Select source language"
        >
          <span className="flex items-center gap-1.5 min-w-0">
            <span className="shrink-0">{currentSourceLang.flag}</span>
            <span className="truncate">{currentSourceLang.name}</span>
          </span>
          <ChevronDown className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-white' : 'text-indigo-400'}`} />
        </button>

        <button
          type="button"
          onClick={handleSwap}
          className={`min-w-[44px] min-h-[44px] p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer ${
            isLight
              ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-800'
          }`}
          title="Swap source and target languages"
        >
          <ArrowLeftRight className={`w-4 h-4 ${isLight ? 'text-white' : 'text-amber-500'}`} />
        </button>

        <button
          type="button"
          onClick={() => setActivePicker('target')}
          className={`flex-1 min-w-0 min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-1.5 cursor-pointer border ${
            isLight
              ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] shadow-sm'
              : 'bg-amber-950/70 text-amber-300 border-amber-500/50'
          }`}
          title="Select target language"
        >
          <span className="flex items-center gap-1.5 min-w-0">
            <span className="shrink-0">{currentTargetLang.flag}</span>
            <span className="truncate">{currentTargetLang.name}</span>
          </span>
          <ChevronDown className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-white' : 'text-amber-400'}`} />
        </button>
      </div>

      {/* Tablet & Desktop Top Language Bar (>= 768px) */}
      <div
        className={`hidden md:flex px-3 lg:px-5 py-3 flex-nowrap items-center justify-between gap-2 lg:gap-3 border-b ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-950/70 border-slate-800'
        }`}
      >
        {/* Source Language Controls */}
        <div className="flex items-center flex-nowrap gap-1 lg:gap-1.5 flex-1 min-w-0">
          {/* Detect Language Button */}
          <button
            type="button"
            onClick={() => setIsAutoDetect(true)}
            className={`px-2.5 lg:px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer border ${
              isAutoDetect
                ? isLight
                  ? 'bg-[#174ea6] hover:bg-[#1557b0] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] shadow-md shadow-blue-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-md shadow-indigo-600/30'
                : isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border-transparent'
            }`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 shrink-0 ${
                isLight ? 'text-white' : 'text-amber-400'
              }`}
            />
            <span className="truncate max-w-[105px] lg:max-w-[115px] xl:max-w-[140px]">
              Detect language {isAutoDetect && sourceText ? `(${currentSourceLang.name})` : ''}
            </span>
          </button>

          {/* Active Source Language Button (Click opens full picker) */}
          <button
            type="button"
            onClick={() => setActivePicker('source')}
            className={`px-2.5 lg:px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer border ${
              !isAutoDetect
                ? isLight
                  ? 'bg-[#174ea6] hover:bg-[#1557b0] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] shadow-xs'
                  : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50 shadow-sm'
                : isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800'
            }`}
            title="Click to choose from all world languages"
          >
            <span className="shrink-0">{currentSourceLang.flag}</span>
            <span className="truncate max-w-[95px] lg:max-w-[110px] xl:max-w-[135px]">{currentSourceLang.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-white' : 'text-indigo-400'}`} />
          </button>

          {/* Full List Button (Shown on Desktop lg+; on Tablet clicking language button opens full list) */}
          <button
            type="button"
            onClick={() => setActivePicker('source')}
            className={`hidden lg:flex px-2.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors items-center gap-1 cursor-pointer border ${
              isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800/60 border-transparent'
            }`}
            title="Browse all world languages"
          >
            <span>All Languages</span>
            <ChevronDown className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-white' : ''}`} />
          </button>
        </div>

        {/* Center Swap Button */}
        <button
          type="button"
          onClick={handleSwap}
          className={`p-2.5 rounded-2xl border transition-all hover:scale-105 active:scale-95 shadow-sm shrink-0 cursor-pointer ${
            isLight
              ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-white'
          }`}
          title="Swap source and target languages"
        >
          <ArrowLeftRight className={`w-4 h-4 ${isLight ? 'text-white' : 'text-amber-500'}`} />
        </button>

        {/* Target Language Controls */}
        <div className="flex items-center flex-nowrap gap-1 lg:gap-1.5 flex-1 justify-end min-w-0">
          {/* Active Target Language Button (Click opens full picker) */}
          <button
            type="button"
            onClick={() => setActivePicker('target')}
            className={`px-2.5 lg:px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer border ${
              isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                : 'bg-amber-950/70 text-amber-300 border-amber-500/50 hover:border-amber-400'
            }`}
            title="Click to choose target language from all world languages"
          >
            <span className="shrink-0">{currentTargetLang.flag}</span>
            <span className="truncate max-w-[120px] lg:max-w-[150px] xl:max-w-[180px]">{currentTargetLang.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-white' : 'text-amber-400'}`} />
          </button>

          {/* Full List Button (Shown on Desktop lg+; on Tablet clicking language button opens full list) */}
          <button
            type="button"
            onClick={() => setActivePicker('target')}
            className={`hidden lg:flex px-2.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors items-center gap-1 cursor-pointer border ${
              isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 border-transparent'
            }`}
            title="Browse all world languages"
          >
            <span>All Languages</span>
            <ChevronDown className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Full Vertical Language Selection Modal (Desktop, Tablet, & Mobile) */}
      {activePicker && (
        <div
          onClick={() => setActivePicker(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg max-h-[85vh] rounded-3xl flex flex-col overflow-hidden text-left shadow-2xl border ${
              isLight
                ? 'bg-white text-slate-900 border-slate-200'
                : 'bg-slate-950 text-white border-slate-800'
            }`}
          >
            {/* Picker Top Header */}
            <div
              className={`px-4 sm:px-6 py-4 flex items-center justify-between border-b shrink-0 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 ${
                    isLight ? 'bg-[#1a73e8]' : 'bg-gradient-to-tr from-indigo-500 to-amber-500'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className={`text-sm sm:text-base font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Select {activePicker === 'source' ? 'Source' : 'Target'} Language ({SUPPORTED_LANGUAGES.length})
                  </h3>
                  <p className={`text-xs truncate ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                    Comprehensive world languages with neural studio voices
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePicker(null)}
                className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ml-2 ${
                  isLight
                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Close picker (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="px-4 sm:px-6 pt-4 pb-3 shrink-0">
              <div className="relative">
                <Search
                  className={`w-4 h-4 absolute left-3.5 top-3.5 ${
                    isLight ? 'text-[#1a73e8]' : 'text-slate-400'
                  }`}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search languages by name, native script, or code..."
                  className={`w-full rounded-2xl pl-10 pr-10 py-3 text-sm outline-none transition-all shadow-inner ${
                    isLight
                      ? 'bg-slate-50 border border-slate-300 focus:border-[#1a73e8] text-slate-900 placeholder:text-slate-500'
                      : 'bg-slate-900 border border-slate-700/80 focus:border-amber-400 text-white placeholder-slate-500'
                  }`}
                />
                {pickerSearch && (
                  <button
                    type="button"
                    onClick={() => setPickerSearch('')}
                    className={`absolute right-3.5 top-3.5 p-0.5 rounded cursor-pointer ${
                      isLight ? 'bg-[#1a73e8] text-white hover:bg-[#1557b0]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Popular Pills + Auto-Detect Option (Wrapped vertically, zero horizontal scrollbar) */}
            {!pickerSearch && (
              <div
                className={`px-4 sm:px-6 pb-3 border-b flex flex-wrap items-center gap-1.5 shrink-0 ${
                  isLight ? 'border-slate-100' : 'border-slate-800/80'
                }`}
              >
                {activePicker === 'source' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoDetect(true);
                      setActivePicker(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      isAutoDetect
                        ? isLight
                          ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8]'
                          : 'bg-indigo-600 text-white border-indigo-500'
                        : isLight
                        ? 'bg-[#1a73e8] hover:bg-[#1557b0] border-[#1a73e8] text-white'
                        : 'bg-indigo-950/80 hover:bg-indigo-900 border-indigo-700 text-indigo-200'
                    }`}
                  >
                    <Sparkles
                      className={`w-3.5 h-3.5 ${
                        isLight ? 'text-white' : 'text-amber-400'
                      }`}
                    />
                    <span>Detect language</span>
                  </button>
                )}
                {POPULAR_LANGUAGES.slice(0, 6).map((pl) => (
                  <button
                    key={pl.code}
                    type="button"
                    onClick={() => handleSelectLanguage(pl.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${
                      isLight
                        ? 'bg-[#1a73e8] hover:bg-[#1557b0] border-[#1a73e8] text-white'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{pl.flag}</span>
                    <span>{pl.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Vertical Single-Column Alphabetical Languages List (Desktop, Tablet, Mobile) */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 custom-scrollbar">
              <div className="flex flex-col space-y-1.5">
                {filteredPickerLanguages.map((lang) => {
                  const isSelected =
                    activePicker === 'source'
                      ? !isAutoDetect && settings.sourceLang === lang.code
                      : settings.targetLang === lang.code;

                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer group ${
                        isSelected
                          ? isLight
                            ? 'bg-[#1a73e8] border-[#1557b0] text-white font-bold shadow-sm'
                            : 'bg-amber-400/15 border-amber-400/60 shadow-md text-amber-200'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 hover:bg-[#1a73e8] hover:border-[#1a73e8] hover:text-white text-slate-800'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl shrink-0">{lang.flag}</span>
                        <div className="min-w-0">
                          <div
                            className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                              isLight
                                ? isSelected
                                  ? 'text-white'
                                  : 'text-slate-900 group-hover:text-white'
                                : 'text-white group-hover:text-amber-300'
                            }`}
                          >
                            {lang.name}
                          </div>
                          <div
                            className={`text-[11px] truncate mt-0.5 ${
                              isLight
                                ? isSelected
                                  ? 'text-blue-100'
                                  : 'text-slate-600 group-hover:text-blue-100 font-medium'
                                : 'text-slate-400'
                            }`}
                          >
                            {lang.nativeName}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <Check
                          className={`w-4 h-4 shrink-0 ml-2 ${
                            isLight ? 'text-white' : 'text-amber-400'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {filteredPickerLanguages.length === 0 && (
                <div
                  className={`text-center py-12 text-xs ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  No languages match "{pickerSearch}". Try searching by country, code, or native script.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Dual Translation Panels */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${
          isLight ? 'divide-slate-200' : 'divide-slate-800'
        }`}
      >
        {/* Source Text Area (Left) */}
        <div
          className={`p-5 flex flex-col justify-between min-h-[220px] ${
            isLight ? 'bg-slate-50/50' : 'bg-slate-950/40'
          }`}
        >
          <div className="relative flex-1">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text or word to translate & pronounce..."
              rows={4}
              className={`w-full bg-transparent border-0 text-lg sm:text-xl focus:outline-none resize-none leading-relaxed ${
                isLight
                  ? 'text-slate-900 placeholder:text-slate-400 font-medium'
                  : 'text-white placeholder-slate-600'
              }`}
            />
            {sourceText && (
              <button
                type="button"
                onClick={() => setSourceText('')}
                className={`absolute right-0 top-0 p-1 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white' : 'text-slate-500 hover:text-white'
                }`}
                title="Clear text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Source Action Bar */}
          <div
            className={`flex items-center justify-between pt-3 border-t text-xs ${
              isLight
                ? 'border-slate-200 text-slate-700'
                : 'border-slate-850 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleListenSource}
                disabled={!sourceText.trim() || isPlayingSource}
                className={`p-2 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed border ${
                  isLight
                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] disabled:hover:bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                    : 'disabled:opacity-30 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 border-transparent'
                }`}
                title={`Listen in ${currentSourceLang.name}`}
              >
                {isPlayingSource ? (
                  <Loader2 className={`w-5 h-5 animate-spin ${isLight ? 'text-white' : 'text-indigo-500'}`} />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <span className={`text-[11px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                Voice: {currentSourceLang.voices[0]?.name.split(' - ')[0] || 'Default'}
              </span>
            </div>

            <span className={`font-mono text-[11px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
              {sourceText.length} / 5000
            </span>
          </div>
        </div>

        {/* Target Translation Area (Right) */}
        <div
          className={`p-5 flex flex-col justify-between min-h-[220px] relative ${
            isLight ? 'bg-[#f8faff]' : 'bg-slate-900/60'
          }`}
        >
          <div className="relative flex-1">
            <div
              className={`text-lg sm:text-xl leading-relaxed transition-opacity duration-150 ${
                translatedText
                  ? isLight
                    ? 'text-slate-900 font-semibold'
                    : 'text-amber-200 font-medium'
                  : isLight
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
              dir={currentTargetLang.script === 'arabic' ? 'rtl' : 'ltr'}
            >
              {translatedText ? (
                translatedText
              ) : isTranslating ? (
                <div
                  className={`flex items-center gap-2 text-sm py-4 ${
                    isLight ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  <Loader2 className={`w-4 h-4 animate-spin ${isLight ? 'text-[#1a73e8]' : 'text-amber-500'}`} />
                  <span>Translating with AI...</span>
                </div>
              ) : (
                'Translation will appear here instantly...'
              )}
            </div>

            {/* Discreet top-right updating badge when updating an existing translation */}
            {isTranslating && translatedText && (
              <div
                className={`absolute top-0 right-0 flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md ${
                  isLight
                    ? 'bg-blue-50 text-[#1a73e8] border border-blue-200'
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                }`}
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Updating...</span>
              </div>
            )}
          </div>

          {/* Target Action Bar */}
          <div
            className={`flex items-center justify-between pt-3 border-t text-xs ${
              isLight
                ? 'border-slate-200 text-slate-700'
                : 'border-slate-850 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Listen Target Button */}
              <button
                type="button"
                onClick={handleListenTarget}
                disabled={!translatedText.trim() || isPlayingTarget}
                className={`p-2 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed border ${
                  isLight
                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] disabled:hover:bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                    : 'disabled:opacity-30 text-slate-400 hover:text-amber-400 hover:bg-slate-800 border-transparent'
                }`}
                title={`Listen in ${currentTargetLang.name}`}
              >
                {isPlayingTarget ? (
                  <Loader2 className={`w-5 h-5 animate-spin ${isLight ? 'text-white' : 'text-amber-500'}`} />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopyTarget}
                disabled={!translatedText.trim()}
                className={`p-2 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed border ${
                  isLight
                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] disabled:hover:bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                    : 'disabled:opacity-30 text-slate-400 hover:text-white hover:bg-slate-800 border-transparent'
                }`}
                title="Copy translation"
              >
                {copiedTarget ? (
                  <Check className={`w-4 h-4 stroke-[2.5] ${isLight ? 'text-white' : 'text-emerald-500'}`} />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Quick Add to Vocabulary List (Amber/Orange matching Import & Download buttons in Day & Night modes) */}
            <button
              type="button"
              onClick={handleAddToVocab}
              disabled={!sourceText.trim() || !translatedText.trim()}
              className="keep-amber-btn px-3.5 py-2 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/25 border border-amber-500/50 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:hover:from-amber-400 disabled:hover:to-amber-500 text-slate-950 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
              title="Add word to repeater playlist (Pronounce 2x + Translation 1x)"
            >
              {addedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3] text-slate-950" />
                  <span>Added to Playlist!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[3] text-slate-950" />
                  <span>Add to Vocabulary (2x Loop)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
