import React, { useState } from 'react';
import {
  X,
  UploadCloud,
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
}) => {
  const [text, setText] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);

  if (!isOpen) return null;

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
    onClose();
  };

  const loadSample = () => {
    setText(DEFAULT_SAMPLE_TEXT);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Bulk Vocabulary Import (Up to 10,000 Words)
              </h3>
              <p className="text-xs text-slate-400">
                Supports Tab-delimited, comma-separated, dash, or space-separated formats
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={loadSample}
              className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Fill with sample demo lines</span>
            </button>
            <span className="text-[11px] text-slate-400">
              {sourceLangName} ➔ {targetLangName}
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Paste words here (one per line):\ndepression\tdeep sadness\nperseverance\tcontinued effort\nopportunity, favorable circumstances`}
            rows={9}
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 font-mono outline-none transition-colors"
          />

          {/* Validation & Preview banner */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {parsedItems.length > 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-medium">
                    Recognized <strong className="font-mono text-white text-sm">{parsedItems.length}</strong> valid words
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-slate-400">Paste or type your word list to validate</span>
                </>
              )}
            </div>

            {parsedItems.length > 0 && (
              <span className="text-slate-400 text-[11px] bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                1st item: <strong className="text-white">{parsedItems[0].sourceText}</strong> ➔{' '}
                <span className="text-amber-300">{parsedItems[0].targetText || 'No translation'}</span>
              </span>
            )}
          </div>

          {/* Options */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
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
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={parsedItems.length === 0}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Import {parsedItems.length} Words</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
