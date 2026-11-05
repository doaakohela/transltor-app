import React, { useState } from 'react';
import {
  X,
  Download,
  Check,
  Copy,
  Puzzle,
  Sparkles,
  MousePointer,
  Volume2,
  FileCode,
  FolderArchive,
  Loader2,
  ShieldCheck,
  Image as ImageIcon,
  DollarSign,
  ExternalLink,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { downloadExtensionZip, MANIFEST_CONTENT } from '../services/extensionExporter.ts';

interface ChromeExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChromeExtensionModal: React.FC<ChromeExtensionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'icons' | 'monetization' | 'manifest'>('guide');

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      const ok = await downloadExtensionZip();
      if (ok) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(MANIFEST_CONTENT);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText('chrome://extensions');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-amber-950/60 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Puzzle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Pronounce Words, Texts &amp; Convert to MP3</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-md">
                  Manifest V3 Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official Google Chrome Extension with 100% Free Lifetime Translation &amp; Studio MP3 Voices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 pb-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Install Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('icons')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'icons'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>3 Chrome Icons</span>
            </button>

            <button
              onClick={() => setActiveTab('monetization')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'monetization'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Ad &amp; Partner Policy</span>
            </button>

            <button
              onClick={() => setActiveTab('manifest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'manifest'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>manifest.json</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 hidden md:block shrink-0">
            Chrome, Edge, Brave, Opera
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* TAB 1: INSTALL GUIDE */}
          {activeTab === 'guide' && (
            <>
              {/* Unlimited Free Lifetime Banner */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl flex items-start gap-3">
                <InfinityIcon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-white">100% Free Lifetime Translation &amp; Voice Synthesis</p>
                  <p className="text-slate-300 leading-relaxed">
                    Zero quotas, zero API keys required, and no limits on word count. Uses high-speed direct translation and Microsoft neural studio voices that never stop.
                  </p>
                </div>
              </div>

              {/* Main Download CTA Card */}
              <div className="bg-gradient-to-r from-amber-500/10 via-slate-800/60 to-indigo-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderArchive className="w-4 h-4 text-amber-400" />
                    <span>Complete Chrome Extension Package (ZIP)</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Includes: <code className="text-amber-300 font-mono">manifest.json</code> + <code className="text-amber-300 font-mono">popup.html</code> + <code className="text-amber-300 font-mono">popup.js</code> + 3 Icons + Service Worker
                  </p>
                </div>

                <button
                  onClick={handleDownloadZip}
                  disabled={isDownloading}
                  className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Packaging Extension...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                      <span>Downloaded Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Download Extension (ZIP)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step by step install guide */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Quick 1-Minute Chrome Setup:
                </h5>

                {/* Step 1 */}
                <div className="flex items-start gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h6 className="text-xs font-semibold text-white">Download and Extract ZIP</h6>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Click the button above to download <code className="text-amber-300">pronounce-words-texts-mp3-extension.zip</code> and unzip it to any folder.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1">
                    <h6 className="text-xs font-semibold text-white">Open Extensions in Chrome</h6>
                    <p className="text-[11px] text-slate-400 mt-0.5 mb-2">
                      Paste the following address into your browser URL bar:
                    </p>
                    <div className="flex items-center justify-between bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-300">
                      <span>chrome://extensions</span>
                      <button
                        onClick={handleCopyUrl}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-sans"
                      >
                        {copiedUrl ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h6 className="text-xs font-semibold text-white">Enable Developer mode</h6>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Toggle on the <strong>Developer mode</strong> switch at the top-right corner of the Extensions page.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h6 className="text-xs font-semibold text-white">Click "Load unpacked"</h6>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Click <strong>Load unpacked</strong> and select the unzipped folder containing <code className="text-amber-300">manifest.json</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Extra Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center gap-2.5">
                  <MousePointer className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-xs text-slate-300">
                    Right-click any selected text on any website to translate &amp; pronounce 2x
                  </span>
                </div>
                <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs text-slate-300">
                    Neural dual-voice repetitions with custom silent intervals and MP3 export
                  </span>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: 3 ICONS FOR CHROME EXTENSION */}
          {activeTab === 'icons' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-2xl">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span>3 Standard Chrome Extension Icons (16x16, 48x48, 128x128)</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  These 3 icon assets strictly conform to Chrome Web Store Manifest V3 guidelines. They are pre-bundled in the ZIP package under the <code className="text-amber-300 font-mono">icons/</code> directory and can also be downloaded individually below:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 16x16 */}
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center">
                    <img src="/icons/icon16.png" alt="Icon 16x16" className="w-4 h-4 shadow" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">icon16.png (16×16)</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">Browser favicon &amp; toolbar icon</p>
                  </div>
                  <a
                    href="/icons/icon16.png"
                    download="icon16.png"
                    className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download PNG</span>
                  </a>
                </div>

                {/* 48x48 */}
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center">
                    <img src="/icons/icon48.png" alt="Icon 48x48" className="w-12 h-12 rounded-lg shadow" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">icon48.png (48×48)</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">Extensions management list</p>
                  </div>
                  <a
                    href="/icons/icon48.png"
                    download="icon48.png"
                    className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download PNG</span>
                  </a>
                </div>

                {/* 128x128 */}
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center">
                    <img src="/icons/icon128.png" alt="Icon 128x128" className="w-14 h-14 rounded-xl shadow" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">icon128.png (128×128)</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">Chrome Web Store listing</p>
                  </div>
                  <a
                    href="/icons/icon128.png"
                    download="icon128.png"
                    className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download PNG</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MONETIZATION & CHROME AD POLICY COMPLIANCE */}
          {activeTab === 'monetization' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Monetization &amp; Chrome Web Store Ad Compliance</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Google Chrome Web Store strictly enforces Developer Policy Section 3 regarding advertising and remote scripts. Your monetization link is integrated in <strong>100% full compliance</strong>:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white">Clear &amp; Transparent Sponsorship Label:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Clearly identified as "Sponsored Partner" so users are never misled or confused.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white">No Injected Remote Code (Manifest V3 Strict):</strong>
                    <p className="text-slate-400 mt-0.5">
                      Manifest V3 prohibits injecting remote scripts. The partner link opens directly in a new secure browser tab via standard HTML, preventing rejection during Chrome Store review.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white">Embedded in Extension Popup &amp; Main App:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Embedded in the navbar, app footer, and extension popup so your audience can support your free application.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-400">Target Monetization URL:</span>
                  <p className="text-amber-300 font-mono text-[11px] truncate mt-0.5">https://uplcm.com/4/12174511</p>
                </div>
                <a
                  href="https://uplcm.com/4/12174511"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                >
                  <span>Test Partner Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: MANIFEST.JSON VIEWER */}
          {activeTab === 'manifest' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Official Chrome Manifest V3 descriptor file:</span>
                <button
                  onClick={handleCopyManifest}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedManifest ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copy Manifest Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] font-mono text-emerald-300 overflow-x-auto text-left max-h-[350px]">
                {MANIFEST_CONTENT}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Free Lifetime Translation • Manifest V3 Compliant</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
