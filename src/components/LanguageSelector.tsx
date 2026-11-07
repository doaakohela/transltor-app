import React, { useState } from 'react';
import {
  Globe,
  ArrowLeftRight,
  Volume2,
  ChevronDown,
  Check,
  Search,
  Repeat,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../data/languages.ts';
import { AudioSettings } from '../types.ts';
import { speechService } from '../services/speechService.ts';

interface LanguageSelectorProps {
  settings: AudioSettings;
  onUpdateSettings: (newSettings: Partial<AudioSettings>) => void;
  theme?: 'dark' | 'light';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  settings,
  onUpdateSettings,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [searchSource, setSearchSource] = useState('');
  const [searchTarget, setSearchTarget] = useState('');
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);

  const currentSourceLang = getLanguageByCode(settings.sourceLang || 'en-US');
  const currentTargetLang = getLanguageByCode(settings.targetLang || 'es-ES');

  // Filter languages across all 140+ world languages
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

  const is2x1x = (settings.sourceRepeats ?? 2) === 2 && (settings.targetRepeats ?? 1) === 1;

  const handleToggleRepetitionPattern = () => {
    if (is2x1x) {
      onUpdateSettings({ sourceRepeats: 1, targetRepeats: 2 });
    } else {
      onUpdateSettings({ sourceRepeats: 2, targetRepeats: 1 });
    }
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
    <div
      className={`border rounded-2xl p-4 sm:p-5 shadow-lg text-left transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200'
          : 'bg-slate-900/90 border-slate-800'
      }`}
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Source Language Picker */}
        <div className="flex-1 relative">
          <label
            className={`text-xs font-semibold mb-1.5 flex items-center justify-between ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Globe className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
              <span>Source Language to Memorize (Repeats: {settings.sourceRepeats || 2}x)</span>
            </span>
            <span
              className={`text-[11px] font-semibold ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}
            >
              {currentSourceLang.voices.length} Natural Studio Voices
            </span>
          </label>

          <button
            type="button"
            onClick={() => {
              setIsSourceOpen(!isSourceOpen);
              setIsTargetOpen(false);
            }}
            className={`w-full rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer border ${
              isLight
                ? 'bg-slate-50 border-slate-300 hover:border-indigo-500 text-slate-900 shadow-xs'
                : 'bg-slate-950 border-slate-700/80 hover:border-indigo-500 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentSourceLang.flag}</span>
              <div className="text-left">
                <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {currentSourceLang.name}
                </div>
                <div
                  className={`text-[11px] ${
                    isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
                  }`}
                >
                  {currentSourceLang.nativeName}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
            />
          </button>

          {/* Dropdown */}
          {isSourceOpen && (
            <div
              className={`absolute top-full left-0 mt-2 w-full rounded-2xl shadow-2xl p-3 z-50 animate-fade-in max-h-80 overflow-hidden flex flex-col border ${
                isLight
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-900 border-slate-700'
              }`}
            >
              <div className="relative mb-2">
                <Search
                  className={`w-3.5 h-3.5 absolute left-3 top-3 ${
                    isLight ? 'text-slate-500' : 'text-slate-500'
                  }`}
                />
                <input
                  type="text"
                  value={searchSource}
                  onChange={(e) => setSearchSource(e.target.value)}
                  placeholder="Search all 140+ world languages..."
                  className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none ${
                    isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-500'
                      : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
                  }`}
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto space-y-1 flex-1 custom-scrollbar">
                {filteredSourceLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectSource(lang.code)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer border ${
                      lang.code === currentSourceLang.code
                        ? isLight
                          ? 'bg-indigo-100 text-indigo-950 border-indigo-300 font-bold'
                          : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30 font-semibold'
                        : isLight
                        ? 'hover:bg-slate-100 text-slate-800 border-transparent'
                        : 'hover:bg-slate-800/80 text-slate-300 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <div className="text-xs font-semibold">{lang.name}</div>
                        <div
                          className={`text-[10px] ${
                            isLight ? 'text-slate-600' : 'text-slate-400'
                          }`}
                        >
                          {lang.nativeName}
                        </div>
                      </div>
                    </div>
                    {lang.code === currentSourceLang.code && (
                      <Check
                        className={`w-4 h-4 ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Swap & Repetition Mode Toggle Buttons */}
        <div className="flex md:flex-col items-center justify-center gap-2 shrink-0 self-center">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap source and target languages"
            className={`p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-500" />
          </button>

          <button
            type="button"
            onClick={handleToggleRepetitionPattern}
            title={
              is2x1x
                ? 'Current: 2x Word + 1x Translation. Click to switch to: 1x Word + 2x Translation'
                : 'Current: 1x Word + 2x Translation. Click to switch to: 2x Word + 1x Translation'
            }
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
              is2x1x
                ? isLight
                  ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-950 border-indigo-300'
                  : 'bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border-indigo-700/80'
                : isLight
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                : 'bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border-amber-600/80'
            }`}
          >
            <Repeat
              className={`w-4 h-4 ${
                is2x1x
                  ? isLight
                    ? 'text-indigo-700'
                    : 'text-indigo-400'
                  : isLight
                  ? 'text-amber-700 animate-pulse'
                  : 'text-amber-400 animate-pulse'
              }`}
            />
          </button>
        </div>

        {/* Target Language Picker */}
        <div className="flex-1 relative">
          <label
            className={`text-xs font-semibold mb-1.5 flex items-center justify-between ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Globe className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
              <span>Target Language Translation (Repeats: {settings.targetRepeats || 1}x)</span>
            </span>
            <span
              className={`text-[11px] font-semibold ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}
            >
              {currentTargetLang.voices.length} Natural Studio Voices
            </span>
          </label>

          <button
            type="button"
            onClick={() => {
              setIsTargetOpen(!isTargetOpen);
              setIsSourceOpen(false);
            }}
            className={`w-full rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer border ${
              isLight
                ? 'bg-slate-50 border-slate-300 hover:border-amber-500 text-slate-900 shadow-xs'
                : 'bg-slate-950 border-slate-700/80 hover:border-amber-500 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentTargetLang.flag}</span>
              <div className="text-left">
                <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {currentTargetLang.name}
                </div>
                <div
                  className={`text-[11px] ${
                    isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
                  }`}
                >
                  {currentTargetLang.nativeName}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
            />
          </button>

          {/* Dropdown */}
          {isTargetOpen && (
            <div
              className={`absolute top-full right-0 mt-2 w-full rounded-2xl shadow-2xl p-3 z-50 animate-fade-in max-h-80 overflow-hidden flex flex-col border ${
                isLight
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-900 border-slate-700'
              }`}
            >
              <div className="relative mb-2">
                <Search
                  className={`w-3.5 h-3.5 absolute left-3 top-3 ${
                    isLight ? 'text-slate-500' : 'text-slate-500'
                  }`}
                />
                <input
                  type="text"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  placeholder="Search target languages..."
                  className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none ${
                    isLight
                      ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-500'
                      : 'bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-amber-500'
                  }`}
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto space-y-1 flex-1 custom-scrollbar">
                {filteredTargetLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectTarget(lang.code)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer border ${
                      lang.code === currentTargetLang.code
                        ? isLight
                          ? 'bg-amber-100 text-amber-950 border-amber-300 font-bold'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                        : isLight
                        ? 'hover:bg-slate-100 text-slate-800 border-transparent'
                        : 'hover:bg-slate-800/80 text-slate-300 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <div className="text-xs font-semibold">{lang.name}</div>
                        <div
                          className={`text-[10px] ${
                            isLight ? 'text-slate-600' : 'text-slate-400'
                          }`}
                        >
                          {lang.nativeName}
                        </div>
                      </div>
                    </div>
                    {lang.code === currentTargetLang.code && (
                      <Check
                        className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-amber-400'}`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Voice Bar */}
      <div
        className={`mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
          isLight ? 'border-slate-200' : 'border-slate-800/80'
        }`}
      >
        {/* Source Voice Info */}
        <div className="flex items-center gap-2">
          <span className={isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}>
            {currentSourceLang.name} Voice:
          </span>
          <select
            value={settings.sourceVoice || currentSourceLang.defaultVoice}
            onChange={(e) =>
              onUpdateSettings({
                sourceVoice: e.target.value,
                enGeminiVoice: e.target.value,
              })
            }
            className={`rounded-lg px-2.5 py-1 text-xs font-medium outline-none border ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-indigo-950'
                : 'bg-slate-950 border-slate-700 text-indigo-300'
            }`}
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
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight
                ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900'
                : 'bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300'
            }`}
            title="Listen to sample audio"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Target Voice Info */}
        <div className="flex items-center gap-2">
          <span className={isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}>
            {currentTargetLang.name} Voice:
          </span>
          <select
            value={settings.targetVoice || currentTargetLang.defaultVoice}
            onChange={(e) =>
              onUpdateSettings({
                targetVoice: e.target.value,
                arGeminiVoice: e.target.value,
              })
            }
            className={`rounded-lg px-2.5 py-1 text-xs font-medium outline-none border ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-amber-950'
                : 'bg-slate-950 border-slate-700 text-amber-300'
            }`}
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
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                : 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-300'
            }`}
            title="Listen to sample audio"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* One-Click Audio Repetition Mode Toggle & Fine Tuning */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleRepetitionPattern}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:scale-[1.02] active:scale-95 ${
              is2x1x
                ? isLight
                  ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-950 border-indigo-300'
                  : 'bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border-indigo-700/80'
                : isLight
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                : 'bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border-amber-600/80'
            }`}
            title="Click to toggle: (2x Source + 1x Target) ⇄ (1x Source + 2x Target)"
          >
            <Repeat
              className={`w-3.5 h-3.5 ${
                is2x1x
                  ? isLight
                    ? 'text-indigo-700'
                    : 'text-indigo-400'
                  : isLight
                  ? 'text-amber-700'
                  : 'text-amber-400'
              }`}
            />
            <span>
              {is2x1x ? 'Loop: 2x Word + 1x Trans' : 'Loop: 1x Word + 2x Trans'}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                isLight ? 'bg-white text-slate-700 border border-slate-200' : 'bg-slate-900/80 text-slate-400'
              }`}
            >
              Switch ⇄
            </span>
          </button>

          <div
            className={`hidden sm:flex items-center gap-1.5 text-[11px] ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            <select
              value={settings.sourceRepeats ?? 2}
              onChange={(e) => onUpdateSettings({ sourceRepeats: Number(e.target.value) })}
              className={`rounded-md px-1.5 py-0.5 text-xs border ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900'
                  : 'bg-slate-950 border-slate-700 text-white'
              }`}
              title="Custom source repetitions"
            >
              <option value={1}>1x Source</option>
              <option value={2}>2x Source</option>
              <option value={3}>3x Source</option>
            </select>
            <span>+</span>
            <select
              value={settings.targetRepeats ?? 1}
              onChange={(e) => onUpdateSettings({ targetRepeats: Number(e.target.value) })}
              className={`rounded-md px-1.5 py-0.5 text-xs border ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900'
                  : 'bg-slate-950 border-slate-700 text-white'
              }`}
              title="Custom target repetitions"
            >
              <option value={0}>0x Target (Silent)</option>
              <option value={1}>1x Target</option>
              <option value={2}>2x Target</option>
              <option value={3}>3x Target</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
