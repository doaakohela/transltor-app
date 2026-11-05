import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  Download,
  CheckCircle,
  Repeat,
  Sparkles,
  ListMusic,
  Check,
  Loader2,
  FolderDown,
  Layers,
  ChevronDown,
  FileAudio,
} from 'lucide-react';
import { AudioSettings, PlaybackStage, VocabularyItem } from '../types.ts';
import { speechService } from '../services/speechService.ts';
import { getLanguageByCode } from '../data/languages.ts';

interface ContinuousPlayerProps {
  items: VocabularyItem[];
  currentIndex: number;
  isPlaying: boolean;
  stage: PlaybackStage;
  settings: AudioSettings;
  onPlayToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (index: number) => void;
  onToggleMastered: (id: string) => void;
  onUpdateSettings: (settings: Partial<AudioSettings>) => void;
}

const CHUNK_SIZE = 100;

export const ContinuousPlayer: React.FC<ContinuousPlayerProps> = ({
  items,
  currentIndex,
  isPlaying,
  stage,
  settings,
  onPlayToggle,
  onNext,
  onPrev,
  onSelectIndex,
  onToggleMastered,
  onUpdateSettings,
}) => {
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [isDownloadingPart, setIsDownloadingPart] = useState(false);
  const [partSuccess, setPartSuccess] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [allSuccess, setAllSuccess] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [downloadProgressText, setDownloadProgressText] = useState('');

  const currentItem = items[currentIndex] || items[0];
  const sourceLang = getLanguageByCode(settings.sourceLang || 'en-US');
  const targetLang = getLanguageByCode(settings.targetLang || 'es-ES');

  // Calculate chunks of 100 words
  const totalParts = Math.max(1, Math.ceil(items.length / CHUNK_SIZE));
  const validPartIndex = Math.min(selectedPartIndex, totalParts - 1);
  const partStart = validPartIndex * CHUNK_SIZE;
  const partEnd = Math.min(items.length, (validPartIndex + 1) * CHUNK_SIZE);
  const selectedPartItems = items.slice(partStart, partEnd);

  // Download selected part MP3 (e.g. Part 1: 1-100)
  const handleDownloadPart = async () => {
    if (isDownloadingPart || selectedPartItems.length === 0) return;
    setIsDownloadingPart(true);
    setPartSuccess(false);
    setDownloadProgressText('Synthesizing studio neural MP3...');

    try {
      const filename = `part_${validPartIndex + 1}_words_${partStart + 1}_to_${partEnd}.mp3`;
      const ok = await speechService.downloadBatchAudio(
        selectedPartItems,
        settings,
        selectedPartItems.length,
        filename,
        (curr, tot, txt) => setDownloadProgressText(txt)
      );
      if (ok) {
        setPartSuccess(true);
        setTimeout(() => setPartSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Error downloading part MP3:', err);
    } finally {
      setIsDownloadingPart(false);
      setDownloadProgressText('');
    }
  };

  // Download all parts in sequence
  const handleDownloadAllParts = async () => {
    if (isDownloadingAll || items.length === 0) return;
    setIsDownloadingAll(true);
    setAllSuccess(false);
    setDownloadProgressText('Synthesizing all parts...');

    try {
      // Download chunk by chunk or full master MP3
      const filename = `all_${items.length}_words_complete.mp3`;
      const ok = await speechService.downloadBatchAudio(
        items,
        settings,
        items.length,
        filename,
        (curr, tot, txt) => setDownloadProgressText(txt)
      );
      if (ok) {
        setAllSuccess(true);
        setTimeout(() => setAllSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error downloading all parts MP3:', err);
    } finally {
      setIsDownloadingAll(false);
      setDownloadProgressText('');
    }
  };

  if (!currentItem) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
        <Volume2 className="w-12 h-12 text-slate-600 mx-auto" />
        <h4 className="text-base font-semibold text-white">Your Vocabulary List is Empty</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Type or paste words in the input box above, click "Demo Sample List", or upload a text file to start listening and converting to MP3!
        </p>
      </div>
    );
  }

  const sourceWord = currentItem.sourceText || currentItem.english || '';
  const targetWord = currentItem.targetText || currentItem.arabic || '';

  const isSrc1Active = stage === 'source_1' || stage === 'en_1';
  const isSrc2Active = stage === 'source_2' || stage === 'en_2';
  const isTgtActive = stage === 'target_1' || stage === 'ar_1';
  const isSpeaking = isSrc1Active || isSrc2Active || isTgtActive;

  return (
    <div className="space-y-6 text-left">
      {/* Dual Cards Grid (Screenshot 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1 (LEFT): LIVE CONTINUOUS PLAYER */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
          {/* Subtle audio glow */}
          <div
            className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
              isTgtActive
                ? 'bg-amber-500/20 opacity-100'
                : isSpeaking
                ? 'bg-indigo-500/20 opacity-100'
                : 'opacity-10 bg-indigo-500/10'
            }`}
          />

          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Live Listening
                </span>
                <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
                  Live Continuous Player
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Toggle playlist queue"
                >
                  <ListMusic className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Speaks each word 2x in Source voice + 1x in Target voice with natural studio pauses and zero robotic intro names.
            </p>

            {/* Word Index Counter & Navigation Buttons */}
            <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-xs">
              <span className="text-slate-400 font-mono">
                Word: <strong className="text-white font-bold">{currentIndex + 1}</strong> / {items.length}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={onPrev}
                  disabled={currentIndex === 0}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Previous word"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={onNext}
                  disabled={currentIndex + 1 >= items.length}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Next word"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Big Word Display Box */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-6 text-center space-y-3 min-h-[160px] flex flex-col items-center justify-center relative shadow-inner">
              {/* Audio Wave Indicator */}
              <div className="h-6 flex items-center justify-center gap-1">
                {isSpeaking ? (
                  <>
                    <span className="w-1.5 h-4 rounded-full bg-amber-400 animate-pulse" />
                    <span className="w-1.5 h-6 rounded-full bg-indigo-400 animate-pulse delay-75" />
                    <span className="w-1.5 h-5 rounded-full bg-amber-400 animate-pulse delay-150" />
                    <span className="w-1.5 h-3 rounded-full bg-indigo-400 animate-pulse delay-100" />
                  </>
                ) : (
                  <span className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
                    Ready
                  </span>
                )}
              </div>

              {/* Source word in bold white font */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight break-words">
                {sourceWord}
              </h3>

              {/* Target translation in amber font */}
              <p className="text-base sm:text-lg font-semibold text-amber-300 break-words">
                {targetWord || 'No translation'}
              </p>
            </div>
          </div>

          {/* Big Action Button (Screenshot 3) */}
          <div className="pt-6">
            <button
              onClick={onPlayToggle}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer ${
                isPlaying
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause Playback</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Listening to List ({items.length} Words)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CARD 2 (RIGHT): DOWNLOAD MP3 AUDIO FILES */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Studio MP3 Files
                </span>
                <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
                  Download MP3 Audio Files
                </h4>
              </div>

              <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-lg shadow-sm">
                Pure MP3 Format
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Full studio audio (2x source + 1x target). Offline playback ready for mobile, car, or desktop player.
            </p>

            {/* Chunk & Part Selection Box */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Selected Part Info:</span>
                <span className="text-amber-300 font-mono font-semibold">
                  Part {validPartIndex + 1} ({partStart + 1} - {partEnd} of {items.length})
                </span>
              </div>

              {/* Chunk Size notice */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Chunk Size:</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300 font-mono">
                  100 words per file (Recommended)
                </span>
              </div>

              {/* Part Dropdown Selector */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium block">
                  Choose Part to Download:
                </label>
                <div className="relative">
                  <select
                    value={validPartIndex}
                    onChange={(e) => setSelectedPartIndex(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none outline-none focus:border-amber-400 cursor-pointer font-mono"
                  >
                    {Array.from({ length: totalParts }).map((_, idx) => {
                      const s = idx * CHUNK_SIZE + 1;
                      const e = Math.min(items.length, (idx + 1) * CHUNK_SIZE);
                      return (
                        <option key={idx} value={idx}>
                          Part {idx + 1} ({s} - {e})
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons for MP3 Download (Screenshot 3) */}
          <div className="pt-6 space-y-3">
            {/* Button 1: Download This Part */}
            <button
              onClick={handleDownloadPart}
              disabled={isDownloadingPart || selectedPartItems.length === 0}
              className="w-full py-3 px-5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDownloadingPart ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Part {validPartIndex + 1} MP3...</span>
                </>
              ) : partSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  <span>Downloaded Part {validPartIndex + 1} Successfully!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    Download This Part ({partStart + 1} - {partEnd}) MP3
                  </span>
                </>
              )}
            </button>

            {/* Button 2: Download All Parts Automatically */}
            <button
              onClick={handleDownloadAllParts}
              disabled={isDownloadingAll || items.length === 0}
              className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDownloadingAll ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Packaging All Parts...</span>
                </>
              ) : allSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>All Parts Downloaded!</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Download All Parts Automatically ({totalParts} Files)
                  </span>
                </>
              )}
            </button>

            {/* Live Progress Bar when downloading */}
            {(isDownloadingPart || isDownloadingAll) && downloadProgressText && (
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-2.5 text-xs text-amber-300 flex items-center gap-2 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
                <span className="truncate">{downloadProgressText}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Drawer */}
      {showPlaylist && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl animate-fade-in text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="font-bold text-white text-sm">
              Playlist Queue ({items.length} words)
            </h3>
            <button
              onClick={() => setShowPlaylist(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Close Playlist
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 custom-scrollbar">
            {items.map((item, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectIndex(idx)}
                  className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-center text-xs font-mono text-slate-500">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-sm">
                        {item.sourceText || item.english}
                      </span>
                      <span className="text-slate-400 text-xs ml-3">
                        {item.targetText || item.arabic}
                      </span>
                    </div>
                  </div>
                  {isCurrent && isPlaying && (
                    <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
