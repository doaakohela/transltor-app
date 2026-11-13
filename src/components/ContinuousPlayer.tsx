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
  theme?: 'dark' | 'light';
  viewSection?: 'all' | 'player' | 'download';
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
  theme = 'dark',
  viewSection = 'all',
}) => {
  const isLight = theme === 'light';
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [isDownloadingPart, setIsDownloadingPart] = useState(false);
  const [partSuccess, setPartSuccess] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [allSuccess, setAllSuccess] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [downloadProgressText, setDownloadProgressText] = useState('');

  const currentItem = items[currentIndex] || items[0];

  // Calculate chunks of 100 words
  const totalParts = Math.max(1, Math.ceil(items.length / CHUNK_SIZE));
  const validPartIndex = Math.min(selectedPartIndex, totalParts - 1);
  const partStart = validPartIndex * CHUNK_SIZE;
  const partEnd = Math.min(items.length, (validPartIndex + 1) * CHUNK_SIZE);
  const selectedPartItems = items.slice(partStart, partEnd);
  const is2x1x = (settings.sourceRepeats ?? 2) === 2 && (settings.targetRepeats ?? 1) === 1;

  const handleToggleRepetitionPattern = () => {
    if (is2x1x) {
      onUpdateSettings({ sourceRepeats: 1, targetRepeats: 2 });
    } else {
      onUpdateSettings({ sourceRepeats: 2, targetRepeats: 1 });
    }
  };

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
    if (viewSection === 'download') {
      return null;
    }
    return (
      <div
        className={`border rounded-3xl p-10 sm:p-12 text-center space-y-3 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-600 shadow-lg'
            : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}
      >
        <Volume2 className={`w-12 h-12 mx-auto ${isLight ? 'text-[#1a73e8]' : 'text-slate-600'}`} />
        <h4 className={`text-base font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Your Vocabulary List is Empty
        </h4>
        <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Add translated words above, paste words in Bulk Word &amp; Text Input below, or import a file to start listening and converting to MP3!
        </p>
      </div>
    );
  }

  const sourceWord = currentItem.sourceText || currentItem.english || '';
  const targetWord = currentItem.targetText || currentItem.arabic || '';
  const currentItemSourceLang = getLanguageByCode(currentItem.sourceLang || settings.sourceLang || 'en-US');
  const currentItemTargetLang = getLanguageByCode(currentItem.targetLang || settings.targetLang || 'es-ES');

  const isSrc1Active = stage === 'source_1' || stage === 'en_1';
  const isSrc2Active = stage === 'source_2' || stage === 'en_2';
  const isTgtActive = stage === 'target_1' || stage === 'ar_1';
  const isSpeaking = isSrc1Active || isSrc2Active || isTgtActive;

  const showPlayerCard = viewSection === 'all' || viewSection === 'player';
  const showDownloadCard = viewSection === 'all' || viewSection === 'download';

  return (
    <div className="space-y-6 text-left">
      {/* Cards Container: Dual grid when 'all', full-width standalone card when separated */}
      <div className={viewSection === 'all' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'w-full'}>
        {/* CARD 1 (LEFT): LIVE CONTINUOUS PLAYER */}
        {showPlayerCard && (
        <div
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-colors border ${
            isLight
              ? 'bg-white border-slate-200 shadow-xl'
              : 'bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 border-slate-800 shadow-2xl'
          }`}
        >
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
            <div
              className={`flex items-center justify-between gap-2 border-b pb-3 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}
            >
              <div className="min-w-0">
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${isLight ? 'text-[#1a73e8]' : 'text-indigo-400'}`}>
                  Live Listening
                </span>
                <h4 className={`text-base font-bold tracking-tight mt-0.5 whitespace-nowrap truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span className="sm:hidden">Live Player</span>
                  <span className="hidden sm:inline">Live Continuous Player</span>
                </h4>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleRepetitionPattern}
                  title={
                    is2x1x
                      ? 'Current: 2x Word + 1x Translation. Click to switch to: 1x Word + 2x Translation'
                      : 'Current: 1x Word + 2x Translation. Click to switch to: 2x Word + 1x Translation'
                  }
                  className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${
                    isLight
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                      : is2x1x
                      ? 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-700/80'
                      : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-600/80'
                  }`}
                >
                  <Repeat className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-white' : is2x1x ? 'text-indigo-400' : 'text-amber-400'}`} />
                  <span className="sm:hidden">{is2x1x ? '2x+1x' : '1x+2x'}</span>
                  <span className="hidden sm:inline">{is2x1x ? '2x Word + 1x Trans' : '1x Word + 2x Trans'}</span>
                </button>

                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`p-1.5 rounded-lg shrink-0 transition-colors cursor-pointer border ${
                    isLight
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800 border-transparent'
                  }`}
                  title="Toggle playlist queue"
                >
                  <ListMusic className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Speaks each word <strong className={isLight ? 'text-[#1967d2]' : 'text-indigo-300'}>{settings.sourceRepeats ?? 2}x</strong> in Source voice + <strong className={isLight ? 'text-[#1967d2]' : 'text-amber-300'}>{settings.targetRepeats ?? 1}x</strong> in Target voice with natural studio pauses and zero robotic intro names.
            </p>

            {/* Word Index Counter & Navigation Buttons */}
            <div
              className={`flex items-center justify-between border rounded-xl px-3.5 py-2 text-xs ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400'
              }`}
            >
              <span className="font-mono">
                Word: <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white font-bold'}>{currentIndex + 1}</strong> / {items.length}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={onPrev}
                  disabled={currentIndex === 0}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed border ${
                    isLight
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] disabled:hover:bg-[#1a73e8] text-white border-[#1a73e8]'
                      : 'disabled:opacity-30 text-slate-400 hover:text-white hover:bg-slate-800 border-transparent'
                  }`}
                  title="Previous word"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={onNext}
                  disabled={currentIndex + 1 >= items.length}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed border ${
                    isLight
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] disabled:hover:bg-[#1a73e8] text-white border-[#1a73e8]'
                      : 'disabled:opacity-30 text-slate-400 hover:text-white hover:bg-slate-800 border-transparent'
                  }`}
                  title="Next word"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Big Word Display Box */}
            <div
              className={`border rounded-2xl p-6 text-center space-y-3 min-h-[160px] flex flex-col items-center justify-center relative shadow-inner ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/90'
              }`}
            >
              {/* Audio Wave Indicator */}
              <div className="h-6 flex items-center justify-center gap-1">
                {isSpeaking ? (
                  <>
                    <span className={`w-1.5 h-4 rounded-full animate-pulse ${isLight ? 'bg-[#1a73e8]' : 'bg-amber-400'}`} />
                    <span className={`w-1.5 h-6 rounded-full animate-pulse delay-75 ${isLight ? 'bg-[#4285f4]' : 'bg-indigo-400'}`} />
                    <span className={`w-1.5 h-5 rounded-full animate-pulse delay-150 ${isLight ? 'bg-[#1a73e8]' : 'bg-amber-400'}`} />
                    <span className={`w-1.5 h-3 rounded-full animate-pulse delay-100 ${isLight ? 'bg-[#4285f4]' : 'bg-indigo-400'}`} />
                  </>
                ) : (
                  <span className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
                    Ready
                  </span>
                )}
              </div>

              {/* Active Word Original Language Pair Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300'
                }`}
              >
                <span>{currentItemSourceLang.flag} {currentItemSourceLang.name}</span>
                <span className="opacity-60">→</span>
                <span>{currentItemTargetLang.flag} {currentItemTargetLang.name}</span>
              </div>

              {/* Source word in bold font */}
              <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight break-words max-w-full ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {sourceWord}
              </h3>

              {/* Target translation */}
              <p className={`text-base sm:text-lg font-semibold break-words max-w-full ${isLight ? 'text-[#1967d2]' : 'text-amber-300'}`}>
                {targetWord || 'No translation'}
              </p>
            </div>
          </div>

          {/* Big Action Button (Screenshot 3) */}
          <div className="pt-6">
            <button
              onClick={onPlayToggle}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer ${
                isLight
                  ? isPlaying
                    ? 'bg-[#1557b0] hover:bg-[#174ea6] text-white shadow-blue-500/25'
                    : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-blue-500/25'
                  : isPlaying
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
        )}

        {/* CARD 2 (RIGHT): DOWNLOAD MP3 AUDIO FILES */}
        {showDownloadCard && (
        <div
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-colors border ${
            isLight
              ? 'bg-white border-slate-200 shadow-xl'
              : 'bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 border-slate-800 shadow-2xl'
          }`}
        >
          <div className="space-y-5">
            {/* Header */}
            <div
              className={`flex items-center justify-between gap-2 border-b pb-3 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}
            >
              <div className="min-w-0">
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${isLight ? 'text-[#1a73e8]' : 'text-amber-400'}`}>
                  Studio MP3 Files
                </span>
                <h4 className={`text-base font-bold tracking-tight mt-0.5 whitespace-nowrap truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span className="sm:hidden">Download MP3</span>
                  <span className="hidden sm:inline">Download MP3 Audio Files</span>
                </h4>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleRepetitionPattern}
                  title="Switch repetition mode (2x+1x ⇄ 1x+2x)"
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1 shadow-xs ${
                    isLight
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <Repeat className={`w-3 h-3 shrink-0 ${isLight ? 'text-white' : 'text-amber-500'}`} />
                  <span>{is2x1x ? '2x+1x' : '1x+2x'}</span>
                </button>
                <span className="keep-amber-btn px-2.5 py-1 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-lg shadow-xs whitespace-nowrap shrink-0">
                  <span className="sm:hidden">MP3</span>
                  <span className="hidden sm:inline">Pure MP3 Format</span>
                </span>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Full studio audio (<strong className={isLight ? 'text-[#1967d2]' : 'text-indigo-300'}>{settings.sourceRepeats ?? 2}x source</strong> + <strong className={isLight ? 'text-[#1967d2]' : 'text-amber-300'}>{settings.targetRepeats ?? 1}x target</strong>). Offline playback ready for mobile, car, or desktop player.
            </p>

            {/* Chunk & Part Selection Box */}
            <div
              className={`border rounded-2xl p-4 space-y-3.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <span>Selected Part Info:</span>
                <span className={`font-mono font-bold ${isLight ? 'text-[#1967d2]' : 'text-amber-300'}`}>
                  Part {validPartIndex + 1} ({partStart + 1} - {partEnd} of {items.length})
                </span>
              </div>

              {/* Chunk Size notice */}
              <div className={`flex items-center justify-between text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <span>Chunk Size:</span>
                <span className={`px-2 py-0.5 rounded border font-mono ${
                  isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  100 words per file (Recommended)
                </span>
              </div>

              {/* Part Dropdown Selector */}
              <div className="space-y-1">
                <label className={`text-[11px] font-medium block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Choose Part to Download:
                </label>
                <div className="relative">
                  <select
                    value={validPartIndex}
                    onChange={(e) => setSelectedPartIndex(Number(e.target.value))}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs appearance-none outline-none cursor-pointer font-mono ${
                      isLight
                        ? 'bg-white border-[#aecbfa] focus:border-[#1a73e8] text-slate-900 shadow-xs'
                        : 'bg-slate-900 border-slate-700/80 focus:border-amber-500 text-white'
                    }`}
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
                  <ChevronDown className={`w-4 h-4 absolute right-3 top-3 pointer-events-none ${isLight ? 'text-[#1a73e8]' : 'text-slate-400'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons for MP3 Download (Kept Distinctive Amber/Gold) */}
          <div className="pt-6 space-y-3">
            {/* Button 1: Download This Part */}
            <button
              onClick={handleDownloadPart}
              disabled={isDownloadingPart || selectedPartItems.length === 0}
              className="keep-amber-btn w-full py-3 px-5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
              className={`keep-amber-btn w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                isLight
                  ? 'keep-amber-outline bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-400 shadow-xs'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              {isDownloadingAll ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Packaging All Parts...</span>
                </>
              ) : allSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  <span>All Parts Downloaded!</span>
                </>
              ) : (
                <>
                  <Layers className={`w-3.5 h-3.5 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
                  <span>
                    Download All Parts Automatically ({totalParts} Files)
                  </span>
                </>
              )}
            </button>
            {/* Live Progress Bar when downloading */}
            {(isDownloadingPart || isDownloadingAll) && downloadProgressText && (
              <div className={`rounded-xl p-2.5 text-xs flex items-center gap-2 animate-pulse border ${
                isLight
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
              }`}>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500 shrink-0" />
                <span className="truncate">{downloadProgressText}</span>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Playlist Drawer */}
      {showPlayerCard && showPlaylist && (
        <div
          className={`border rounded-3xl p-5 shadow-xl animate-fade-in text-left ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b mb-3 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Playlist Queue ({items.length} words)
            </h3>
            <button
              onClick={() => setShowPlaylist(false)}
              className={`text-xs font-semibold cursor-pointer px-2.5 py-1 rounded-lg ${
                isLight ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white' : 'text-slate-400 hover:text-white'
              }`}
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
                      ? isLight
                        ? 'bg-[#1a73e8] border border-[#1557b0] text-white'
                        : 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : isLight
                      ? 'hover:bg-[#e8f0fe]/60 text-slate-800'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 text-center text-xs font-mono ${isCurrent && isLight ? 'text-blue-100' : 'text-slate-500'}`}>
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-sm">
                        {item.sourceText || item.english}
                      </span>
                      <span className={`text-xs ml-3 ${isCurrent && isLight ? 'text-blue-100' : isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {item.targetText || item.arabic}
                      </span>
                    </div>
                  </div>
                  {isCurrent && isPlaying && (
                    <Volume2 className={`w-4 h-4 animate-pulse ${isLight ? 'text-white' : 'text-amber-400'}`} />
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
