import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { VocabularyItem } from '../types.ts';
import { parseUniversalLine } from './BulkImportModal.tsx';

interface BulkTextareaWorkstationProps {
  items: VocabularyItem[];
  onSetItems: (items: VocabularyItem[]) => void;
  sourceLangName: string;
  targetLangName: string;
}

const DEMO_SAMPLE_WORDS = `plugging in\tconnecting
plugging\tblocking
by far\tby a large margin
vast\thuge
aesthetically\taesthetically pleasing
widens\tbroadens
conceived\timagined
conceived\tformulated
thrill\texcitement
perseverance\tcontinued effort
resilience\trecovery ability
opportunity\tfavorable circumstances
profound\tdeep and meaningful
versatile\tadaptable to many uses
captivating\textremely attractive`;

export const BulkTextareaWorkstation: React.FC<BulkTextareaWorkstationProps> = ({
  items,
  onSetItems,
  sourceLangName,
  targetLangName,
}) => {
  // Local raw text state for smooth typing and bulk pasting
  const [rawText, setRawText] = useState(() => {
    return items
      .map((it) => {
        const src = it.sourceText || it.english || '';
        const tgt = it.targetText || it.arabic || '';
        return tgt ? `${src}\t${tgt}` : src;
      })
      .join('\n');
  });

  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isTypingRef = useRef(false);

  // Sync rawText ONLY when items change externally (e.g. from Google Translate or Preset load)
  useEffect(() => {
    // If the user is actively typing in the textarea, NEVER overwrite rawText!
    if (isTypingRef.current) return;

    const serialized = items
      .map((it) => {
        const src = it.sourceText || it.english || '';
        const tgt = it.targetText || it.arabic || '';
        return tgt ? `${src}\t${tgt}` : src;
      })
      .join('\n');

    // Only update if rawText is empty or completely out of sync
    if (items.length > 0 && !rawText.trim()) {
      setRawText(serialized);
    }
  }, [items]);

  // Handle live textarea change with intelligent parsing
  const handleTextChange = (newText: string) => {
    isTypingRef.current = true;
    setRawText(newText);
    const lines = newText.split('\n');
    const newItems: VocabularyItem[] = [];

    lines.forEach((line) => {
      const parsed = parseUniversalLine(line);
      if (parsed && parsed.sourceText) {
        newItems.push({
          id: 'w-' + Math.random().toString(36).substring(2, 9),
          sourceText: parsed.sourceText,
          targetText: parsed.targetText || '',
          english: parsed.sourceText,
          arabic: parsed.targetText || '',
          mastered: false,
          createdAt: Date.now(),
        });
      }
    });

    onSetItems(newItems);
    setTimeout(() => {
      isTypingRef.current = false;
    }, 300);
  };

  // Handle universal file upload (.txt, .csv, .tsv, .json)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        // If JSON file format
        if (file.name.toLowerCase().endsWith('.json')) {
          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
              const textLines = parsed
                .map((item: any) => {
                  if (typeof item === 'string') return item;
                  const src =
                    item.source ||
                    item.sourceText ||
                    item.english ||
                    item.word ||
                    item.term ||
                    '';
                  const tgt =
                    item.target ||
                    item.targetText ||
                    item.arabic ||
                    item.translation ||
                    item.meaning ||
                    '';
                  return `${src}\t${tgt}`.trim();
                })
                .filter(Boolean)
                .join('\n');
              if (textLines) {
                handleTextChange(textLines);
                return;
              }
            }
          } catch (jsonErr) {
            console.warn('JSON parse error, falling back to raw text:', jsonErr);
          }
        }
        handleTextChange(content);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (e.target) e.target.value = '';
  };

  // Load demo sample
  const handleLoadSample = () => {
    handleTextChange(DEMO_SAMPLE_WORDS);
  };

  // Clear all
  const handleClearAll = () => {
    setRawText('');
    onSetItems([]);
  };

  // Copy all
  const handleCopyAll = () => {
    if (!rawText.trim()) return;
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalParts = Math.max(1, Math.ceil(items.length / 100));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md text-left space-y-4">
      {/* Top Header & Action Buttons (Screenshot 1) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/30"></span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Bulk Word &amp; Text Input (Up to 10,000 Words)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>
              Smart auto-detection: separates source &amp; translation with Tab, comma, double-space, dash, or space.
            </span>
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.csv,.tsv,.json,.text"
            className="hidden"
          />

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            title="Import TXT, CSV, TSV, or JSON file containing up to 10,000 words"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Import File (TXT / CSV / JSON)</span>
          </button>

          {/* Load Sample Button */}
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Fill with high-frequency sample vocabulary"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Demo Sample List</span>
          </button>

          {/* Copy All Button */}
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleCopyAll}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              title="Copy current list to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}

          {/* Clear Button */}
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              title="Clear entire vocabulary input"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Large Monospace Textarea (Screenshot 1) */}
      <div className="relative">
        <textarea
          value={rawText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={`Paste your words here (one word per line, up to 10,000 words):\nplugging in\tconnecting\nby far\tby a large margin\nvast\thuge\naesthetically\taesthetically pleasing\nwidens\tbroadens\nconceived\timagined\nthrill\texcitement`}
          rows={9}
          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400/80 rounded-2xl p-4 text-sm font-mono text-slate-100 placeholder-slate-600 outline-none transition-all leading-relaxed custom-scrollbar shadow-inner"
          spellCheck={false}
        />

        {/* Small floating hint inside textarea */}
        <div className="absolute right-3.5 bottom-3.5 pointer-events-none text-[11px] text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
          Format: <code className="text-amber-400 font-mono">word [tab/comma/space] translation</code>
        </div>
      </div>

      {/* Summary Status Bar (Screenshot 1) */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: Total Recognized Words */}
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">
            Total Recognized Words:{' '}
            <strong className="text-white font-mono text-sm ml-1">
              {items.length} words
            </strong>
          </span>
        </div>

        {/* Right: Auto-partitioned MP3 parts info */}
        <div className="text-slate-400 text-right text-[11px] font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>
            Auto-partitioned for fast MP3 download into{' '}
            <strong className="text-amber-300 font-mono">({totalParts})</strong>{' '}
            parts (100 words per file)
          </span>
        </div>
      </div>
    </div>
  );
};
