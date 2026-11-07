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
    if (!text.trim()) {
      setTranslatedText('');
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    const clean = text.trim();
    const sl = isAutoDetect ? 'auto' : srcCode.split('-')[0];
    const tl = tgtCode.split('-')[0];

    // 1. Try Direct Google Translate (Native browser query - matches Google Translate 100%)
    try {
      const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
        sl
      )}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(clean)}`;
      const res = await fetch(gUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data[0])) {
          const directTranslation = data[0].map((item: any) => item[0]).join('');
          if (directTranslation) {
            setTranslatedText(directTranslation);
            if (data[2] && isAutoDetect) {
              const matchedLang = getLanguageByCode(data[2]);
              setDetectedLangCode(matchedLang.code);
              onUpdateSettings({
                sourceLang: matchedLang.code,
                sourceVoice: matchedLang.defaultVoice,
              });
            }
            setIsTranslating(false);
            return;
          }
        }
      }
    } catch (directErr) {
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
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translatedText) {
          setTranslatedText(data.translatedText);
        }
        if (data.detectedLang && isAutoDetect) {
          const matchedLang = getLanguageByCode(data.detectedLang);
          setDetectedLangCode(matchedLang.code);
          onUpdateSettings({
            sourceLang: matchedLang.code,
            sourceVoice: matchedLang.defaultVoice,
          });
        }
      }
    } catch (err) {
      console.warn('Translation proxy failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Debounced translation on source text change
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    // Quick local script detection
    if (isAutoDetect) {
      const detected = detectLanguageFromText(sourceText);
      setDetectedLangCode(detected.code);
      onUpdateSettings({
        sourceLang: detected.code,
        sourceVoice: detected.defaultVoice,
      });
    }

    debounceTimerRef.current = setTimeout(() => {
      translateText(sourceText, settings.sourceLang || 'en-US', settings.targetLang || 'es-ES');
    }, 350);

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
      {/* Top Language Bar (Clean Google Translate Layout) */}
      <div
        className={`px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-950/70 border-slate-800'
        }`}
      >
        {/* Source Language Controls */}
        <div className="flex items-center flex-wrap gap-1.5 flex-1 min-w-[280px]">
          {/* Detect Language Button */}
          <button
            type="button"
            onClick={() => setIsAutoDetect(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isAutoDetect
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                : isLight
                ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200 border border-transparent'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Detect language {isAutoDetect && sourceText ? `(${currentSourceLang.name})` : ''}
            </span>
          </button>

          {/* Active Source Language Button (Click opens full picker) */}
          <button
            type="button"
            onClick={() => setActivePicker('source')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              !isAutoDetect
                ? isLight
                  ? 'bg-indigo-50 text-indigo-950 border border-indigo-300 shadow-xs'
                  : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/50 shadow-sm'
                : isLight
                ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-200 border border-slate-300'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
            }`}
            title="Click to choose from all world languages"
          >
            <span>{currentSourceLang.flag}</span>
            <span>{currentSourceLang.name}</span>
            <ChevronDown className={`w-4 h-4 ml-0.5 ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`} />
          </button>

          {/* Quick Popular Source Language Pills */}
          <div className="hidden lg:flex items-center gap-1">
            {POPULAR_LANGUAGES.slice(0, 3).map((lang) => {
              const isSelected = !isAutoDetect && settings.sourceLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setIsAutoDetect(false);
                    const fullLang = getLanguageByCode(lang.code);
                    onUpdateSettings({
                      sourceLang: fullLang.code,
                      sourceVoice: fullLang.defaultVoice,
                    });
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-indigo-100 text-indigo-950 border border-indigo-300 font-bold'
                        : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                      : isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {lang.name}
                </button>
              );
            })}
          </div>

          {/* Full List Button */}
          <button
            type="button"
            onClick={() => setActivePicker('source')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              isLight
                ? 'text-slate-700 hover:text-indigo-700 hover:bg-slate-200'
                : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800/60'
            }`}
            title="Browse all world languages"
          >
            <span>All Languages</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center Swap Button */}
        <button
          type="button"
          onClick={handleSwap}
          className={`p-2.5 rounded-2xl border transition-all hover:scale-105 active:scale-95 shadow-sm shrink-0 cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-white'
          }`}
          title="Swap source and target languages"
        >
          <ArrowLeftRight className="w-4 h-4 text-amber-500" />
        </button>

        {/* Target Language Controls */}
        <div className="flex items-center flex-wrap gap-1.5 flex-1 justify-start sm:justify-end min-w-[280px]">
          {/* Active Target Language Button (Click opens full picker) */}
          <button
            type="button"
            onClick={() => setActivePicker('target')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
              isLight
                ? 'bg-amber-100 text-amber-950 border border-amber-300 hover:border-amber-400'
                : 'bg-amber-950/70 text-amber-300 border border-amber-500/50 hover:border-amber-400'
            }`}
            title="Click to choose target language from all world languages"
          >
            <span>{currentTargetLang.flag}</span>
            <span>{currentTargetLang.name}</span>
            <ChevronDown className={`w-4 h-4 ml-0.5 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
          </button>

          {/* Quick Popular Target Language Pills */}
          <div className="hidden lg:flex items-center gap-1">
            {POPULAR_LANGUAGES.slice(0, 3).map((lang) => {
              const isSelected = settings.targetLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    const fullLang = getLanguageByCode(lang.code);
                    onUpdateSettings({
                      targetLang: fullLang.code,
                      targetVoice: fullLang.defaultVoice,
                    });
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                        : 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold'
                      : isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {lang.name}
                </button>
              );
            })}
          </div>

          {/* Full List Button */}
          <button
            type="button"
            onClick={() => setActivePicker('target')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              isLight
                ? 'text-slate-700 hover:text-amber-700 hover:bg-slate-200'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
            title="Browse all world languages"
          >
            <span>All Languages</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Full Google Translate-Style Language Selection Overlay Modal (140+ World Languages) */}
      {activePicker && (
        <div
          className={`absolute inset-0 z-50 p-6 flex flex-col animate-fade-in text-left ${
            isLight
              ? 'bg-white/98 backdrop-blur-md text-slate-900 border border-slate-200 shadow-2xl'
              : 'bg-slate-950/98 backdrop-blur-md text-white border border-slate-800'
          }`}
        >
          {/* Picker Top Header */}
          <div
            className={`flex items-center justify-between pb-4 border-b ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Select {activePicker === 'source' ? 'Source' : 'Target'} Language (
                  {SUPPORTED_LANGUAGES.length} Languages)
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  Comprehensive world languages like Google Translate with neural studio voices
                </p>
              </div>
            </div>

            <button
              onClick={() => setActivePicker(null)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isLight
                  ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Close picker (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="pt-4 pb-3">
            <div className="relative">
              <Search
                className={`w-4 h-4 absolute left-3.5 top-3.5 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search all 140+ world languages by English name, native script, or code (e.g. Spanish, العربية, zh, af)..."
                className={`w-full rounded-2xl pl-10 pr-10 py-3 text-sm outline-none transition-all shadow-inner ${
                  isLight
                    ? 'bg-slate-50 border border-slate-300 focus:border-indigo-600 text-slate-900 placeholder:text-slate-500'
                    : 'bg-slate-900 border border-slate-700/80 focus:border-amber-400 text-white placeholder-slate-500'
                }`}
              />
              {pickerSearch && (
                <button
                  onClick={() => setPickerSearch('')}
                  className={`absolute right-3.5 top-3.5 ${
                    isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Popular Pills */}
          {!pickerSearch && (
            <div className="pb-3 flex items-center gap-2 overflow-x-auto">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider shrink-0 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Popular:
              </span>
              {POPULAR_LANGUAGES.map((pl) => (
                <button
                  key={pl.code}
                  onClick={() => handleSelectLanguage(pl.code)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer border ${
                    isLight
                      ? 'bg-slate-100 hover:bg-indigo-50 border-slate-200 text-slate-800'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{pl.flag}</span>
                  <span>{pl.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Multi-Column Alphabetical Languages Grid (No Horizontal Scrollbar!) */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredPickerLanguages.map((lang) => {
                const isSelected =
                  activePicker === 'source'
                    ? !isAutoDetect && settings.sourceLang === lang.code
                    : settings.targetLang === lang.code;

                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? isLight
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-xs'
                          : 'bg-amber-400/15 border-amber-400/60 shadow-md text-amber-200'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-800'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-bold truncate transition-colors ${
                            isLight
                              ? 'text-slate-900 group-hover:text-indigo-700'
                              : 'text-white group-hover:text-amber-300'
                          }`}
                        >
                          {lang.name}
                        </div>
                        <div
                          className={`text-[11px] truncate mt-0.5 ${
                            isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
                          }`}
                        >
                          {lang.nativeName}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check
                        className={`w-4 h-4 shrink-0 ml-2 ${
                          isLight ? 'text-amber-700' : 'text-amber-400'
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
                className={`absolute right-0 top-0 p-1 transition-colors cursor-pointer ${
                  isLight ? 'text-slate-400 hover:text-slate-800' : 'text-slate-500 hover:text-white'
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
                className={`p-2 rounded-xl disabled:opacity-30 transition-all cursor-pointer ${
                  isLight
                    ? 'text-slate-700 hover:text-indigo-700 hover:bg-slate-200/80'
                    : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                }`}
                title={`Listen in ${currentSourceLang.name}`}
              >
                {isPlayingSource ? (
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
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
            isLight ? 'bg-amber-50/20' : 'bg-slate-900/60'
          }`}
        >
          <div className="relative flex-1">
            {isTranslating ? (
              <div
                className={`flex items-center gap-2 text-sm py-4 ${
                  isLight ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                <span>Translating with AI...</span>
              </div>
            ) : (
              <div
                className={`text-lg sm:text-xl leading-relaxed ${
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
                {translatedText || 'Translation will appear here instantly...'}
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
                className={`p-2 rounded-xl disabled:opacity-30 transition-all cursor-pointer ${
                  isLight
                    ? 'text-slate-700 hover:text-amber-700 hover:bg-slate-200/80'
                    : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                }`}
                title={`Listen in ${currentTargetLang.name}`}
              >
                {isPlayingTarget ? (
                  <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopyTarget}
                disabled={!translatedText.trim()}
                className={`p-2 rounded-xl disabled:opacity-30 transition-all cursor-pointer ${
                  isLight
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/80'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Copy translation"
              >
                {copiedTarget ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Quick Add to Vocabulary List */}
            <button
              type="button"
              onClick={handleAddToVocab}
              disabled={!sourceText.trim() || !translatedText.trim()}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-30 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
              title="Add word to repeater playlist (Pronounce 2x + Translation 1x)"
            >
              {addedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  <span>Added to Playlist!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
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
