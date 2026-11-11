import React from 'react';
import {
  Volume2,
  Layers,
  Sliders,
  Plus,
  Sun,
  Moon,
  Info,
  Mail,
  Shield,
} from 'lucide-react';
import { AppView } from '../types.ts';

interface NavbarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenAddModal: () => void;
  totalWords: number;
  isPlaying: boolean;
  sourceFlag: string;
  targetFlag: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenAddModal,
  totalWords,
  isPlaying,
  sourceFlag,
  targetFlag,
  theme,
  onToggleTheme,
}) => {
  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md text-left transition-colors duration-200 border-b ${
        isLight
          ? 'bg-white/98 border-slate-200 shadow-xs'
          : 'bg-slate-950/95 border-slate-800 shadow-lg'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3 md:gap-6">
        {/* Brand & Language Flags */}
        <div
          onClick={() => onViewChange('player')}
          className="flex items-center gap-2 sm:gap-3 min-w-0 sm:shrink-0 cursor-pointer group"
          title="Return to Studio Workstation"
        >
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform ${
              isLight
                ? 'bg-[#1a73e8] shadow-blue-500/25'
                : 'bg-gradient-to-tr from-indigo-600 via-blue-500 to-amber-500 shadow-indigo-500/20'
            }`}
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`text-sm sm:text-base font-bold tracking-tight font-sans whitespace-nowrap truncate ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                <span className="sm:hidden">
                  Translate{' '}
                  <span className={isLight ? 'text-[#1a73e8]' : 'text-amber-400'}>
                    &amp; MP3
                  </span>
                </span>
                <span className="hidden sm:inline">
                  Translate Words, Texts{' '}
                  <span className={isLight ? 'text-[#1a73e8]' : 'text-amber-400'}>
                    &amp; Convert to MP3
                  </span>
                </span>
              </span>
              <span
                className={`hidden sm:flex text-xs items-center gap-1 px-1.5 py-0.5 rounded-md border shrink-0 ${
                  isLight
                    ? 'bg-[#e8f0fe] border-[#aecbfa] text-[#1967d2] font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <span>{sourceFlag}</span>
                <span className={isLight ? 'text-[#1a73e8]' : 'text-slate-400'}>➔</span>
                <span>{targetFlag}</span>
              </span>
            </div>
            <p
              className={`text-[11px] hidden sm:block leading-none mt-0.5 ${
                isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
              }`}
            >
              100% Free Lifetime Translation &amp; Studio Neural MP3 Voice Generator
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Primary Tools & Policy Pages) */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <button
            onClick={() => onViewChange('player')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
              currentView === 'player'
                ? isLight
                  ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] shadow-sm'
                  : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                : isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <Volume2
              className={`w-3.5 h-3.5 ${
                isLight
                  ? isPlaying
                    ? 'text-white animate-pulse'
                    : 'text-white'
                  : isPlaying
                  ? 'text-amber-400 animate-pulse'
                  : 'text-slate-400'
              }`}
            />
            <span>Workstation</span>
          </button>

          <button
            onClick={() => onViewChange('flashcards')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
              currentView === 'flashcards'
                ? isLight
                  ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] shadow-sm'
                  : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                : isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-slate-400'}`} />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => onViewChange('studio')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
              currentView === 'studio'
                ? isLight
                  ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] shadow-sm'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8] shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-amber-400'}`} />
            <span>Voice Settings</span>
          </button>

          <span className={`mx-1 ${isLight ? 'text-slate-300' : 'text-slate-700'}`}>|</span>

          {/* AdSense Essential Nav Pages */}
          <button
            onClick={() => onViewChange('about')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer border ${
              currentView === 'about'
                ? isLight
                  ? 'bg-[#174ea6] text-white font-bold border-[#174ea6] ring-2 ring-[#8ab4f8]'
                  : 'text-amber-400 font-bold bg-amber-500/10 border-transparent'
                : isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <Info className={`w-3.5 h-3.5 ${isLight ? 'text-white' : ''}`} />
            <span>About</span>
          </button>

          <button
            onClick={() => onViewChange('contact')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer border ${
              currentView === 'contact'
                ? isLight
                  ? 'bg-[#174ea6] text-white font-bold border-[#174ea6] ring-2 ring-[#8ab4f8]'
                  : 'text-amber-400 font-bold bg-amber-500/10 border-transparent'
                : isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <Mail className={`w-3.5 h-3.5 ${isLight ? 'text-white' : ''}`} />
            <span>Contact</span>
          </button>

          <button
            onClick={() => onViewChange('privacy')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer border ${
              currentView === 'privacy'
                ? isLight
                  ? 'bg-[#174ea6] text-white font-bold border-[#174ea6] ring-2 ring-[#8ab4f8]'
                  : 'text-amber-400 font-bold bg-amber-500/10 border-transparent'
                : isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${isLight ? 'text-white' : ''}`} />
            <span>Privacy</span>
          </button>
        </nav>

        {/* Action Buttons: Day/Night Mode & Import */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Day / Night Mode Toggle Icon */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold border-[#1a73e8] shadow-sm'
                : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-slate-700/80 hover:border-amber-400/50'
            }`}
            title={isLight ? 'Switch to Night Mode (الوضع الليلي)' : 'Switch to Day Mode (الوضع النهاري)'}
            aria-label="Toggle Day / Night Mode"
          >
            {isLight ? (
              <>
                <Moon className="w-4 h-4 text-white stroke-[2.2]" />
                <span className="hidden sm:inline">Night Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-pulse stroke-[2.2]" />
                <span className="hidden sm:inline">Day Mode</span>
              </>
            )}
          </button>

          {/* Import List Button (Preserved Amber Exception) */}
          <button
            onClick={onOpenAddModal}
            className="keep-amber-btn px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md shadow-amber-400/20 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Import List</span>
            <span className="sm:hidden">Import</span>
          </button>
        </div>
      </div>
    </header>
  );
};
