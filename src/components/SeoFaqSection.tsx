import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Volume2, Headphones, Download, Globe, ShieldCheck, Zap, BookOpen } from 'lucide-react';

interface SeoFaqSectionProps {
  theme?: 'dark' | 'light';
}

export const SeoFaqSection: React.FC<SeoFaqSectionProps> = ({ theme = 'dark' }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isLight = theme === 'light';

  const faqs = [
    {
      qEn: 'How to translate words and convert them into downloadable MP3 audio files?',
      qAr: 'كيف تترجم الكلمات والنصوص وتحولها إلى ملفات MP3 صوتية قابلة للتحميل؟',
      aEn: 'Simply type or paste your text into the translation box or bulk word importer. Choose your source and target languages (supporting 140+ world languages), configure your desired voice and repetition rules (e.g., 2x Source + 1x Target), and click "Download MP3". The workstation renders pure, high-fidelity MP3 files directly for offline study on mobile, car, or desktop.',
      aAr: 'اكتب أو الصق النص أو قائمة الكلمات في مربع الإدخال أو نافذة الاستيراد الجماعي. اختر لغة المصدر والهدف (يدعم أكثر من 140 لغة عالمية)، وحدد قواعد تكرار النطق (مثل نطق الكلمة مرتين والترجمة مرة واحدة)، ثم اضغط على زر "تحميل MP3". يقوم النظام بتوليد ملفات MP3 استوديو نقية مباشرة للاستماع أثناء القيادة أو في الهاتف دون إنترنت.'
    },
    {
      qEn: 'Can I download audio for large vocabulary lists (up to 10,000 words)?',
      qAr: 'هل يمكنني تنزيل ملفات صوتية لقوائم كلمات ضخمة تصل إلى 10,000 كلمة؟',
      aEn: 'Yes! The platform features an intelligent auto-partitioning engine that splits large vocabulary collections into manageable 100-word audio chapters. You can download individual parts or trigger an automated sequential batch download with one click.',
      aAr: 'نعم بالتأكيد! تم تزويد المنصة بنظام تقسيم ذكي يفرز القوائم الطويلة تلقائياً إلى أجزاء صوتية سهلة التحميل بواقع 100 كلمة لكل جزء، مع إمكانية تحميل أي جزء منفصلاً أو تنزيل جميع الأجزاء دفعة واحدة بنقرة زر.'
    },
    {
      qEn: 'What is the Auditory Dual-Repetition memorization technique?',
      qAr: 'ما هي تقنية التكرار المزدوج الصوتي لحفظ وإتقان المفردات؟',
      aEn: 'Cognitive linguistic research demonstrates that hearing a foreign word twice followed by its translation once (2x Source + 1x Target, or 1x Source + 2x Target) dramatically strengthens neural auditory memory paths, accelerating subconscious language acquisition without manual rote drilling.',
      aAr: 'تثبت أبحاث الذاكرة السمعية واللغويات أن الاستماع للكلمة الأصلية مرتين تليها الترجمة مرة واحدة (أو العكس) يرسخ مخارج الحروف ومعنى الكلمة في الذاكرة طويلة المدى، مما يساعد المتعلمين على الحفظ السريع دون مجهود مضاعف.'
    },
    {
      qEn: 'Is this translator and MP3 audio converter completely free?',
      qAr: 'هل خدمة الترجمة وتحويل النصوص إلى ملفات صوتية مجانية تماماً؟',
      aEn: 'Yes, 100% free with lifetime unlimited access. No subscription fees, no credit card required, and no hidden trial restrictions. Supported across all desktop browsers, Android, iOS, and as a Google Chrome Extension.',
      aAr: 'نعم، الخدمة مجانية 100% مدى الحياة بدون أي اشتراكات أو بطاقات ائتمان أو قيود على عدد الكلمات. تعمل بسلاسة على كافة متصفحات الكمبيوتر والهواتف الذكية وتتوفر أيضاً كإضافة لمتصفح جوجل كروم.'
    },
    {
      qEn: 'Which world languages and natural voices are supported?',
      qAr: 'ما هي اللغات العالمية والأصوات الطبيعية المدعومة؟',
      aEn: 'We support over 140 world languages including English, Arabic, Spanish, French, German, Turkish, Italian, Russian, Japanese, Chinese, Indonesian, and Hindi, featuring diverse neural male and female studio accents tailored for natural cadence.',
      aAr: 'ندعم أكثر من 140 لغة عالمية تشمل العربية، الإنجليزية، الإسبانية، الفرنسية، الألمانية، التركية، الروسية، الصينية، اليابانية، الإندونيسية، وغيرها، مع توفير أصوات استوديو ذكورية وأنثوية بأعلى جودة مخارج حروف.'
    }
  ];

  return (
    <section 
      aria-label="SEO & Platform Information"
      className={`mt-16 pt-12 border-t ${
        isLight ? 'border-slate-200 bg-white/70' : 'border-slate-800/80 bg-slate-900/40'
      } rounded-3xl p-6 sm:p-10 transition-colors`}
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SEO &amp; Comprehensive Translation Guide</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Translate Words, Texts &amp; Convert to MP3
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          The definitive multilingual translation workstation and neural speech audio generator. Built for students, translators, polyglots, and language learners worldwide.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className={`text-base font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            140+ Global Languages
          </h3>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Translate single words, idioms, sentences, or paragraphs with instant bi-directional switching across all international languages.
          </p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
            <Download className="w-5 h-5" />
          </div>
          <h3 className={`text-base font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Pure MP3 Audio Downloads
          </h3>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Direct-to-disk MP3 audio encoding. Seamlessly listen offline during workouts, daily commutes, or travel without requiring active internet.
          </p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
            <Headphones className="w-5 h-5" />
          </div>
          <h3 className={`text-base font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Auditory Spaced Repetition
          </h3>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Master pronunciation through scientifically proven rhythm loops (2x original + 1x translation) designed for maximum vocabulary retention.
          </p>
        </div>
      </div>

      {/* Accordion FAQ Section (Google Rich Result Targeted) */}
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="text-center mb-6">
          <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Frequently Asked Questions &amp; Search Guide
          </h3>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} mt-1`}>
            Everything you need to know about translating and downloading audio files
          </p>
        </div>

        {faqs.map((faq, index) => {
          const isOpen = openFaq === index;
          return (
            <div
              key={index}
              className={`rounded-xl border transition-all overflow-hidden ${
                isLight
                  ? isOpen ? 'bg-white border-amber-400 shadow-sm' : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                  : isOpen ? 'bg-slate-900/90 border-amber-500/40 shadow-sm shadow-amber-500/5' : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-900/40'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : index)}
                className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="space-y-0.5">
                  <span className={`text-sm font-semibold block ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {faq.qEn}
                  </span>
                  <span className={`text-xs block ${isLight ? 'text-amber-700 font-medium' : 'text-amber-400/90'}`} dir="rtl">
                    {faq.qAr}
                  </span>
                </div>
                <div className={`p-1.5 rounded-lg shrink-0 ${isLight ? 'bg-slate-200/60 text-slate-700' : 'bg-slate-800 text-slate-300'}`}>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className={`px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t ${
                  isLight ? 'border-slate-100 text-slate-600' : 'border-slate-800/50 text-slate-300'
                } space-y-3`}>
                  <p>{faq.aEn}</p>
                  <p className={`${isLight ? 'text-slate-700 bg-slate-100/70' : 'text-slate-200 bg-slate-950/60'} p-3 rounded-lg border ${isLight ? 'border-slate-200' : 'border-slate-800/60'}`} dir="rtl">
                    {faq.aAr}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* High-Intent Keyword Cloud for Search Indexers & Crawlers */}
      <div className="max-w-4xl mx-auto mt-10 pt-6 border-t border-slate-800/40 text-center">
        <p className={`text-[11px] uppercase tracking-wider font-semibold mb-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Popular Search Topics &amp; Language Keywords
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 text-[11px]">
          {[
            'Translate to MP3', 'Google Translate Audio Downloader', 'Text to Speech Converter Free',
            'English to Arabic Voice Translation', 'Spanish to English Pronunciation', 'Memorize Words Audio Loop',
            'تحميل نطق الترجمة mp3', 'مترجم الكلمات والنصوص', 'تحويل الكلام الى صوت', 'Learn English Vocabulary Audio',
            '100 Words Audio Splitter', 'Studio Neural TTS', 'Flashcards Audio Player', 'Chrome Extension Translator'
          ].map((tag, i) => (
            <span
              key={i}
              className={`px-2.5 py-1 rounded-md border ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
