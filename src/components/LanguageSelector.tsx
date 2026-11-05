import React, { useState } from 'react';
import {
  Globe,
  ArrowLeftRight,
  Volume2,
  ChevronDown,
  Sparkles,
  Check,
  Search,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../data/languages.ts';
import { AudioSettings } from '../types.ts';
import { speechService } from '../services/speechService.ts';

interface LanguageSelectorProps {
  settings: AudioSettings;
  onUpdateSettings: (newSettings: Partial<AudioSettings>) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [searchSource, setSearchSource] = useState('');
  const [searchTarget, setSearchTarget] = useState('');
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);

  const currentSourceLang = getLanguageByCode(settings.sourceLang || 'en-US');
  const currentTargetLang = getLanguageByCode(settings.targetLang || 'es-ES');

  // Filter languages
  const filteredSourceLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchSource.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchSource.toLowerCase()) ||
      l.code.toLowerCase().includes(searchSource.toLowerCase())
  );

  const filteredTargetLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTarget.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchTarget.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTarget.toLowerCase())
  );

  const handleSelectSource = (code: string) => {
    const lang = getLanguageByCode(code);
    onUpdateSettings({
      sourceLang: lang.code,
      sourceVoice: lang.defaultVoice,
      enGeminiVoice: lang.defaultVoice,
    });
    setIsSourceOpen(false);
    setSearchSource('');
  };

  const handleSelectTarget = (code: string) => {
    const lang = getLanguageByCode(code);
    onUpdateSettings({
      targetLang: lang.code,
      targetVoice: lang.defaultVoice,
      arGeminiVoice: lang.defaultVoice,
    });
    setIsTargetOpen(false);
    setSearchTarget('');
  };

  const handleSwap = () => {
    onUpdateSettings({
      sourceLang: currentTargetLang.code,
      sourceVoice: currentTargetLang.defaultVoice,
      targetLang: currentSourceLang.code,
      targetVoice: currentSourceLang.defaultVoice,
    });
  };

  const handlePreviewVoice = async (voiceId: string, samplePhrase: string, langCode: string) => {
    if (previewingVoice) return;
    setPreviewingVoice(voiceId);
    try {
      await speechService.speakText(samplePhrase, langCode, voiceId);
    } finally {
      setPreviewingVoice(null);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl text-left">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Source Language Picker */}
        <div className="flex-1 relative">
          <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Source Language to Memorize (Repeats: {settings.sourceRepeats || 2}x)</span>
            </span>
            <span className="text-[11px] text-amber-400 font-normal">
              {currentSourceLang.voices.length} Natural Studio Voices
            </span>
          </label>

          <button
            type="button"
            onClick={() => {
              setIsSourceOpen(!isSourceOpen);
              setIsTargetOpen(false);
            }}
            className="w-full bg-slate-950 border border-slate-700/80 hover:border-indigo-500 rounded-xl p-3 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentSourceLang.flag}</span>
              <div className="text-left">
                <div className="text-sm font-bold text-white">{currentSourceLang.name}</div>
                <div className="text-[11px] text-slate-400">{currentSourceLang.nativeName}</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown */}
          {isSourceOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in max-h-80 overflow-hidden flex flex-col">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchSource}
                  onChange={(e) => setSearchSource(e.target.value)}
                  placeholder="Search all world languages..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto space-y-1 flex-1">
                {filteredSourceLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectSource(lang.code)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                      lang.code === currentSourceLang.code
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <div className="text-xs font-semibold">{lang.name}</div>
                        <div className="text-[10px] text-slate-400">{lang.nativeName}</div>
                      </div>
                    </div>
                    {lang.code === currentSourceLang.code && (
                      <Check className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center shrink-0">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap languages"
            className="p-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Target Language Picker */}
        <div className="flex-1 relative">
          <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Language Translation (Repeats: {settings.targetRepeats || 1}x)</span>
            </span>
            <span className="text-[11px] text-amber-400 font-normal">
              {currentTargetLang.voices.length} Natural Studio Voices
            </span>
          </label>

          <button
            type="button"
            onClick={() => {
              setIsTargetOpen(!isTargetOpen);
              setIsSourceOpen(false);
            }}
            className="w-full bg-slate-950 border border-slate-700/80 hover:border-amber-500 rounded-xl p-3 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentTargetLang.flag}</span>
              <div className="text-left">
                <div className="text-sm font-bold text-white">{currentTargetLang.name}</div>
                <div className="text-[11px] text-slate-400">{currentTargetLang.nativeName}</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown */}
          {isTargetOpen && (
            <div className="absolute top-full right-0 mt-2 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in max-h-80 overflow-hidden flex flex-col">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  placeholder="Search target languages..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto space-y-1 flex-1">
                {filteredTargetLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectTarget(lang.code)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                      lang.code === currentTargetLang.code
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <div className="text-xs font-semibold">{lang.name}</div>
                        <div className="text-[10px] text-slate-400">{lang.nativeName}</div>
                      </div>
                    </div>
                    {lang.code === currentTargetLang.code && (
                      <Check className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Voice Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Source Voice Info */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">{currentSourceLang.name} Voice:</span>
          <select
            value={settings.sourceVoice || currentSourceLang.defaultVoice}
            onChange={(e) =>
              onUpdateSettings({
                sourceVoice: e.target.value,
                enGeminiVoice: e.target.value,
              })
            }
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-indigo-300 font-medium outline-none"
          >
            {currentSourceLang.voices.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              const currentVoice =
                currentSourceLang.voices.find(
                  (v) => v.id === (settings.sourceVoice || currentSourceLang.defaultVoice)
                ) || currentSourceLang.voices[0];
              handlePreviewVoice(
                currentVoice.id,
                currentVoice.samplePhrase,
                currentSourceLang.code
              );
            }}
            disabled={previewingVoice !== null}
            className="p-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-lg transition-colors cursor-pointer"
            title="Listen to sample audio"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Target Voice Info */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">{currentTargetLang.name} Voice:</span>
          <select
            value={settings.targetVoice || currentTargetLang.defaultVoice}
            onChange={(e) =>
              onUpdateSettings({
                targetVoice: e.target.value,
                arGeminiVoice: e.target.value,
              })
            }
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-medium outline-none"
          >
            {currentTargetLang.voices.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              const currentVoice =
                currentTargetLang.voices.find(
                  (v) => v.id === (settings.targetVoice || currentTargetLang.defaultVoice)
                ) || currentTargetLang.voices[0];
              handlePreviewVoice(
                currentVoice.id,
                currentVoice.samplePhrase,
                currentTargetLang.code
              );
            }}
            disabled={previewingVoice !== null}
            className="p-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded-lg transition-colors cursor-pointer"
            title="Listen to sample audio"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Repetition settings */}
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>Source Repeats:</span>
            <select
              value={settings.sourceRepeats || 2}
              onChange={(e) => onUpdateSettings({ sourceRepeats: Number(e.target.value) })}
              className="bg-slate-950 border border-slate-700 rounded-md px-1.5 py-0.5 text-xs text-white"
            >
              <option value={1}>1x</option>
              <option value={2}>2x (Recommended)</option>
              <option value={3}>3x</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Target Repeats:</span>
            <select
              value={settings.targetRepeats || 1}
              onChange={(e) => onUpdateSettings({ targetRepeats: Number(e.target.value) })}
              className="bg-slate-950 border border-slate-700 rounded-md px-1.5 py-0.5 text-xs text-white"
            >
              <option value={0}>0x (Silent)</option>
              <option value={1}>1x (Recommended)</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
