import React, { useState, useEffect } from 'react';
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
  Menu,
  X,
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
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSideMenuOpen) {
        setIsSideMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSideMenuOpen]);

  const handleNavigateFromSideMenu = (view: AppView) => {
    onViewChange(view);
    setIsSideMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 backdrop-blur-md text-left transition-colors duration-200 border-b ${
          isLight
            ? 'bg-white/98 border-slate-200 shadow-xs'
            : 'bg-slate-950/95 border-slate-800 shadow-lg'
        }`}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
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
                <h1
                  className={`text-sm sm:text-base font-bold tracking-tight font-sans whitespace-nowrap truncate inline-block m-0 p-0 ${
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
                </h1>
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

          {/* Primary Workstation Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => onViewChange('player')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                currentView === 'player'
                  ? isLight
                    ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8] shadow-sm'
                    : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
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
                    : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
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
          </nav>

          {/* Action Buttons: Day/Night Mode, Import & Tablet/Desktop Side Menu Trigger */}
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

            {/* Tablet & Desktop Only Side Menu Trigger for About / Contact / Privacy */}
            <button
              type="button"
              onClick={() => setIsSideMenuOpen(true)}
              className={`hidden md:inline-flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer shadow-sm ${
                ['about', 'contact', 'privacy'].includes(currentView)
                  ? isLight
                    ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8]'
                    : 'bg-indigo-600/30 text-amber-300 border-amber-400/50'
                  : isLight
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-500'
              }`}
              title="About, Contact & Privacy Menu"
              aria-label="Open side menu"
            >
              <Menu className={`w-4 h-4 ${isLight ? 'text-white' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Tablet & Desktop Slide-Over Side Menu (About, Contact, Privacy) */}
      {isSideMenuOpen && (
        <div className="hidden md:block fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Site Pages Menu">
          {/* Backdrop */}
          <div
            onClick={() => setIsSideMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Side Panel */}
          <aside
            className={`fixed top-0 right-0 h-full w-72 p-5 border-l shadow-2xl flex flex-col justify-between text-left transition-transform ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-slate-950 border-slate-800 text-white'
            }`}
          >
            <div className="space-y-5">
              <div
                className={`flex items-center justify-between pb-4 border-b ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}
              >
                <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Site Information
                </span>
                <button
                  type="button"
                  onClick={() => setIsSideMenuOpen(false)}
                  className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Close menu (Esc)"
                  aria-label="Close side menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleNavigateFromSideMenu('about')}
                  className={`w-full px-4 py-3 text-sm font-semibold rounded-xl transition-colors flex items-center gap-3 cursor-pointer border ${
                    currentView === 'about'
                      ? isLight
                        ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8]'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : isLight
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                  }`}
                >
                  <Info className={`w-4 h-4 shrink-0 ${isLight ? 'text-white' : 'text-amber-400'}`} />
                  <span>About</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateFromSideMenu('contact')}
                  className={`w-full px-4 py-3 text-sm font-semibold rounded-xl transition-colors flex items-center gap-3 cursor-pointer border ${
                    currentView === 'contact'
                      ? isLight
                        ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8]'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : isLight
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                  }`}
                >
                  <Mail className={`w-4 h-4 shrink-0 ${isLight ? 'text-white' : 'text-amber-400'}`} />
                  <span>Contact</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateFromSideMenu('privacy')}
                  className={`w-full px-4 py-3 text-sm font-semibold rounded-xl transition-colors flex items-center gap-3 cursor-pointer border ${
                    currentView === 'privacy'
                      ? isLight
                        ? 'bg-[#174ea6] text-white border-[#174ea6] ring-2 ring-[#8ab4f8]'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : isLight
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white border-[#1a73e8]'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                  }`}
                >
                  <Shield className={`w-4 h-4 shrink-0 ${isLight ? 'text-white' : 'text-amber-400'}`} />
                  <span>Privacy</span>
                </button>
              </div>
            </div>

            <div className={`pt-4 border-t text-[11px] ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
              Translate Words, Texts &amp; Convert to MP3
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
