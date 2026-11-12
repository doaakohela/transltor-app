import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { VocabularyItem } from '../types.ts';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: Omit<VocabularyItem, 'id' | 'createdAt'>[], replaceExisting: boolean) => void;
  sourceLangName?: string;
  targetLangName?: string;
  theme?: 'dark' | 'light';
}

const DEFAULT_SAMPLE_TEXT = `depression\tdeep sadness and despondency
perseverance\tcontinued effort despite difficulties
awesome\textremely impressive or daunting
opportunity\ta set of circumstances making something possible
challenge\ta demanding task or situation
reliable\tconsistently good in quality or performance
take your time\tdo not hurry, take as long as needed
no problem\tno difficulty or trouble at all`;

function cleanTerm(str: string): string {
  return str
    .replace(/^[\s\t\"\'\`\-\=\:\;\,\|\\\/\[\]\(\)\{\}\.\?\!]+/, '')
    .replace(/[\s\t\"\'\`\-\=\:\;\,\|\\\/\[\]\(\)\{\}\.\?\!]+$/, '')
    .trim();
}

/**
 * Universal line parser: accepts tab, space, comma, dash, colon
 */
export function parseUniversalLine(line: string): { sourceText: string; targetText: string } | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // 1. Check if separated by TAB (\t)
  if (trimmed.includes('\t')) {
    const parts = trimmed.split('\t');
    const p1 = cleanTerm(parts[0]);
    const p2 = cleanTerm(parts.slice(1).join(' '));
    if (p1) {
      return { sourceText: p1, targetText: p2 };
    }
  }

  // 2. Check delimiters: comma, colon, semicolon, pipe, dash (with spaces or single), equal, double-space
  const parts = trimmed.split(/[,;\:=\|]|\s+-\s+|\s{2,}/);
  if (parts.length >= 2) {
    const p1 = cleanTerm(parts[0]);
    const p2 = cleanTerm(parts.slice(1).join(' '));
    if (p1) {
      return { sourceText: p1, targetText: p2 };
    }
  }

  // 3. Script transition (e.g. Latin word followed by Arabic / Cyrillic / CJK / Hebrew / Devanagari translation)
  const scriptMatch = trimmed.match(/^([a-zA-Z0-9\s'-]+?)\s+([\u0600-\u06FF\u0590-\u05FF\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0900-\u097F].+)$/);
  if (scriptMatch) {
    const p1 = cleanTerm(scriptMatch[1]);
    const p2 = cleanTerm(scriptMatch[2]);
    if (p1 && p2) {
      return { sourceText: p1, targetText: p2 };
    }
  }

  // 4. Reverse script transition: Non-Latin word followed by Latin translation
  const reverseMatch = trimmed.match(/^([\u0600-\u06FF\u0590-\u05FF\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0900-\u097F\s'-]+?)\s+([a-zA-Z0-9].+)$/);
  if (reverseMatch) {
    const p1 = cleanTerm(reverseMatch[1]);
    const p2 = cleanTerm(reverseMatch[2]);
    if (p1 && p2) {
      return { sourceText: p1, targetText: p2 };
    }
  }

  // Single word or multi-word phrase (e.g., "plugging in", "by far", "hello")
  return { sourceText: cleanTerm(trimmed), targetText: '' };
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  sourceLangName = 'Source',
  targetLangName = 'Target',
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [text, setText] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle file upload from Mobile, Tablet, or Desktop device (.txt, .csv, .tsv, .json)
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (typeof content === 'string') {
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
                setText(textLines);
                setAttachedFileName(file.name);
                return;
              }
            }
          } catch (jsonErr) {
            console.warn('JSON parse error, falling back to raw text:', jsonErr);
          }
        }
        setText(content);
        setAttachedFileName(file.name);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  // Parse lines
  const parseLines = () => {
    const lines = text.split('\n');
    const parsed: { sourceText: string; targetText: string }[] = [];

    lines.forEach((line) => {
      const res = parseUniversalLine(line);
      if (res && res.sourceText) {
        parsed.push(res);
      }
    });

    return parsed;
  };

  const parsedItems = parseLines();

  const handleImport = () => {
    if (parsedItems.length === 0) return;

    const itemsToImport = parsedItems.map((item) => ({
      sourceText: item.sourceText,
      targetText: item.targetText,
      english: item.sourceText,
      arabic: item.targetText,
      mastered: false,
    }));

    onImport(itemsToImport, replaceExisting);
    setText('');
    setAttachedFileName(null);
    onClose();
  };

  const loadSample = () => {
    setText(DEFAULT_SAMPLE_TEXT);
    setAttachedFileName(null);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-left"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`border w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-4 sm:p-6 shadow-2xl relative ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 sm:pb-4 border-b gap-2 ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${
                isLight ? 'bg-[#1a73e8] text-white' : 'bg-indigo-600/20 text-indigo-400'
              }`}
            >
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className={`text-sm sm:text-base font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Bulk Vocabulary Import (Up to 10,000 Words)
              </h3>
              <p className={`text-xs truncate ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Upload a file or paste Tab, comma, dash, or space-separated lists
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
              isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden Device File Picker Input (Supports Mobile, Tablet, Desktop) */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileAttach}
          accept=".txt,.csv,.tsv,.json,.text,text/plain,text/csv,application/json"
          className="hidden"
        />

        {/* Content */}
        <div className="mt-4 space-y-3.5 sm:space-y-4">
          {/* Device File Attachment Box + Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="keep-amber-btn px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-400/20 border border-amber-500/50 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Choose TXT, CSV, TSV, or JSON file from your phone, tablet, or computer"
              >
                <Upload className="w-3.5 h-3.5 stroke-[2.5] text-slate-950" />
                <span>Attach File from Device (TXT / CSV / JSON)</span>
              </button>

              <button
                type="button"
                onClick={loadSample}
                className={`px-3 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors border ${
                  isLight
                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Demo Sample</span>
              </button>
            </div>

            <span className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {sourceLangName} ➔ {targetLangName}
            </span>
          </div>

          {/* Attached File Pill */}
          {attachedFileName && (
            <div
              className={`px-3 py-2 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                isLight
                  ? 'bg-[#e8f0fe] border-[#aecbfa] text-[#1967d2]'
                  : 'bg-indigo-950/60 border-indigo-700/60 text-indigo-200'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate font-medium">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Attached: {attachedFileName}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setAttachedFileName(null);
                  setText('');
                }}
                className="text-[11px] font-bold hover:underline shrink-0 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (!e.target.value) setAttachedFileName(null);
            }}
            placeholder={`Attach a file above or paste words here (one per line):\ndepression\tdeep sadness\nperseverance\tcontinued effort\nopportunity, favorable circumstances`}
            rows={8}
            className={`w-full border rounded-xl p-3.5 text-sm font-mono outline-none transition-colors ${
              isLight
                ? 'bg-slate-50 border-slate-300 focus:border-[#1a73e8] text-slate-900 placeholder:text-slate-500'
                : 'bg-slate-950 border-slate-700 focus:border-amber-500 text-slate-100 placeholder-slate-600'
            }`}
          />

          {/* Validation & Preview banner */}
          <div
            className={`border rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 text-xs ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-slate-950/80 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {parsedItems.length > 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className={`font-medium ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>
                    Recognized <strong className={`font-mono text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{parsedItems.length}</strong> valid words
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-500'}`} />
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                    Attach a file or paste your word list to validate
                  </span>
                </>
              )}
            </div>

            {parsedItems.length > 0 && (
              <span
                className={`text-[11px] px-2.5 py-1 rounded-md border truncate max-w-full ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-700'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                1st item: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{parsedItems[0].sourceText}</strong> ➔{' '}
                <span className={isLight ? 'text-[#1967d2] font-semibold' : 'text-amber-300'}>
                  {parsedItems[0].targetText || 'No translation'}
                </span>
              </span>
            )}
          </div>

          {/* Options */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <label className={`flex items-center gap-2 cursor-pointer ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
              <input
                type="checkbox"
                checked={replaceExisting}
                onChange={(e) => setReplaceExisting(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20"
              />
              <span>Replace entire existing list</span>
            </label>
            <span className="text-[11px] text-slate-500">
              High throughput: handles 10,000+ words
            </span>
          </div>

          {/* Actions */}
          <div
            className={`flex items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                isLight
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white'
                  : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={parsedItems.length === 0}
              className="keep-amber-btn px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:hover:from-amber-400 disabled:hover:to-amber-500 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-amber-400/20 border border-amber-500/50 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Import {parsedItems.length} Words</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
