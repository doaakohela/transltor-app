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
  sourceLangCode?: string;
  targetLangCode?: string;
  sourceVoice?: string;
  targetVoice?: string;
  theme?: 'dark' | 'light';
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
  sourceLangCode = 'en-US',
  targetLangCode = 'es-ES',
  sourceVoice,
  targetVoice,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
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

  // Sync rawText cleanly when items change externally (e.g. from Google Translate add/delete/preset)
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

    const currentParsedSerialized = rawText
      .split('\n')
      .map((line) => parseUniversalLine(line))
      .filter((p): p is { sourceText: string; targetText: string } => Boolean(p && p.sourceText))
      .map((p) => (p.targetText ? `${p.sourceText}\t${p.targetText}` : p.sourceText))
      .join('\n');

    if (serialized !== currentParsedSerialized) {
      setRawText(serialized);
    }
  }, [items]);

  // Handle live textarea change with intelligent parsing while preserving existing items' original language & voice
  const handleTextChange = (newText: string) => {
    isTypingRef.current = true;
    setRawText(newText);
    const lines = newText.split('\n');

    const existingBuckets = new Map<string, VocabularyItem[]>();
    items.forEach((it) => {
      const s = (it.sourceText || it.english || '').trim();
      const t = (it.targetText || it.arabic || '').trim();
      const key = `${s}||${t}`;
      const bucket = existingBuckets.get(key) || [];
      bucket.push(it);
      existingBuckets.set(key, bucket);
    });

    const newItems: VocabularyItem[] = [];

    lines.forEach((line) => {
      const parsed = parseUniversalLine(line);
      if (parsed && parsed.sourceText) {
        const key = `${parsed.sourceText.trim()}||${(parsed.targetText || '').trim()}`;
        const bucket = existingBuckets.get(key);
        const existingMatch = bucket && bucket.length > 0 ? bucket.shift() : undefined;

        if (existingMatch) {
          newItems.push(existingMatch);
        } else {
          newItems.push({
            id: 'w-' + Math.random().toString(36).substring(2, 9),
            sourceText: parsed.sourceText,
            targetText: parsed.targetText || '',
            english: parsed.sourceText,
            arabic: parsed.targetText || '',
            mastered: false,
            sourceLang: sourceLangCode,
            targetLang: targetLangCode,
            sourceVoice,
            targetVoice,
            createdAt: Date.now(),
          });
        }
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
    <div
      className={`border rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md text-left space-y-4 ${
        isLight
          ? 'bg-white border-slate-200'
          : 'bg-slate-900/90 border-slate-800'
      }`}
    >
      {/* Top Header & Action Buttons */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full shadow-md ${
                isLight ? 'bg-[#1a73e8] shadow-blue-500/30' : 'bg-amber-400 shadow-amber-400/30'
              }`}
            ></span>
            <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Bulk Word &amp; Text Input (Up to 10,000 Words)
            </h3>
          </div>
          <p className={`text-xs mt-1 flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <HelpCircle className={`w-3.5 h-3.5 ${isLight ? 'text-[#1a73e8]' : 'text-slate-500'}`} />
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

          {/* Upload Button (Kept Amber as Import Action) */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="keep-amber-btn px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            title="Import TXT, CSV, TSV, or JSON file containing up to 10,000 words"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Import File (TXT / CSV / JSON)</span>
          </button>

          {/* Load Sample Button */}
          <button
            type="button"
            onClick={handleLoadSample}
            className={`px-3 py-2 border rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Fill with high-frequency sample vocabulary"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-amber-400'}`} />
            <span>Demo Sample List</span>
          </button>

          {/* Copy All Button */}
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleCopyAll}
              className={`px-3 py-2 border rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isLight
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Copy current list to clipboard"
            >
              {copied ? (
                <>
                  <Check className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-emerald-500'}`} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className={`w-3.5 h-3.5 ${isLight ? 'text-white' : ''}`} />
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
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                isLight
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                  : 'text-slate-400 hover:text-red-400 hover:bg-slate-800 border-transparent'
              }`}
              title="Clear entire vocabulary input"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Large Monospace Textarea */}
      <div className="relative">
        <textarea
          value={rawText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={`Paste your words here (one word per line, up to 10,000 words):\nplugging in\tconnecting\nby far\tby a large margin\nvast\thuge\naesthetically\taesthetically pleasing\nwidens\tbroadens\nconceived\timagined\nthrill\texcitement`}
          rows={9}
          className={`w-full border rounded-2xl p-4 text-sm font-mono outline-none transition-all leading-relaxed custom-scrollbar shadow-inner ${
            isLight
              ? 'bg-slate-50 border-slate-300 focus:border-[#1a73e8] text-slate-900 placeholder:text-slate-400'
              : 'bg-slate-950 border-slate-800 focus:border-amber-400/80 text-slate-100 placeholder-slate-600'
          }`}
          spellCheck={false}
        />

        {/* Small floating hint inside textarea */}
        <div
          className={`absolute right-3.5 bottom-3.5 pointer-events-none text-[11px] px-2 py-0.5 rounded-md border ${
            isLight
              ? 'text-slate-600 bg-white/95 border-slate-200'
              : 'text-slate-500 bg-slate-900/80 border-slate-800'
          }`}
        >
          Format:{' '}
          <code className={`font-mono ${isLight ? 'text-[#1967d2] font-semibold' : 'text-amber-400'}`}>
            word [tab/comma/space] translation
          </code>
        </div>
      </div>

      {/* Summary Status Bar */}
      <div
        className={`border rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-950/80 border-slate-800/80'
        }`}
      >
        {/* Left: Total Recognized Words */}
        <div className="flex items-center gap-2">
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isLight ? 'text-[#1a73e8]' : 'text-emerald-400'}`} />
          <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
            Total Recognized Words:{' '}
            <strong className={`font-mono text-sm ml-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {items.length} words
            </strong>
          </span>
        </div>

        {/* Right: Auto-partitioned MP3 parts info */}
        <div className={`text-right text-[11px] font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#1a73e8]' : 'bg-amber-400'}`}></span>
          <span>
            Auto-partitioned for fast MP3 download into{' '}
            <strong className={`font-mono ${isLight ? 'text-[#1967d2]' : 'text-amber-300'}`}>({totalParts})</strong>{' '}
            parts (100 words per file)
          </span>
        </div>
      </div>
    </div>
  );
};
