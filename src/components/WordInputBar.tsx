import React, { useState } from 'react';
import { Plus, UploadCloud, Sparkles, Check, HelpCircle } from 'lucide-react';
import { PRESET_PACKS } from '../data/presets.ts';
import { parseUniversalLine } from './BulkImportModal.tsx';

interface WordInputBarProps {
  onAddWord: (sourceText: string, targetText: string) => boolean;
  onOpenBulkImport: () => void;
  onLoadPack: (packName: string) => void;
  sourceLangName?: string;
  targetLangName?: string;
}

export const WordInputBar: React.FC<WordInputBarProps> = ({
  onAddWord,
  onOpenBulkImport,
  onLoadPack,
  sourceLangName = 'English',
  targetLangName = 'Translation',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const parsed = parseUniversalLine(inputValue);
    if (!parsed || !parsed.sourceText) {
      setFeedback('Please enter word and translation (accepts tab, comma, or space)');
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    const success = onAddWord(parsed.sourceText, parsed.targetText || '');
    if (success) {
      setInputValue('');
      setFeedback(`Added "${parsed.sourceText}" successfully!`);
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <h2 className="text-sm font-semibold text-slate-200">
            Quick Word Entry ({sourceLangName} ➔ {targetLangName})
          </h2>
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            type="button"
            onClick={() => setShowPresetsMenu(!showPresetsMenu)}
            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Preset Packs</span>
          </button>

          <button
            type="button"
            onClick={onOpenBulkImport}
            className="px-2.5 py-1 text-xs text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/40 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Import up to 10,000 words</span>
          </button>

          {/* Presets dropdown */}
          {showPresetsMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-30">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                Choose a Starter Pack
              </div>
              {PRESET_PACKS.map((pack) => (
                <button
                  key={pack.name}
                  onClick={() => {
                    onLoadPack(pack.name);
                    setShowPresetsMenu(false);
                    setFeedback(`Loaded pack: "${pack.name}"!`);
                    setTimeout(() => setFeedback(null), 2500);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 transition-colors flex items-center justify-between"
                >
                  <span>{pack.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {pack.items.length} words
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type word and translation, e.g. depression sadness or hello hola"
            className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 transition-all outline-none"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-md shadow-amber-400/10 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Word</span>
        </button>
      </form>

      {/* Helper text or feedback */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Smart auto-detection: accepts words separated by tab, comma, dash, or space.</span>
        </span>

        {feedback && (
          <span className="text-amber-300 font-medium animate-fade-in flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            {feedback}
          </span>
        )}
      </div>
    </div>
  );
};
