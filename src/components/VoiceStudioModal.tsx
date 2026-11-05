import React, { useState } from 'react';
import {
  Sliders,
  Volume2,
  Sparkles,
  Check,
  RotateCcw,
  Clock,
  Download,
  Loader2,
  Radio,
} from 'lucide-react';
import { AudioSettings } from '../types.ts';
import { speechService } from '../services/speechService.ts';
import { getLanguageByCode } from '../data/languages.ts';

interface VoiceStudioProps {
  settings: AudioSettings;
  onUpdateSettings: (newSettings: Partial<AudioSettings>) => void;
}

export const VoiceStudio: React.FC<VoiceStudioProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [testingSource, setTestingSource] = useState(false);
  const [testingTarget, setTestingTarget] = useState(false);
  const [testSampleDownloaded, setTestSampleDownloaded] = useState(false);
  const [isDownloadingSample, setIsDownloadingSample] = useState(false);

  const currentSourceLang = getLanguageByCode(settings.sourceLang || 'en-US');
  const currentTargetLang = getLanguageByCode(settings.targetLang || 'es-ES');

  // Test Source Language
  const handleTestSource = async () => {
    if (testingSource) return;
    setTestingSource(true);
    const voiceId = settings.sourceVoice || currentSourceLang.defaultVoice;
    const voice = currentSourceLang.voices.find((v) => v.id === voiceId) || currentSourceLang.voices[0];
    await speechService.speakText(
      voice.samplePhrase,
      currentSourceLang.code,
      voice.id
    );
    setTestingSource(false);
  };

  // Test Target Language
  const handleTestTarget = async () => {
    if (testingTarget) return;
    setTestingTarget(true);
    const voiceId = settings.targetVoice || currentTargetLang.defaultVoice;
    const voice = currentTargetLang.voices.find((v) => v.id === voiceId) || currentTargetLang.voices[0];
    await speechService.speakText(
      voice.samplePhrase,
      currentTargetLang.code,
      voice.id
    );
    setTestingTarget(false);
  };

  // Test combined download
  const handleTestDownload = async () => {
    if (isDownloadingSample) return;
    setIsDownloadingSample(true);
    setTestSampleDownloaded(false);

    try {
      const ok = await speechService.downloadSequenceAudio(
        {
          id: 'test-sample',
          sourceText: 'Opportunity',
          targetText: 'A set of circumstances that makes it possible to do something',
          createdAt: Date.now(),
        },
        settings
      );
      if (ok) {
        setTestSampleDownloaded(true);
        setTimeout(() => setTestSampleDownloaded(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloadingSample(false);
    }
  };

  // Reset to default balanced timings
  const handleResetTimings = () => {
    onUpdateSettings({
      pauseBetweenSource: 600,
      pauseBetweenLanguages: 800,
      pauseBetweenWords: 1400,
      sourceRepeats: 2,
      targetRepeats: 1,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-amber-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-amber-400/20 text-amber-300 rounded-xl">
                <Sliders className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Voice Studio & Audio Prosody
              </h2>
            </div>
            <p className="text-sm text-slate-300">
              Customize natural studio voices for any language, repetition counts, and exact silent pauses
            </p>
          </div>

          <button
            onClick={handleTestDownload}
            disabled={isDownloadingSample}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer"
          >
            {isDownloadingSample ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : testSampleDownloaded ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Download className="w-4 h-4 text-amber-400" />
            )}
            <span>Download Test Sample MP3</span>
          </button>
        </div>
      </div>

      {/* Grid: Source Voice & Target Voice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Language Voice Settings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentSourceLang.flag}</span>
              <div>
                <h3 className="font-bold text-white text-base">
                  {currentSourceLang.name} Voice
                </h3>
                <span className="text-[11px] text-indigo-400">
                  Repeats: {settings.sourceRepeats || 2}x in sequence
                </span>
              </div>
            </div>

            <button
              onClick={handleTestSource}
              disabled={testingSource}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              {testingSource ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              <span>Preview Voice</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pl-1">
            {currentSourceLang.voices.map((voice) => {
              const isSelected =
                (settings.sourceVoice || currentSourceLang.defaultVoice) === voice.id;
              return (
                <div
                  key={voice.id}
                  onClick={() =>
                    onUpdateSettings({
                      sourceVoice: voice.id,
                      enGeminiVoice: voice.id,
                    })
                  }
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio
                        className={`w-4 h-4 ${
                          isSelected ? 'text-indigo-400' : 'text-slate-600'
                        }`}
                      />
                      <span className="text-xs font-bold text-white">{voice.name}</span>
                    </div>
                    {voice.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                        {voice.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 ml-6">
                    {voice.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Repeat count slider for source */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
            <span className="text-slate-300">Source word repetitions:</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onUpdateSettings({ sourceRepeats: num })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    (settings.sourceRepeats || 2) === num
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {num}x {num === 2 ? '(Ideal)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Target Language Voice Settings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTargetLang.flag}</span>
              <div>
                <h3 className="font-bold text-white text-base">
                  {currentTargetLang.name} Voice
                </h3>
                <span className="text-[11px] text-amber-400">
                  Repeats: {settings.targetRepeats || 1}x in sequence
                </span>
              </div>
            </div>

            <button
              onClick={handleTestTarget}
              disabled={testingTarget}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {testingTarget ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              <span>Preview Voice</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pl-1">
            {currentTargetLang.voices.map((voice) => {
              const isSelected =
                (settings.targetVoice || currentTargetLang.defaultVoice) === voice.id;
              return (
                <div
                  key={voice.id}
                  onClick={() =>
                    onUpdateSettings({
                      targetVoice: voice.id,
                      arGeminiVoice: voice.id,
                    })
                  }
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio
                        className={`w-4 h-4 ${
                          isSelected ? 'text-amber-400' : 'text-slate-600'
                        }`}
                      />
                      <span className="text-xs font-bold text-white">{voice.name}</span>
                    </div>
                    {voice.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                        {voice.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 ml-6">
                    {voice.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Repeat count slider for target */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
            <span className="text-slate-300">Target translation repetitions:</span>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onUpdateSettings({ targetRepeats: num })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    (settings.targetRepeats ?? 1) === num
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {num === 0 ? 'Mute' : `${num}x`} {num === 1 ? '(Ideal)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pauses and Delays */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              Precision Audio Timing & Silent Intervals (Milliseconds)
            </h3>
          </div>
          <button
            onClick={handleResetTimings}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Pause between source repetitions */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Between 1st & 2nd Repetition:</span>
              <span className="text-indigo-400 font-mono">
                {settings.pauseBetweenSource ?? 600} ms
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              step="50"
              value={settings.pauseBetweenSource ?? 600}
              onChange={(e) =>
                onUpdateSettings({
                  pauseBetweenSource: Number(e.target.value),
                  pauseBetweenEn: Number(e.target.value),
                })
              }
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Short pause between hearing the word the first time and the second repeat
            </p>
          </div>

          {/* Pause between source and target */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Between Word & Translation:</span>
              <span className="text-amber-400 font-mono">
                {settings.pauseBetweenLanguages ?? 800} ms
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="2000"
              step="50"
              value={settings.pauseBetweenLanguages ?? 800}
              onChange={(e) =>
                onUpdateSettings({
                  pauseBetweenLanguages: Number(e.target.value),
                  pauseBetweenEnAndAr: Number(e.target.value),
                })
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Allows your brain to recall meaning before hearing the translation
            </p>
          </div>

          {/* Pause between vocabulary items */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Before Next Word in Queue:</span>
              <span className="text-emerald-400 font-mono">
                {settings.pauseBetweenWords ?? 1400} ms
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="3500"
              step="100"
              value={settings.pauseBetweenWords ?? 1400}
              onChange={(e) =>
                onUpdateSettings({ pauseBetweenWords: Number(e.target.value) })
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Comfortable breath to shadow and repeat pronunciation aloud
            </p>
          </div>

          {/* Cloud API & Hosting Settings (Vercel / Standalone) */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Cloud Server Endpoint:</span>
              <span className="text-indigo-400 font-mono text-xs">Vercel &amp; Express Ready</span>
            </div>
            <input
              type="text"
              placeholder="Default: /api (Leave blank for automatic Vercel serverless functions)"
              defaultValue={localStorage.getItem('vocabflow_backend_url') || ''}
              onChange={(e) => {
                const val = e.target.value.trim();
                if (val) {
                  localStorage.setItem('vocabflow_backend_url', val);
                } else {
                  localStorage.removeItem('vocabflow_backend_url');
                }
              }}
              className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
            <p className="text-[10px] text-slate-500">
              Deploy to Vercel with built-in serverless functions in <code>/api</code>, or specify your backend URL if hosted elsewhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
