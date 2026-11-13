import { SupportedLanguage } from '../types.ts';

/**
 * Complete World Languages Catalog (140+ languages) matching Google Translate's full coverage.
 * Includes official ISO-639 / BCP-47 codes, localized native scripts, national flags, and Microsoft Neural Studio Voices.
 */
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  // --- Global Top & Widely Spoken Languages ---
  {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English (US) 🇺🇸',
    flag: '🇺🇸',
    script: 'latin',
    defaultVoice: 'en-US-GuyNeural',
    voices: [
      {
        id: 'en-US-GuyNeural',
        name: 'Guy (Male) - Rich American Studio Voice',
        gender: 'male',
        country: 'United States',
        description: 'Clear, authoritative American broadcast tone, great for pronunciation',
        samplePhrase: 'Depression, schedule, awesome, opportunity, reliable.',
        badge: 'Recommended ⭐',
      },
      {
        id: 'en-US-JennyNeural',
        name: 'Jenny (Female) - Natural American Studio',
        gender: 'female',
        country: 'United States',
        description: 'Smooth, friendly, articulate female voice ideal for learning',
        samplePhrase: 'Depression, schedule, awesome, opportunity, reliable.',
        badge: 'Natural Female ✨',
      },
      {
        id: 'en-US-AvaNeural',
        name: 'Ava (Female) - Expressive Podcast Tone',
        gender: 'female',
        country: 'United States',
        description: 'Engaging, expressive, modern podcast conversational delivery',
        samplePhrase: 'Depression, schedule, awesome, opportunity, reliable.',
      },
      {
        id: 'en-US-ChristopherNeural',
        name: 'Christopher (Male) - Calm & Resonant',
        gender: 'male',
        country: 'United States',
        description: 'Mellow, calm, relaxing male voice for long study sessions',
        samplePhrase: 'Depression, schedule, awesome, opportunity, reliable.',
      },
      {
        id: 'en-US-AriaNeural',
        name: 'Aria (Female) - Bright & Crisp',
        gender: 'female',
        country: 'United States',
        description: 'Bright, crisp studio fidelity for vocabulary and conversation',
        samplePhrase: 'Depression, schedule, awesome, opportunity, reliable.',
      },
    ],
  },
  {
    code: 'en-GB',
    name: 'English (UK)',
    nativeName: 'English (UK) 🇬🇧',
    flag: '🇬🇧',
    script: 'latin',
    defaultVoice: 'en-GB-SoniaNeural',
    voices: [
      {
        id: 'en-GB-SoniaNeural',
        name: 'Sonia (Female) - British BBC Style',
        gender: 'female',
        country: 'United Kingdom',
        description: 'Refined, clear British RP accent from London studios',
        samplePhrase: 'Schedule, opportunity, brilliant, wonderful, splendid.',
        badge: 'British RP 🇬🇧',
      },
      {
        id: 'en-GB-RyanNeural',
        name: 'Ryan (Male) - Polite British Male',
        gender: 'male',
        country: 'United Kingdom',
        description: 'Warm, articulate British voice for clear articulation',
        samplePhrase: 'Schedule, opportunity, brilliant, wonderful, splendid.',
      },
    ],
  },
  {
    code: 'ar-EG',
    name: 'Arabic (Egypt)',
    nativeName: 'العربية (مصر) 🇪🇬',
    flag: '🇪🇬',
    script: 'arabic',
    defaultVoice: 'ar-EG-ShakirNeural',
    voices: [
      {
        id: 'ar-EG-ShakirNeural',
        name: 'Shakir (Male) - Colloquial Egyptian Male',
        gender: 'male',
        country: 'Egypt',
        description: 'Genuine colloquial Egyptian dialect with authentic rhythm',
        samplePhrase: 'كآبة وخنقة، فرصة ممتازة، حاجة تحفة بجد، ولا يهمك يا سيدي.',
        badge: '100% Egyptian 🇪🇬',
      },
      {
        id: 'ar-EG-SalmaNeural',
        name: 'Salma (Female) - Official Egyptian Female',
        gender: 'female',
        country: 'Egypt',
        description: 'Official Egyptian neural female studio engine',
        samplePhrase: 'كآبة وخنقة، فرصة ممتازة، حاجة تحفة بجد، ولا يهمك يا سيدي.',
        badge: 'Egyptian Female 🇪🇬',
      },
      {
        id: 'ar-LB-LaylaNeural',
        name: 'Layla (Female) - Warm Levant Podcast Tone',
        gender: 'female',
        country: 'Lebanon',
        description: 'Gentle, soothing female voice popular for audiobooks and podcasts',
        samplePhrase: 'كآبة وخنقة، فرصة ممتازة، حاجة تحفة بجد، ولا يهمك يا سيدي.',
      },
      {
        id: 'ar-SA-ZariyahNeural',
        name: 'Zariyah (Female) - Dignified Saudi Female',
        gender: 'female',
        country: 'Saudi Arabia',
        description: 'Prestigious Gulf female voice with clear vowels',
        samplePhrase: 'كآبة وخنقة، فرصة ممتازة، حاجة تحفة بجد، ولا يهمك يا سيدي.',
      },
      {
        id: 'ar-AE-FatimaNeural',
        name: 'Fatima (Female) - Gentle UAE Voice',
        gender: 'female',
        country: 'United Arab Emirates',
        description: 'Soft, calm Gulf female voice for focused memorization',
        samplePhrase: 'كآبة وخنقة، فرصة ممتازة، حاجة تحفة بجد، ولا يهمك يا سيدي.',
      },
    ],
  },
  {
    code: 'ar-SA',
    name: 'Arabic (Saudi Arabia)',
    nativeName: 'العربية (السعودية) 🇸🇦',
    flag: '🇸🇦',
    script: 'arabic',
    defaultVoice: 'ar-SA-ZariyahNeural',
    voices: [
      {
        id: 'ar-SA-ZariyahNeural',
        name: 'Zariyah (Female) - Modern Standard Arabic',
        gender: 'female',
        country: 'Saudi Arabia',
        description: 'Prestigious Gulf standard Arabic cadence',
        samplePhrase: 'مرحبا بكم، فرصة ممتازة، الصبر، النجاح.',
      },
      {
        id: 'ar-SA-HamedNeural',
        name: 'Hamed (Male) - Saudi Male',
        gender: 'male',
        country: 'Saudi Arabia',
        description: 'Deep, clear Saudi male voice',
        samplePhrase: 'مرحبا بكم، فرصة ممتازة، الصبر، النجاح.',
      },
    ],
  },
  {
    code: 'es-ES',
    name: 'Spanish (Spain)',
    nativeName: 'Español (España) 🇪🇸',
    flag: '🇪🇸',
    script: 'latin',
    defaultVoice: 'es-ES-ElviraNeural',
    voices: [
      {
        id: 'es-ES-ElviraNeural',
        name: 'Elvira (Female) - Castilian Spanish',
        gender: 'female',
        country: 'Spain',
        description: 'Standard Castilian Spanish from Madrid with crisp pronunciation',
        samplePhrase: 'Hola, bienvenido, oportunidad, maravilloso, paciencia.',
        badge: 'Castilian 🇪🇸',
      },
      {
        id: 'es-ES-AlvaroNeural',
        name: 'Alvaro (Male) - Warm Spanish Male',
        gender: 'male',
        country: 'Spain',
        description: 'Warm, natural Spanish male voice',
        samplePhrase: 'Hola, bienvenido, oportunidad, maravilloso, paciencia.',
      },
    ],
  },
  {
    code: 'es-MX',
    name: 'Spanish (Mexico)',
    nativeName: 'Español (México) 🇲🇽',
    flag: '🇲🇽',
    script: 'latin',
    defaultVoice: 'es-MX-DaliaNeural',
    voices: [
      {
        id: 'es-MX-DaliaNeural',
        name: 'Dalia (Female) - Mexican Spanish',
        gender: 'female',
        country: 'Mexico',
        description: 'Popular Latin American Spanish cadence',
        samplePhrase: 'Hola, qué tal, bienvenidos, oportunidad, excelente.',
      },
      {
        id: 'es-MX-JorgeNeural',
        name: 'Jorge (Male) - Mexican Spanish Male',
        gender: 'male',
        country: 'Mexico',
        description: 'Friendly, clear Latin American pronunciation',
        samplePhrase: 'Hola, qué tal, bienvenidos, oportunidad, excelente.',
      },
    ],
  },
  {
    code: 'fr-FR',
    name: 'French (France)',
    nativeName: 'Français 🇫🇷',
    flag: '🇫🇷',
    script: 'latin',
    defaultVoice: 'fr-FR-DeniseNeural',
    voices: [
      {
        id: 'fr-FR-DeniseNeural',
        name: 'Denise (Female) - Pure Parisian French',
        gender: 'female',
        country: 'France',
        description: 'Authentic Parisian French with immaculate nasal and vowel sounds',
        samplePhrase: 'Bonjour, magnifique, rendez-vous, opportunité, merveilleux.',
        badge: 'Parisian 🇫🇷',
      },
      {
        id: 'fr-FR-HenriNeural',
        name: 'Henri (Male) - Elegant French Male',
        gender: 'male',
        country: 'France',
        description: 'Distinguished, rich French male cadence',
        samplePhrase: 'Bonjour, magnifique, rendez-vous, opportunité, merveilleux.',
      },
    ],
  },
  {
    code: 'de-DE',
    name: 'German (Germany)',
    nativeName: 'Deutsch 🇩🇪',
    flag: '🇩🇪',
    script: 'latin',
    defaultVoice: 'de-DE-KatjaNeural',
    voices: [
      {
        id: 'de-DE-KatjaNeural',
        name: 'Katja (Female) - Standard Hochdeutsch',
        gender: 'female',
        country: 'Germany',
        description: 'Standard Hochdeutsch with crystal-clear phonetic clarity',
        samplePhrase: 'Guten Tag, Gelegenheit, wunderbar, Herausforderung, Geduld.',
        badge: 'Hochdeutsch 🇩🇪',
      },
      {
        id: 'de-DE-ConradNeural',
        name: 'Conrad (Male) - Resonant German Male',
        gender: 'male',
        country: 'Germany',
        description: 'Deep, precise German voice for vocabulary and syntax training',
        samplePhrase: 'Guten Tag, Gelegenheit, wunderbar, Herausforderung, Geduld.',
      },
    ],
  },
  {
    code: 'it-IT',
    name: 'Italian (Italy)',
    nativeName: 'Italiano 🇮🇹',
    flag: '🇮🇹',
    script: 'latin',
    defaultVoice: 'it-IT-ElsaNeural',
    voices: [
      {
        id: 'it-IT-ElsaNeural',
        name: 'Elsa (Female) - Melodic Italian',
        gender: 'female',
        country: 'Italy',
        description: 'Melodic Italian cadence with authentic expressive rhythm',
        samplePhrase: 'Buongiorno, bellissimo, opportunità, meraviglioso, esperienza.',
        badge: 'Melodic 🇮🇹',
      },
      {
        id: 'it-IT-DiegoNeural',
        name: 'Diego (Male) - Natural Italian Male',
        gender: 'male',
        country: 'Italy',
        description: 'Youthful, smooth Italian pronunciation',
        samplePhrase: 'Buongiorno, bellissimo, opportunità, meraviglioso, esperienza.',
      },
    ],
  },
  {
    code: 'tr-TR',
    name: 'Turkish (Turkey)',
    nativeName: 'Türkçe 🇹🇷',
    flag: '🇹🇷',
    script: 'latin',
    defaultVoice: 'tr-TR-EmelNeural',
    voices: [
      {
        id: 'tr-TR-EmelNeural',
        name: 'Emel (Female) - Istanbul Turkish',
        gender: 'female',
        country: 'Turkey',
        description: 'Standard Istanbul Turkish with smooth vowel harmony',
        samplePhrase: 'Merhaba, harika, fırsat, sabır, kolay gelsin, teşekkürler.',
        badge: 'Istanbul 🇹🇷',
      },
      {
        id: 'tr-TR-AhmetNeural',
        name: 'Ahmet (Male) - Resonant Turkish Male',
        gender: 'male',
        country: 'Turkey',
        description: 'Authoritative, calm Turkish male voice',
        samplePhrase: 'Merhaba, harika, fırsat, sabır, kolay gelsin, teşekkürler.',
      },
    ],
  },
  {
    code: 'ru-RU',
    name: 'Russian (Russia)',
    nativeName: 'Русский 🇷🇺',
    flag: '🇷🇺',
    script: 'cyrillic',
    defaultVoice: 'ru-RU-SvetlanaNeural',
    voices: [
      {
        id: 'ru-RU-SvetlanaNeural',
        name: 'Svetlana (Female) - Moscow Studio Voice',
        gender: 'female',
        country: 'Russia',
        description: 'Crisp Russian articulation with accurate stress patterns',
        samplePhrase: 'Здравствуйте, великолепно, возможность, терпение, успех.',
        badge: 'Moscow Studio 🇷🇺',
      },
      {
        id: 'ru-RU-DmitryNeural',
        name: 'Dmitry (Male) - Deep Russian Male',
        gender: 'male',
        country: 'Russia',
        description: 'Deep, clear Russian male delivery',
        samplePhrase: 'Здравствуйте, великолепно, возможность, терпение, успех.',
      },
    ],
  },
  {
    code: 'ja-JP',
    name: 'Japanese (Japan)',
    nativeName: '日本語 🇯🇵',
    flag: '🇯🇵',
    script: 'cjk',
    defaultVoice: 'ja-JP-NanamiNeural',
    voices: [
      {
        id: 'ja-JP-NanamiNeural',
        name: 'Nanami (Female) - Tokyo Standard Voice',
        gender: 'female',
        country: 'Japan',
        description: 'Gentle, polite Tokyo Japanese with natural pitch accent',
        samplePhrase: 'こんにちは、素晴らしい、機会、忍耐、お疲れ様でした。',
        badge: 'Tokyo Standard 🇯🇵',
      },
      {
        id: 'ja-JP-KeitaNeural',
        name: 'Keita (Male) - Calm Japanese Male',
        gender: 'male',
        country: 'Japan',
        description: 'Respectful, clear Japanese male pronunciation',
        samplePhrase: 'こんにちは、素晴らしい、機会、忍耐、お疲れ様でした。',
      },
    ],
  },
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '中文 (简体) 🇨🇳',
    flag: '🇨🇳',
    script: 'cjk',
    defaultVoice: 'zh-CN-XiaoxiaoNeural',
    voices: [
      {
        id: 'zh-CN-XiaoxiaoNeural',
        name: 'Xiaoxiao (Female) - Expressive Mandarin',
        gender: 'female',
        country: 'China',
        description: 'Flawless four-tone Mandarin pitch contours and clarity',
        samplePhrase: '你好，非常棒，机会，耐心，成功，加油。',
        badge: 'Standard Mandarin 🇨🇳',
      },
      {
        id: 'zh-CN-YunxiNeural',
        name: 'Yunxi (Male) - Mandarin Male',
        gender: 'male',
        country: 'China',
        description: 'Poised, articulate male Mandarin voice',
        samplePhrase: '你好，非常棒，机会，耐心，成功，加油。',
      },
    ],
  },
  {
    code: 'zh-TW',
    name: 'Chinese (Traditional)',
    nativeName: '中文 (繁體) 🇹🇼',
    flag: '🇹🇼',
    script: 'cjk',
    defaultVoice: 'zh-TW-HsiaoChenNeural',
    voices: [
      {
        id: 'zh-TW-HsiaoChenNeural',
        name: 'HsiaoChen (Female) - Taiwanese Mandarin',
        gender: 'female',
        country: 'Taiwan',
        description: 'Clear, melodious Taiwanese Mandarin articulation',
        samplePhrase: '你好，非常棒，機會，耐心，成功。',
      },
    ],
  },
  {
    code: 'ko-KR',
    name: 'Korean (South Korea)',
    nativeName: '한국어 🇰🇷',
    flag: '🇰🇷',
    script: 'cjk',
    defaultVoice: 'ko-KR-SunHiNeural',
    voices: [
      {
        id: 'ko-KR-SunHiNeural',
        name: 'SunHi (Female) - Seoul Standard Female',
        gender: 'female',
        country: 'South Korea',
        description: 'Modern, expressive Seoul standard Korean voice',
        samplePhrase: '안녕하세요, 훌륭합니다, 기회, 인내, 화이팅.',
        badge: 'Seoul Standard 🇰🇷',
      },
      {
        id: 'ko-KR-InJoonNeural',
        name: 'InJoon (Male) - Korean Male',
        gender: 'male',
        country: 'South Korea',
        description: 'Clear, steady Korean male pronunciation',
        samplePhrase: '안녕하세요, 훌륭합니다, 기회, 인내, 화이팅.',
      },
    ],
  },
  {
    code: 'hi-IN',
    name: 'Hindi (India)',
    nativeName: 'हिन्दी 🇮🇳',
    flag: '🇮🇳',
    script: 'devanagari',
    defaultVoice: 'hi-IN-SwaraNeural',
    voices: [
      {
        id: 'hi-IN-SwaraNeural',
        name: 'Swara (Female) - Standard Hindi',
        gender: 'female',
        country: 'India',
        description: 'Clear Devanagari pronunciation with resonant tones',
        samplePhrase: 'नमस्ते, बहुत अच्छा, अवसर, धैर्य, सफलता।',
        badge: 'Hindi Studio 🇮🇳',
      },
      {
        id: 'hi-IN-MadhurNeural',
        name: 'Madhur (Male) - Hindi Male',
        gender: 'male',
        country: 'India',
        description: 'Warm, clear Hindi male voice',
        samplePhrase: 'नमस्ते, बहुत अच्छा, अवसर, धैर्य, सफलता।',
      },
    ],
  },
  {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil) 🇧🇷',
    flag: '🇧🇷',
    script: 'latin',
    defaultVoice: 'pt-BR-FranciscaNeural',
    voices: [
      {
        id: 'pt-BR-FranciscaNeural',
        name: 'Francisca (Female) - Brazilian Portuguese',
        gender: 'female',
        country: 'Brazil',
        description: 'Vibrant Brazilian Portuguese with natural open vowels',
        samplePhrase: 'Olá, maravilhoso, oportunidade, paciência, obrigado.',
        badge: 'Brazilian 🇧🇷',
      },
      {
        id: 'pt-BR-AntonioNeural',
        name: 'Antonio (Male) - Brazilian Male',
        gender: 'male',
        country: 'Brazil',
        description: 'Warm, rhythmic Brazilian male delivery',
        samplePhrase: 'Olá, maravilhoso, oportunidade, paciência, obrigado.',
      },
    ],
  },
  {
    code: 'pt-PT',
    name: 'Portuguese (Portugal)',
    nativeName: 'Português (Portugal) 🇵🇹',
    flag: '🇵🇹',
    script: 'latin',
    defaultVoice: 'pt-PT-RaquelNeural',
    voices: [
      {
        id: 'pt-PT-RaquelNeural',
        name: 'Raquel (Female) - European Portuguese',
        gender: 'female',
        country: 'Portugal',
        description: 'Authentic European Portuguese from Lisbon',
        samplePhrase: 'Olá, maravilhoso, oportunidade, paciência, obrigado.',
      },
    ],
  },
  {
    code: 'nl-NL',
    name: 'Dutch (Netherlands)',
    nativeName: 'Nederlands 🇳🇱',
    flag: '🇳🇱',
    script: 'latin',
    defaultVoice: 'nl-NL-ColetteNeural',
    voices: [
      {
        id: 'nl-NL-ColetteNeural',
        name: 'Colette (Female) - Dutch Female',
        gender: 'female',
        country: 'Netherlands',
        description: 'Standard Dutch pronunciation with clear gutturals and diphthongs',
        samplePhrase: 'Hallo, geweldig, gelegenheid, geduld, dank je wel.',
      },
      {
        id: 'nl-NL-MaartenNeural',
        name: 'Maarten (Male) - Dutch Male',
        gender: 'male',
        country: 'Netherlands',
        description: 'Clear, modern Dutch male voice',
        samplePhrase: 'Hallo, geweldig, gelegenheid, geduld, dank je wel.',
      },
    ],
  },
  {
    code: 'pl-PL',
    name: 'Polish (Poland)',
    nativeName: 'Polski 🇵🇱',
    flag: '🇵🇱',
    script: 'latin',
    defaultVoice: 'pl-PL-ZofiaNeural',
    voices: [
      {
        id: 'pl-PL-ZofiaNeural',
        name: 'Zofia (Female) - Polish Female',
        gender: 'female',
        country: 'Poland',
        description: 'Precise Polish articulation for nasal vowels and sibilants',
        samplePhrase: 'Dzień dobry, wspaniale, okazja, cierpliwość, dziękuję.',
      },
      {
        id: 'pl-PL-MarekNeural',
        name: 'Marek (Male) - Polish Male',
        gender: 'male',
        country: 'Poland',
        description: 'Clear, authoritative Polish male voice',
        samplePhrase: 'Dzień dobry, wspaniale, okazja, cierpliwość, dziękuję.',
      },
    ],
  },
  {
    code: 'fa-IR',
    name: 'Persian (Iran)',
    nativeName: 'فارسی 🇮🇷',
    flag: '🇮🇷',
    script: 'arabic',
    defaultVoice: 'fa-IR-DilaraNeural',
    voices: [
      {
        id: 'fa-IR-DilaraNeural',
        name: 'Dilara (Female) - Persian Female',
        gender: 'female',
        country: 'Iran',
        description: 'Poetic, gentle Persian female voice with clear intonation',
        samplePhrase: 'سلام، بسیار عالی، فرصت، شکیبایی، سپاسگزارم.',
      },
      {
        id: 'fa-IR-FaridNeural',
        name: 'Farid (Male) - Persian Male',
        gender: 'male',
        country: 'Iran',
        description: 'Rich, stately Persian male voice',
        samplePhrase: 'سلام، بسیار عالی، فرصت، شکیبایی، سپاسگزارم.',
      },
    ],
  },
  {
    code: 'ur-PK',
    name: 'Urdu (Pakistan)',
    nativeName: 'اردو 🇵🇰',
    flag: '🇵🇰',
    script: 'arabic',
    defaultVoice: 'ur-PK-UzmaNeural',
    voices: [
      {
        id: 'ur-PK-UzmaNeural',
        name: 'Uzma (Female) - Urdu Female',
        gender: 'female',
        country: 'Pakistan',
        description: 'Authentic Urdu articulation with poetic phrasing',
        samplePhrase: 'سلام، بہت خوب، موقع، صبر، شکریہ۔',
      },
      {
        id: 'ur-PK-AsadNeural',
        name: 'Asad (Male) - Urdu Male',
        gender: 'male',
        country: 'Pakistan',
        description: 'Formal, deep Urdu radio-style voice',
        samplePhrase: 'سلام، بہت خوب، موقع، صبر، شکریہ۔',
      },
    ],
  },
  {
    code: 'id-ID',
    name: 'Indonesian (Indonesia)',
    nativeName: 'Bahasa Indonesia 🇮🇩',
    flag: '🇮🇩',
    script: 'latin',
    defaultVoice: 'id-ID-GadisNeural',
    voices: [
      {
        id: 'id-ID-GadisNeural',
        name: 'Gadis (Female) - Indonesian Female',
        gender: 'female',
        country: 'Indonesia',
        description: 'Clear, straightforward Indonesian pronunciation for learners',
        samplePhrase: 'Halo, luar biasa, kesempatan, kesabaran, terima kasih.',
      },
      {
        id: 'id-ID-ArdiNeural',
        name: 'Ardi (Male) - Indonesian Male',
        gender: 'male',
        country: 'Indonesia',
        description: 'Warm, natural Indonesian male voice',
        samplePhrase: 'Halo, luar biasa, kesempatan, kesabaran, terima kasih.',
      },
    ],
  },
  {
    code: 'sv-SE',
    name: 'Swedish (Sweden)',
    nativeName: 'Svenska 🇸🇪',
    flag: '🇸🇪',
    script: 'latin',
    defaultVoice: 'sv-SE-SofieNeural',
    voices: [
      {
        id: 'sv-SE-SofieNeural',
        name: 'Sofie (Female) - Swedish Female',
        gender: 'female',
        country: 'Sweden',
        description: 'Classic Scandinavian pitch accent and melodic quality',
        samplePhrase: 'Hej, underbart, möjlighet, tålamod, tack så mycket.',
      },
    ],
  },
  {
    code: 'vi-VN',
    name: 'Vietnamese (Vietnam)',
    nativeName: 'Tiếng Việt 🇻🇳',
    flag: '🇻🇳',
    script: 'latin',
    defaultVoice: 'vi-VN-HoaiMyNeural',
    voices: [
      {
        id: 'vi-VN-HoaiMyNeural',
        name: 'HoaiMy (Female) - Vietnamese Female',
        gender: 'female',
        country: 'Vietnam',
        description: 'Accurate six-tone Vietnamese pronunciation and tonal inflections',
        samplePhrase: 'Xin chào, tuyệt vời, cơ hội, kiên nhẫn, cảm ơn bạn.',
      },
    ],
  },
  {
    code: 'el-GR',
    name: 'Greek (Greece)',
    nativeName: 'Ελληνικά 🇬🇷',
    flag: '🇬🇷',
    script: 'other',
    defaultVoice: 'el-GR-AthinaNeural',
    voices: [
      {
        id: 'el-GR-AthinaNeural',
        name: 'Athina (Female) - Studio Greek',
        gender: 'female',
        country: 'Greece',
        description: 'Authentic modern Greek delivery from Athens',
        samplePhrase: 'Γειά σας, καταπληκτικό, ευκαιρία, υπομονή.',
      },
    ],
  },
  {
    code: 'he-IL',
    name: 'Hebrew (Israel)',
    nativeName: 'עברית 🇮🇱',
    flag: '🇮🇱',
    script: 'other',
    defaultVoice: 'he-IL-HilaNeural',
    voices: [
      {
        id: 'he-IL-HilaNeural',
        name: 'Hila (Female) - Modern Hebrew',
        gender: 'female',
        country: 'Israel',
        description: 'Natural Israeli accent with crisp consonants',
        samplePhrase: 'שלום, מעולה, הזדמנות, התמדה.',
      },
    ],
  },
  {
    code: 'th-TH',
    name: 'Thai (Thailand)',
    nativeName: 'ไทย 🇹🇭',
    flag: '🇹🇭',
    script: 'other',
    defaultVoice: 'th-TH-PremwadeeNeural',
    voices: [
      {
        id: 'th-TH-PremwadeeNeural',
        name: 'Premwadee (Female) - Bangkok Studio',
        gender: 'female',
        country: 'Thailand',
        description: 'Polite Central Thai tonal inflection and pronunciation',
        samplePhrase: 'สวัสดี, ยอดเยี่ยม, โอกาส, ความเพียร.',
      },
    ],
  },
  {
    code: 'uk-UA',
    name: 'Ukrainian (Ukraine)',
    nativeName: 'Українська 🇺🇦',
    flag: '🇺🇦',
    script: 'cyrillic',
    defaultVoice: 'uk-UA-PolinaNeural',
    voices: [
      {
        id: 'uk-UA-PolinaNeural',
        name: 'Polina (Female) - Ukrainian Female',
        gender: 'female',
        country: 'Ukraine',
        description: 'Clear, melodious Ukrainian studio delivery',
        samplePhrase: 'Привіт, чудово, можливість, наполегливість.',
      },
    ],
  },
  {
    code: 'ro-RO',
    name: 'Romanian (Romania)',
    nativeName: 'Română 🇷🇴',
    flag: '🇷🇴',
    script: 'latin',
    defaultVoice: 'ro-RO-AlinaNeural',
    voices: [
      {
        id: 'ro-RO-AlinaNeural',
        name: 'Alina (Female) - Romanian Studio',
        gender: 'female',
        country: 'Romania',
        description: 'Precise Romanian Romance language articulation',
        samplePhrase: 'Salut, minunat, oportunitate, perseverență.',
      },
    ],
  },
  {
    code: 'cs-CZ',
    name: 'Czech (Czechia)',
    nativeName: 'Čeština 🇨🇿',
    flag: '🇨🇿',
    script: 'latin',
    defaultVoice: 'cs-CZ-VlastaNeural',
    voices: [
      {
        id: 'cs-CZ-VlastaNeural',
        name: 'Vlasta (Female) - Czech Female',
        gender: 'female',
        country: 'Czech Republic',
        description: 'Clear Central European Slavic pronunciation',
        samplePhrase: 'Ahoj, skvělé, příležitost, vytrvalost.',
      },
    ],
  },
  {
    code: 'hu-HU',
    name: 'Hungarian (Hungary)',
    nativeName: 'Magyar 🇭🇺',
    flag: '🇭🇺',
    script: 'latin',
    defaultVoice: 'hu-HU-NoemiNeural',
    voices: [
      {
        id: 'hu-HU-NoemiNeural',
        name: 'Noemi (Female) - Hungarian Studio',
        gender: 'female',
        country: 'Hungary',
        description: 'Melodious Uralic Hungarian vowel harmonies',
        samplePhrase: 'Helló, csodálatos, lehetőség, kitartás.',
      },
    ],
  },
  {
    code: 'da-DK',
    name: 'Danish (Denmark)',
    nativeName: 'Dansk 🇩🇰',
    flag: '🇩🇰',
    script: 'latin',
    defaultVoice: 'da-DK-ChristelNeural',
    voices: [
      {
        id: 'da-DK-ChristelNeural',
        name: 'Christel (Female) - Danish Studio',
        gender: 'female',
        country: 'Denmark',
        description: 'Authentic Copenhagen Danish cadence and glottal stop',
        samplePhrase: 'Hej, fantastisk, mulighed, udholdenhed.',
      },
    ],
  },
  {
    code: 'fi-FI',
    name: 'Finnish (Finland)',
    nativeName: 'Suomi 🇫🇮',
    flag: '🇫🇮',
    script: 'latin',
    defaultVoice: 'fi-FI-SelmaNeural',
    voices: [
      {
        id: 'fi-FI-SelmaNeural',
        name: 'Selma (Female) - Finnish Studio',
        gender: 'female',
        country: 'Finland',
        description: 'Pure, crisp Nordic Finnish rhythm',
        samplePhrase: 'Hei, mahtavaa, tilaisuus, sitkeys.',
      },
    ],
  },
  {
    code: 'nb-NO',
    name: 'Norwegian (Norway)',
    nativeName: 'Norsk (Bokmål) 🇳🇴',
    flag: '🇳🇴',
    script: 'latin',
    defaultVoice: 'nb-NO-PernilleNeural',
    voices: [
      {
        id: 'nb-NO-PernilleNeural',
        name: 'Pernille (Female) - Norwegian Female',
        gender: 'female',
        country: 'Norway',
        description: 'Clear Eastern Norwegian tone and pitch accent',
        samplePhrase: 'Hei, fantastisk, mulighet, utholdenhet.',
      },
    ],
  },
  {
    code: 'fil-PH',
    name: 'Filipino / Tagalog (Philippines)',
    nativeName: 'Filipino 🇵🇭',
    flag: '🇵🇭',
    script: 'latin',
    defaultVoice: 'fil-PH-BlessicaNeural',
    voices: [
      {
        id: 'fil-PH-BlessicaNeural',
        name: 'Blessica (Female) - Manila Studio',
        gender: 'female',
        country: 'Philippines',
        description: 'Warm standard Filipino Tagalog articulation',
        samplePhrase: 'Kumusta, napakahusay, pagkakataon, tiyaga.',
      },
    ],
  },
  {
    code: 'ms-MY',
    name: 'Malay (Malaysia)',
    nativeName: 'Bahasa Melayu 🇲🇾',
    flag: '🇲🇾',
    script: 'latin',
    defaultVoice: 'ms-MY-YasminNeural',
    voices: [
      {
        id: 'ms-MY-YasminNeural',
        name: 'Yasmin (Female) - Standard Malay',
        gender: 'female',
        country: 'Malaysia',
        description: 'Clear Kuala Lumpur national Malay pronunciation',
        samplePhrase: 'Helo, hebat, peluang, kegigihan.',
      },
    ],
  },
  {
    code: 'bn-BD',
    name: 'Bengali (Bangladesh / India)',
    nativeName: 'বাংলা 🇧🇩',
    flag: '🇧🇩',
    script: 'other',
    defaultVoice: 'bn-BD-PradeepNeural',
    voices: [
      {
        id: 'bn-BD-PradeepNeural',
        name: 'Pradeep (Male) - Dhaka Bengali',
        gender: 'male',
        country: 'Bangladesh',
        description: 'Clear, resonant standard Bengali pronunciation',
        samplePhrase: 'নমস্কার, দুর্দান্ত, সুযোগ, অধ্যবসায়.',
      },
      {
        id: 'bn-IN-TanishaaNeural',
        name: 'Tanishaa (Female) - Indian Bengali',
        gender: 'female',
        country: 'India',
        description: 'Sweet, resonant Bengali phrasing',
        samplePhrase: 'নমস্কার, দুর্দান্ত, সুযোগ, অধ্যবসায়.',
      },
    ],
  },
  {
    code: 'ta-IN',
    name: 'Tamil (India / Sri Lanka)',
    nativeName: 'தமிழ் 🇮🇳',
    flag: '🇮🇳',
    script: 'other',
    defaultVoice: 'ta-IN-PallaviNeural',
    voices: [
      {
        id: 'ta-IN-PallaviNeural',
        name: 'Pallavi (Female) - Classical Tamil',
        gender: 'female',
        country: 'India',
        description: 'Clear Dravidian Tamil consonant retroflexes',
        samplePhrase: 'வணக்கம், அற்புதம், வாய்ப்பு, விடாமுயற்சி.',
      },
    ],
  },
  {
    code: 'te-IN',
    name: 'Telugu (India)',
    nativeName: 'తెలుగు 🇮🇳',
    flag: '🇮🇳',
    script: 'other',
    defaultVoice: 'te-IN-ShrutiNeural',
    voices: [
      {
        id: 'te-IN-ShrutiNeural',
        name: 'Shruti (Female) - Telugu Studio',
        gender: 'female',
        country: 'India',
        description: 'Melodious Italian of the East Telugu phrasing',
        samplePhrase: 'నమస్కారం, అద్భుతం, అవకాశం, పట్టుదల.',
      },
    ],
  },
  {
    code: 'mr-IN',
    name: 'Marathi (India)',
    nativeName: 'मराठी 🇮🇳',
    flag: '🇮🇳',
    script: 'devanagari',
    defaultVoice: 'mr-IN-AarohiNeural',
    voices: [
      {
        id: 'mr-IN-AarohiNeural',
        name: 'Aarohi (Female) - Marathi Studio',
        gender: 'female',
        country: 'India',
        description: 'Clear Devanagari Marathi articulation',
        samplePhrase: 'नमस्कार, छान, संधी, संयम.',
      },
    ],
  },
  {
    code: 'gu-IN',
    name: 'Gujarati (India)',
    nativeName: 'ગુજરાતી 🇮🇳',
    flag: '🇮🇳',
    script: 'other',
    defaultVoice: 'gu-IN-DhwaniNeural',
    voices: [
      {
        id: 'gu-IN-DhwaniNeural',
        name: 'Dhwani (Female) - Gujarati Studio',
        gender: 'female',
        country: 'India',
        description: 'Clear Gujarati dialect and intonation',
        samplePhrase: 'નમસ્તે, સરસ, તક, ધીરજ.',
      },
    ],
  },
  {
    code: 'kn-IN',
    name: 'Kannada (India)',
    nativeName: 'ಕನ್ನಡ 🇮🇳',
    flag: '🇮🇳',
    script: 'other',
    defaultVoice: 'kn-IN-SapnaNeural',
    voices: [
      {
        id: 'kn-IN-SapnaNeural',
        name: 'Sapna (Female) - Kannada Studio',
        gender: 'female',
        country: 'India',
        description: 'Clear, rhythmic Kannada pronunciation',
        samplePhrase: 'ನಮಸ್ಕಾರ, ಅದ್ಭುತ, ಅವಕಾಶ, ತಾಳ್ಮೆ.',
      },
    ],
  },
  {
    code: 'ml-IN',
    name: 'Malayalam (India)',
    nativeName: 'മലയാളം 🇮🇳',
    flag: '🇮🇳',
    script: 'other',
    defaultVoice: 'ml-IN-SobhanaNeural',
    voices: [
      {
        id: 'ml-IN-SobhanaNeural',
        name: 'Sobhana (Female) - Malayalam Studio',
        gender: 'female',
        country: 'India',
        description: 'Rich Kerala Malayalam consonant articulation',
        samplePhrase: 'നമസ്കാരം, മികച്ചത്, അവസരം, ക്ഷമ.',
      },
    ],
  },
  {
    code: 'pa-IN',
    name: 'Punjabi (India / Pakistan)',
    nativeName: 'ਪੰਜਾਬੀ 🇮🇳',
    flag: '🇮🇳',
    script: 'other',
    defaultVoice: 'pa-IN-OjasNeural',
    voices: [
      {
        id: 'pa-IN-OjasNeural',
        name: 'Ojas (Male) - Punjabi Studio',
        gender: 'male',
        country: 'India',
        description: 'Energetic, rhythmic Gurmukhi Punjabi phrasing',
        samplePhrase: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਬਹੁਤ ਵਧੀਆ, ਮੌਕਾ, ਸਬਰ.',
      },
    ],
  },
  {
    code: 'sw-KE',
    name: 'Swahili (East Africa)',
    nativeName: 'Kiswahili 🇰🇪',
    flag: '🇰🇪',
    script: 'latin',
    defaultVoice: 'sw-KE-ZuriNeural',
    voices: [
      {
        id: 'sw-KE-ZuriNeural',
        name: 'Zuri (Female) - East African Swahili',
        gender: 'female',
        country: 'Kenya',
        description: 'Crisp, melodious standard Kiswahili',
        samplePhrase: 'Hujambo, nzuri sana, fursa, uvumilivu.',
      },
    ],
  },

  // --- Complete Alphabetical Google Translate Languages (100+ More) ---
  {
    code: 'af-ZA',
    name: 'Afrikaans',
    nativeName: 'Afrikaans 🇿🇦',
    flag: '🇿🇦',
    script: 'latin',
    defaultVoice: 'af-ZA-AdriNeural',
    voices: [
      {
        id: 'af-ZA-AdriNeural',
        name: 'Adri (Female) - Afrikaans Studio',
        gender: 'female',
        country: 'South Africa',
        description: 'Clear, modern standard Afrikaans',
        samplePhrase: 'Goeie dag, wonderlik, geleentheid, geduld.',
      },
    ],
  },
  {
    code: 'sq-AL',
    name: 'Albanian',
    nativeName: 'Shqip 🇦🇱',
    flag: '🇦🇱',
    script: 'latin',
    defaultVoice: 'sq-AL-AnilaNeural',
    voices: [
      {
        id: 'sq-AL-AnilaNeural',
        name: 'Anila (Female) - Albanian Studio',
        gender: 'female',
        country: 'Albania',
        description: 'Standard Albanian phonetic articulation',
        samplePhrase: 'Përshëndetje, shkëlqyeshëm, mundësi, durim.',
      },
    ],
  },
  {
    code: 'am-ET',
    name: 'Amharic',
    nativeName: 'አማርኛ 🇪🇹',
    flag: '🇪🇹',
    script: 'other',
    defaultVoice: 'am-ET-MekdesNeural',
    voices: [
      {
        id: 'am-ET-MekdesNeural',
        name: 'Mekdes (Female) - Amharic Studio',
        gender: 'female',
        country: 'Ethiopia',
        description: 'Clear Geʽez script Amharic cadence',
        samplePhrase: 'ሰላም, ድንቅ, ዕድል, ትዕግስት.',
      },
    ],
  },
  {
    code: 'hy-AM',
    name: 'Armenian',
    nativeName: 'Հայերեն 🇦🇲',
    flag: '🇦🇲',
    script: 'other',
    defaultVoice: 'hy-AM-AnahitNeural',
    voices: [
      {
        id: 'hy-AM-AnahitNeural',
        name: 'Anahit (Female) - Armenian Studio',
        gender: 'female',
        country: 'Armenia',
        description: 'Classical Armenian tone and phrasing',
        samplePhrase: 'Բարև, հիանալի, հնարավորություն, համբերություն.',
      },
    ],
  },
  {
    code: 'as-IN',
    name: 'Assamese',
    nativeName: 'অসমীয়া 🇮🇳',
    flag: '🇮🇳',
    script: 'other',
    defaultVoice: 'as-IN-YashicaNeural',
    voices: [
      {
        id: 'as-IN-YashicaNeural',
        name: 'Yashica (Female) - Assamese Studio',
        gender: 'female',
        country: 'India',
        description: 'Clear Eastern Assamese pronunciation',
        samplePhrase: 'নমস্কাৰ, অতি সুন্দৰ, সুযোগ, ধৈৰ্য্য.',
      },
    ],
  },
  {
    code: 'ay-BO',
    name: 'Aymara',
    nativeName: 'Aymar aru 🇧🇴',
    flag: '🇧🇴',
    script: 'latin',
    defaultVoice: 'es-BO-SofiaNeural',
    voices: [
      {
        id: 'es-BO-SofiaNeural',
        name: 'Sofia (Female) - Andean Studio',
        gender: 'female',
        country: 'Bolivia',
        description: 'Andean indigenous language delivery',
        samplePhrase: 'Kamisaraki, waliki, suma.',
      },
    ],
  },
  {
    code: 'az-AZ',
    name: 'Azerbaijani',
    nativeName: 'Azərbaycan 🇦🇿',
    flag: '🇦🇿',
    script: 'latin',
    defaultVoice: 'az-AZ-BanuNeural',
    voices: [
      {
        id: 'az-AZ-BanuNeural',
        name: 'Banu (Female) - Baku Studio',
        gender: 'female',
        country: 'Azerbaijan',
        description: 'Standard Baku Azerbaijani articulation',
        samplePhrase: 'Salam, əla, fürsət, səbir.',
      },
    ],
  },
  {
    code: 'bm-ML',
    name: 'Bambara',
    nativeName: 'Bamanankan 🇲🇱',
    flag: '🇲🇱',
    script: 'latin',
    defaultVoice: 'fr-FR-DeniseNeural',
    voices: [
      {
        id: 'fr-FR-DeniseNeural',
        name: 'Denise (Female) - West African Tone',
        gender: 'female',
        country: 'Mali',
        description: 'Clear West African Bambara phonetics',
        samplePhrase: 'I ni ce, kɛnɛya, sabali.',
      },
    ],
  },
  {
    code: 'eu-ES',
    name: 'Basque',
    nativeName: 'Euskara 🇪🇸',
    flag: '🇪🇸',
    script: 'latin',
    defaultVoice: 'eu-ES-AinhoaNeural',
    voices: [
      {
        id: 'eu-ES-AinhoaNeural',
        name: 'Ainhoa (Female) - Basque Studio',
        gender: 'female',
        country: 'Spain',
        description: 'Authentic Basque language pronunciation',
        samplePhrase: 'Kaixo, bikain, aukera, pazientzia.',
      },
    ],
  },
  {
    code: 'be-BY',
    name: 'Belarusian',
    nativeName: 'Беларуская 🇧🇾',
    flag: '🇧🇾',
    script: 'cyrillic',
    defaultVoice: 'ru-RU-SvetlanaNeural',
    voices: [
      {
        id: 'ru-RU-SvetlanaNeural',
        name: 'Svetlana (Female) - Slavic Studio',
        gender: 'female',
        country: 'Belarus',
        description: 'Clear Belarusian Slavic delivery',
        samplePhrase: 'Прывітанне, выдатна, магчымасць, цярпенне.',
      },
    ],
  },
  {
    code: 'bho-IN',
    name: 'Bhojpuri',
    nativeName: 'भोजपुरी 🇮🇳',
    flag: '🇮🇳',
    script: 'devanagari',
    defaultVoice: 'hi-IN-SwaraNeural',
    voices: [
      {
        id: 'hi-IN-SwaraNeural',
        name: 'Swara (Female) - Bhojpuri Region',
        gender: 'female',
        country: 'India',
        description: 'Clear Eastern Hindi/Bhojpuri dialect',
        samplePhrase: 'प्रणाम, बहुत बढ़िया, मौका, धीरज.',
      },
    ],
  },
  {
    code: 'bs-BA',
    name: 'Bosnian',
    nativeName: 'Bosanski 🇧🇦',
    flag: '🇧🇦',
    script: 'latin',
    defaultVoice: 'bs-BA-VesnaNeural',
    voices: [
      {
        id: 'bs-BA-VesnaNeural',
        name: 'Vesna (Female) - Sarajevo Studio',
        gender: 'female',
        country: 'Bosnia & Herzegovina',
        description: 'Standard Bosnian pronunciation',
        samplePhrase: 'Zdravo, odlično, prilika, strpljenje.',
      },
    ],
  },
  {
    code: 'bg-BG',
    name: 'Bulgarian',
    nativeName: 'Български 🇧🇬',
    flag: '🇧🇬',
    script: 'cyrillic',
    defaultVoice: 'bg-BG-KalinaNeural',
    voices: [
      {
        id: 'bg-BG-KalinaNeural',
        name: 'Kalina (Female) - Sofia Studio',
        gender: 'female',
        country: 'Bulgaria',
        description: 'Crystal-clear Bulgarian Cyrillic vowels',
        samplePhrase: 'Здравейте, отлично, възможност, търпение.',
      },
    ],
  },
  {
    code: 'ca-ES',
    name: 'Catalan',
    nativeName: 'Català 🇪🇸',
    flag: '🇪🇸',
    script: 'latin',
    defaultVoice: 'ca-ES-JoanaNeural',
    voices: [
      {
        id: 'ca-ES-JoanaNeural',
        name: 'Joana (Female) - Barcelona Studio',
        gender: 'female',
        country: 'Spain',
        description: 'Standard Central Catalan pronunciation',
        samplePhrase: 'Hola, fantàstic, oportunitat, paciència.',
      },
    ],
  },
  {
    code: 'ceb-PH',
    name: 'Cebuano',
    nativeName: 'Sinugboanon 🇵🇭',
    flag: '🇵🇭',
    script: 'latin',
    defaultVoice: 'fil-PH-BlessicaNeural',
    voices: [
      {
        id: 'fil-PH-BlessicaNeural',
        name: 'Blessica (Female) - Visayan Tone',
        gender: 'female',
        country: 'Philippines',
        description: 'Natural Visayan Philippine cadence',
        samplePhrase: 'Kumusta, maayo kaayo, higayon, pagpailob.',
      },
    ],
  },
  {
    code: 'ny-MW',
    name: 'Chichewa',
    nativeName: 'Chinyanja 🇲🇼',
    flag: '🇲🇼',
    script: 'latin',
    defaultVoice: 'en-ZA-LeahNeural',
    voices: [
      {
        id: 'en-ZA-LeahNeural',
        name: 'Leah (Female) - Southern African Tone',
        gender: 'female',
        country: 'Malawi',
        description: 'Bantu Chichewa cadence',
        samplePhrase: 'Moni, zabwino kwambiri, mwayi, kuleza mtima.',
      },
    ],
  },
  {
    code: 'co-FR',
    name: 'Corsican',
    nativeName: 'Corsu 🇫🇷',
    flag: '🇫🇷',
    script: 'latin',
    defaultVoice: 'it-IT-ElsaNeural',
    voices: [
      {
        id: 'it-IT-ElsaNeural',
        name: 'Elsa (Female) - Mediterranean Tone',
        gender: 'female',
        country: 'France',
        description: 'Italo-Dalmatian Romance cadence',
        samplePhrase: 'Salute, maravigliosu, occasione, pacienza.',
      },
    ],
  },
  {
    code: 'hr-HR',
    name: 'Croatian',
    nativeName: 'Hrvatski 🇭🇷',
    flag: '🇭🇷',
    script: 'latin',
    defaultVoice: 'hr-HR-GabrijelaNeural',
    voices: [
      {
        id: 'hr-HR-GabrijelaNeural',
        name: 'Gabrijela (Female) - Zagreb Studio',
        gender: 'female',
        country: 'Croatia',
        description: 'Standard Croatian pronunciation',
        samplePhrase: 'Pozdrav, izvrsno, prilika, strpljenje.',
      },
    ],
  },
  {
    code: 'dv-MV',
    name: 'Dhivehi (Maldivian)',
    nativeName: 'ދިވެހި 🇲🇻',
    flag: '🇲🇻',
    script: 'other',
    defaultVoice: 'hi-IN-SwaraNeural',
    voices: [
      {
        id: 'hi-IN-SwaraNeural',
        name: 'Swara (Female) - South Asian Tone',
        gender: 'female',
        country: 'Maldives',
        description: 'Thaana script phonetics',
        samplePhrase: 'ސަލާމް, ވަރަށް ރަނގަޅު, ފުރުސަތު.',
      },
    ],
  },
  {
    code: 'doi-IN',
    name: 'Dogri',
    nativeName: 'डोगरी 🇮🇳',
    flag: '🇮🇳',
    script: 'devanagari',
    defaultVoice: 'hi-IN-SwaraNeural',
    voices: [
      {
        id: 'hi-IN-SwaraNeural',
        name: 'Swara (Female) - Dogri Tone',
        gender: 'female',
        country: 'India',
        description: 'Northern Indian Dogri phonetics',
        samplePhrase: 'नमस्ते, बड़ा शैल, मौका.',
      },
    ],
  },
  {
    code: 'eo-001',
    name: 'Esperanto',
    nativeName: 'Esperanto 🌐',
    flag: '🌐',
    script: 'latin',
    defaultVoice: 'it-IT-ElsaNeural',
    voices: [
      {
        id: 'it-IT-ElsaNeural',
        name: 'Elsa (Female) - International Esperanto',
        gender: 'female',
        country: 'International',
        description: 'Clear phonemic Esperanto vowels',
        samplePhrase: 'Saluton, mirinda, ŝanco, pacienco.',
      },
    ],
  },
  {
    code: 'et-EE',
    name: 'Estonian',
    nativeName: 'Eesti 🇪🇪',
    flag: '🇪🇪',
    script: 'latin',
    defaultVoice: 'et-EE-AnuNeural',
    voices: [
      {
        id: 'et-EE-AnuNeural',
        name: 'Anu (Female) - Tallinn Studio',
        gender: 'female',
        country: 'Estonia',
        description: 'Pure Finnic Estonian vowel lengths',
        samplePhrase: 'Tere, suurepärane, võimalus, kannatlikkus.',
      },
    ],
  },
  {
    code: 'ee-GH',
    name: 'Ewe',
    nativeName: 'Eʋegbe 🇬🇭',
    flag: '🇬🇭',
    script: 'latin',
    defaultVoice: 'en-NG-EzinneNeural',
    voices: [
      {
        id: 'en-NG-EzinneNeural',
        name: 'Ezinne (Female) - West African Tone',
        gender: 'female',
        country: 'Ghana',
        description: 'Standard Ewe tonal language',
        samplePhrase: 'Woezɔ, enyo ŋutɔ, mɔnukpɔkpɔ.',
      },
    ],
  },
  {
    code: 'fy-NL',
    name: 'Frisian',
    nativeName: 'Frysk 🇳🇱',
    flag: '🇳🇱',
    script: 'latin',
    defaultVoice: 'nl-NL-ColetteNeural',
    voices: [
      {
        id: 'nl-NL-ColetteNeural',
        name: 'Colette (Female) - Frisian Tone',
        gender: 'female',
        country: 'Netherlands',
        description: 'West Germanic Frisian articulation',
        samplePhrase: 'Goeiedei, prachtich, kâns, geduld.',
      },
    ],
  },
  {
    code: 'gl-ES',
    name: 'Galician',
    nativeName: 'Galego 🇪🇸',
    flag: '🇪🇸',
    script: 'latin',
    defaultVoice: 'gl-ES-SabelaNeural',
    voices: [
      {
        id: 'gl-ES-SabelaNeural',
        name: 'Sabela (Female) - Galician Studio',
        gender: 'female',
        country: 'Spain',
        description: 'Standard Galician Romance cadence',
        samplePhrase: 'Ola, marabilloso, oportunidade, paciencia.',
      },
    ],
  },
  {
    code: 'ka-GE',
    name: 'Georgian',
    nativeName: 'ქართული 🇬🇪',
    flag: '🇬🇪',
    script: 'other',
    defaultVoice: 'ka-GE-EkaNeural',
    voices: [
      {
        id: 'ka-GE-EkaNeural',
        name: 'Eka (Female) - Tbilisi Studio',
        gender: 'female',
        country: 'Georgia',
        description: 'Kartvelian Georgian consonant clusters',
        samplePhrase: 'გამარჯობა, შესანიშნავი, შესაძლებლობა.',
      },
    ],
  },
  {
    code: 'gn-PY',
    name: 'Guarani',
    nativeName: "Avañe'ẽ 🇵🇾",
    flag: '🇵🇾',
    script: 'latin',
    defaultVoice: 'es-PY-TaniaNeural',
    voices: [
      {
        id: 'es-PY-TaniaNeural',
        name: 'Tania (Female) - Guarani Tone',
        gender: 'female',
        country: 'Paraguay',
        description: 'Indigenous South American Guarani phonetics',
        samplePhrase: 'Mba’éichapa, iporãite, py’aguapy.',
      },
    ],
  },
  {
    code: 'ht-HT',
    name: 'Haitian Creole',
    nativeName: 'Kreyòl ayisyen 🇭🇹',
    flag: '🇭🇹',
    script: 'latin',
    defaultVoice: 'fr-FR-DeniseNeural',
    voices: [
      {
        id: 'fr-FR-DeniseNeural',
        name: 'Denise (Female) - Caribbean Creole',
        gender: 'female',
        country: 'Haiti',
        description: 'Natural Haitian Creole pronunciation',
        samplePhrase: 'Bonjou, bèl bagay, opòtinite, pasyans.',
      },
    ],
  },
  {
    code: 'ha-NG',
    name: 'Hausa',
    nativeName: 'Harshen Hausa 🇳🇬',
    flag: '🇳🇬',
    script: 'latin',
    defaultVoice: 'ha-NG-AminaNeural',
    voices: [
      {
        id: 'ha-NG-AminaNeural',
        name: 'Amina (Female) - Hausa Studio',
        gender: 'female',
        country: 'Nigeria',
        description: 'Clear Chadic Afroasiatic Hausa',
        samplePhrase: 'Sannu, da kyau kwarai, dama, hakuri.',
      },
    ],
  },
  {
    code: 'haw-US',
    name: 'Hawaiian',
    nativeName: 'ʻŌlelo Hawaiʻi 🌺',
    flag: '🌺',
    script: 'latin',
    defaultVoice: 'en-US-JennyNeural',
    voices: [
      {
        id: 'en-US-JennyNeural',
        name: 'Jenny (Female) - Polynesian Tone',
        gender: 'female',
        country: 'United States',
        description: 'Polynesian Hawaiian glottal okina pronunciation',
        samplePhrase: 'Aloha, maikaʻi loa, manawa kūpono, ahonui.',
      },
    ],
  },
  {
    code: 'hmn-001',
    name: 'Hmong',
    nativeName: 'Hmoob 🌏',
    flag: '🌏',
    script: 'latin',
    defaultVoice: 'zh-CN-XiaoxiaoNeural',
    voices: [
      {
        id: 'zh-CN-XiaoxiaoNeural',
        name: 'Xiaoxiao (Female) - Hmong Tone',
        gender: 'female',
        country: 'International',
        description: 'Clear Hmong-Mien tonal delivery',
        samplePhrase: 'Nyob zoo, zoo heev, lub caij nyoog.',
      },
    ],
  },
  {
    code: 'is-IS',
    name: 'Icelandic',
    nativeName: 'Íslenska 🇮🇸',
    flag: '🇮🇸',
    script: 'latin',
    defaultVoice: 'is-IS-GudrunNeural',
    voices: [
      {
        id: 'is-IS-GudrunNeural',
        name: 'Gudrun (Female) - Reykjavik Studio',
        gender: 'female',
        country: 'Iceland',
        description: 'Pure Old Norse preserved Icelandic',
        samplePhrase: 'Halló, frábært, tækifæri, þolinmæði.',
      },
    ],
  },
  {
    code: 'ig-NG',
    name: 'Igbo',
    nativeName: 'Asụsụ Igbo 🇳🇬',
    flag: '🇳🇬',
    script: 'latin',
    defaultVoice: 'ig-NG-EbeleNeural',
    voices: [
      {
        id: 'ig-NG-EbeleNeural',
        name: 'Ebele (Female) - Igbo Studio',
        gender: 'female',
        country: 'Nigeria',
        description: 'Authentic Nigerian Igbo tonal pitch',
        samplePhrase: 'Nnọọ, ọmarịcha, ohere, ndidi.',
      },
    ],
  },
  {
    code: 'ilo-PH',
    name: 'Ilocano',
    nativeName: 'Ilokano 🇵🇭',
    flag: '🇵🇭',
    script: 'latin',
    defaultVoice: 'fil-PH-BlessicaNeural',
    voices: [
      {
        id: 'fil-PH-BlessicaNeural',
        name: 'Blessica (Female) - Northern Luzon',
        gender: 'female',
        country: 'Philippines',
        description: 'Standard Ilocano pronunciation',
        samplePhrase: 'Kablaaw, nagpintas, gundaway, anus.',
      },
    ],
  },
  {
    code: 'ga-IE',
    name: 'Irish (Gaeilge)',
    nativeName: 'Gaeilge 🇮🇪',
    flag: '🇮🇪',
    script: 'latin',
    defaultVoice: 'ga-IE-OrlaNeural',
    voices: [
      {
        id: 'ga-IE-OrlaNeural',
        name: 'Orla (Female) - Dublin Studio',
        gender: 'female',
        country: 'Ireland',
        description: 'Traditional Celtic Gaeilge pronunciation',
        samplePhrase: 'Dia dhuit, iontach, deis, foighne.',
      },
    ],
  },
  {
    code: 'jv-ID',
    name: 'Javanese',
    nativeName: 'Basa Jawa 🇮🇩',
    flag: '🇮🇩',
    script: 'latin',
    defaultVoice: 'jv-ID-SitiNeural',
    voices: [
      {
        id: 'jv-ID-SitiNeural',
        name: 'Siti (Female) - Central Java Studio',
        gender: 'female',
        country: 'Indonesia',
        description: 'Polite Central Javanese articulation',
        samplePhrase: 'Sugeng rawuh, sae sanget, kalodhangan, sabar.',
      },
    ],
  },
  {
    code: 'kk-KZ',
    name: 'Kazakh',
    nativeName: 'Қазақ тілі 🇰🇿',
    flag: '🇰🇿',
    script: 'cyrillic',
    defaultVoice: 'kk-KZ-AigulNeural',
    voices: [
      {
        id: 'kk-KZ-AigulNeural',
        name: 'Aigul (Female) - Almaty Studio',
        gender: 'female',
        country: 'Kazakhstan',
        description: 'Central Asian Turkic Kazakh phrasing',
        samplePhrase: 'Сәлеметсіз бе, тамаша, мүмкіндік, шыдамдылық.',
      },
    ],
  },
  {
    code: 'km-KH',
    name: 'Khmer',
    nativeName: 'ភាសាខ្មែរ 🇰🇭',
    flag: '🇰🇭',
    script: 'other',
    defaultVoice: 'km-KH-SreymomNeural',
    voices: [
      {
        id: 'km-KH-SreymomNeural',
        name: 'Sreymom (Female) - Phnom Penh Studio',
        gender: 'female',
        country: 'Cambodia',
        description: 'Austroasiatic Khmer register vowel distinctions',
        samplePhrase: 'ជំរាបសួរ, អស្ចារ្យ, ឱកាស, ការអត់ធ្មត់.',
      },
    ],
  },
  {
    code: 'rw-RW',
    name: 'Kinyarwanda',
    nativeName: 'Ikinyarwanda 🇷🇼',
    flag: '🇷🇼',
    script: 'latin',
    defaultVoice: 'sw-KE-ZuriNeural',
    voices: [
      {
        id: 'sw-KE-ZuriNeural',
        name: 'Zuri (Female) - Great Lakes Bantu',
        gender: 'female',
        country: 'Rwanda',
        description: 'Clear Kinyarwanda tonal phonetics',
        samplePhrase: 'Muraho, byiza cyane, amahirwe, kwihangana.',
      },
    ],
  },
  {
    code: 'kok-IN',
    name: 'Konkani',
    nativeName: 'कोंकणी 🇮🇳',
    flag: '🇮🇳',
    script: 'devanagari',
    defaultVoice: 'mr-IN-AarohiNeural',
    voices: [
      {
        id: 'mr-IN-AarohiNeural',
        name: 'Aarohi (Female) - Konkan Coast',
        gender: 'female',
        country: 'India',
        description: 'Standard Goan Konkani articulation',
        samplePhrase: 'नमस्कार, बरे आसा, संद, सोशिकताय.',
      },
    ],
  },
  {
    code: 'kri-SL',
    name: 'Krio',
    nativeName: 'Krio 🇸🇱',
    flag: '🇸🇱',
    script: 'latin',
    defaultVoice: 'en-NG-EzinneNeural',
    voices: [
      {
        id: 'en-NG-EzinneNeural',
        name: 'Ezinne (Female) - West African Tone',
        gender: 'female',
        country: 'Sierra Leone',
        description: 'Sierra Leonean Creole pronunciation',
        samplePhrase: 'Kusheh, fayn tin, chans, kɔmɔt.',
      },
    ],
  },
  {
    code: 'ku-TR',
    name: 'Kurdish (Kurmanji)',
    nativeName: 'Kurdî (Kurmancî) 🇹🇷',
    flag: '🇹🇷',
    script: 'latin',
    defaultVoice: 'tr-TR-EmelNeural',
    voices: [
      {
        id: 'tr-TR-EmelNeural',
        name: 'Emel (Female) - Regional Tone',
        gender: 'female',
        country: 'Turkey',
        description: 'Northern Kurdish pronunciation',
        samplePhrase: 'Silav, pir baş e, derfet, sebr.',
      },
    ],
  },
  {
    code: 'ckb-IQ',
    name: 'Kurdish (Sorani)',
    nativeName: 'کوردی (سۆرانی) 🇮🇶',
    flag: '🇮🇶',
    script: 'arabic',
    defaultVoice: 'ar-IQ-RanaNeural',
    voices: [
      {
        id: 'ar-IQ-RanaNeural',
        name: 'Rana (Female) - Erbil Studio',
        gender: 'female',
        country: 'Iraq',
        description: 'Central Kurdish Sorani delivery',
        samplePhrase: 'سڵاو, زۆر باشە, دەرفەت, سەبر.',
      },
    ],
  },
  {
    code: 'ky-KG',
    name: 'Kyrgyz',
    nativeName: 'Кыргызча 🇰🇬',
    flag: '🇰🇬',
    script: 'cyrillic',
    defaultVoice: 'ru-RU-SvetlanaNeural',
    voices: [
      {
        id: 'ru-RU-SvetlanaNeural',
        name: 'Svetlana (Female) - Central Asian Tone',
        gender: 'female',
        country: 'Kyrgyzstan',
        description: 'Kyrgyz Turkic articulation',
        samplePhrase: 'Саламатсызбы, сонун, мүмкүнчүлүк, чыдамкайлык.',
      },
    ],
  },
  {
    code: 'lo-LA',
    name: 'Lao',
    nativeName: 'ພາສາລາວ 🇱🇦',
    flag: '🇱🇦',
    script: 'other',
    defaultVoice: 'lo-LA-KeomanyNeural',
    voices: [
      {
        id: 'lo-LA-KeomanyNeural',
        name: 'Keomany (Female) - Vientiane Studio',
        gender: 'female',
        country: 'Laos',
        description: 'Gentle Tai-Kadai Lao tonal delivery',
        samplePhrase: 'ສະບາຍດີ, ດີເລີດ, ໂອກາດ, ຄວາມອົດທົນ.',
      },
    ],
  },
  {
    code: 'la-VA',
    name: 'Latin',
    nativeName: 'Lingua Latina 🇻🇦',
    flag: '🇻🇦',
    script: 'latin',
    defaultVoice: 'it-IT-ElsaNeural',
    voices: [
      {
        id: 'it-IT-ElsaNeural',
        name: 'Elsa (Female) - Classical Latin',
        gender: 'female',
        country: 'Vatican City',
        description: 'Classical & Ecclesiastical Latin pronunciation',
        samplePhrase: 'Salve, mirabile, opportunitas, patientia.',
      },
    ],
  },
  {
    code: 'lv-LV',
    name: 'Latvian',
    nativeName: 'Latviešu 🇱🇻',
    flag: '🇱🇻',
    script: 'latin',
    defaultVoice: 'lv-LV-EveritaNeural',
    voices: [
      {
        id: 'lv-LV-EveritaNeural',
        name: 'Everita (Female) - Riga Studio',
        gender: 'female',
        country: 'Latvia',
        description: 'Standard Baltic Latvian vowel pitch',
        samplePhrase: 'Sveiki, brīnišķīgi, iespēja, pacietība.',
      },
    ],
  },
  {
    code: 'ln-CD',
    name: 'Lingala',
    nativeName: 'Lingála 🇨🇩',
    flag: '🇨🇩',
    script: 'latin',
    defaultVoice: 'fr-FR-DeniseNeural',
    voices: [
      {
        id: 'fr-FR-DeniseNeural',
        name: 'Denise (Female) - Congo Tone',
        gender: 'female',
        country: 'Congo',
        description: 'Central African Lingala cadence',
        samplePhrase: 'Mbote, malamu mingi, libaku, motema molai.',
      },
    ],
  },
  {
    code: 'lt-LT',
    name: 'Lithuanian',
    nativeName: 'Lietuvių 🇱🇹',
    flag: '🇱🇹',
    script: 'latin',
    defaultVoice: 'lt-LT-OnaNeural',
    voices: [
      {
        id: 'lt-LT-OnaNeural',
        name: 'Ona (Female) - Vilnius Studio',
        gender: 'female',
        country: 'Lithuania',
        description: 'Archaic Baltic pitch accent precision',
        samplePhrase: 'Sveiki, puiku, galimybė, kantrybė.',
      },
    ],
  },
  {
    code: 'lg-UG',
    name: 'Luganda',
    nativeName: 'Oluganda 🇺🇬',
    flag: '🇺🇬',
    script: 'latin',
    defaultVoice: 'sw-KE-ZuriNeural',
    voices: [
      {
        id: 'sw-KE-ZuriNeural',
        name: 'Zuri (Female) - East African Bantu',
        gender: 'female',
        country: 'Uganda',
        description: 'Standard Luganda pronunciation',
        samplePhrase: 'Ki kati, bulungi nnyo, omukisa, okugumiikiriza.',
      },
    ],
  },
  {
    code: 'lb-LU',
    name: 'Luxembourgish',
    nativeName: 'Lëtzebuergesch 🇱🇺',
    flag: '🇱🇺',
    script: 'latin',
    defaultVoice: 'de-DE-KatjaNeural',
    voices: [
      {
        id: 'de-DE-KatjaNeural',
        name: 'Katja (Female) - Moselle Franconian',
        gender: 'female',
        country: 'Luxembourg',
        description: 'National Luxembourgish delivery',
        samplePhrase: 'Moien, fantastesch, Geleeënheet, Gedold.',
      },
    ],
  },
  {
    code: 'mk-MK',
    name: 'Macedonian',
    nativeName: 'Македонски 🇲🇰',
    flag: '🇲🇰',
    script: 'cyrillic',
    defaultVoice: 'mk-MK-MarijaNeural',
    voices: [
      {
        id: 'mk-MK-MarijaNeural',
        name: 'Marija (Female) - Skopje Studio',
        gender: 'female',
        country: 'North Macedonia',
        description: 'Antepenultimate stress South Slavic delivery',
        samplePhrase: 'Здраво, одлично, можност, трпение.',
      },
    ],
  },
  {
    code: 'mai-IN',
    name: 'Maithili',
    nativeName: 'मैथिली 🇮🇳',
    flag: '🇮🇳',
    script: 'devanagari',
    defaultVoice: 'hi-IN-SwaraNeural',
    voices: [
      {
        id: 'hi-IN-SwaraNeural',
        name: 'Swara (Female) - Mithila Tone',
        gender: 'female',
        country: 'India',
        description: 'Classical Maithili literary delivery',
        samplePhrase: 'प्रणाम, बहुत नीक, अवसर, धैर्य.',
      },
    ],
  },
  {
    code: 'mg-MG',
    name: 'Malagasy',
    nativeName: 'Malagasy 🇲🇬',
    flag: '🇲🇬',
    script: 'latin',
    defaultVoice: 'fr-FR-DeniseNeural',
    voices: [
      {
        id: 'fr-FR-DeniseNeural',
        name: 'Denise (Female) - Indian Ocean Tone',
        gender: 'female',
        country: 'Madagascar',
        description: 'Austronesian Malagasy language',
        samplePhrase: 'Manao ahoana, tena tsara, fotoana, faharetana.',
      },
    ],
  },
  {
    code: 'mt-MT',
    name: 'Maltese',
    nativeName: 'Malti 🇲🇹',
    flag: '🇲🇹',
    script: 'latin',
    defaultVoice: 'mt-MT-GraceNeural',
    voices: [
      {
        id: 'mt-MT-GraceNeural',
        name: 'Grace (Female) - Valletta Studio',
        gender: 'female',
        country: 'Malta',
        description: 'Semito-Romance Maltese language cadence',
        samplePhrase: 'Bongu, eċċellenti, opportunità, paċenzja.',
      },
    ],
  },
  {
    code: 'mi-NZ',
    name: 'Maori',
    nativeName: 'Te Reo Māori 🇳🇿',
    flag: '🇳🇿',
    script: 'latin',
    defaultVoice: 'en-NZ-MollyNeural',
    voices: [
      {
        id: 'en-NZ-MollyNeural',
        name: 'Molly (Female) - Aotearoa Tone',
        gender: 'female',
        country: 'New Zealand',
        description: 'Indigenous Māori Polynesian pronunciation',
        samplePhrase: 'Kia ora, tino pai, whai wāhitanga, manawanui.',
      },
    ],
  },
  {
    code: 'mni-Mtei-IN',
    name: 'Meiteilon (Manipuri)',
    nativeName: 'মৈতৈলোন্ 🇮🇳',
    flag: '🇮🇳',
    script: 'other',
    defaultVoice: 'bn-IN-TanishaaNeural',
    voices: [
      {
        id: 'bn-IN-TanishaaNeural',
        name: 'Tanishaa (Female) - Manipur Tone',
        gender: 'female',
        country: 'India',
        description: 'Tibeto-Burman Manipuri cadence',
        samplePhrase: 'Khurumjari, yamna fajei, khudoongchaba.',
      },
    ],
  },
  {
    code: 'lus-IN',
    name: 'Mizo',
    nativeName: 'Mizo 🇮🇳',
    flag: '🇮🇳',
    script: 'latin',
    defaultVoice: 'en-IN-NeerjaNeural',
    voices: [
      {
        id: 'en-IN-NeerjaNeural',
        name: 'Neerja (Female) - Northeast Indian Tone',
        gender: 'female',
        country: 'India',
        description: 'Sino-Tibetan Mizo tonal phonetics',
        samplePhrase: 'Chibai, a tha lutuk, hun tha, dawhtheihna.',
      },
    ],
  },
  {
    code: 'mn-MN',
    name: 'Mongolian',
    nativeName: 'Монгол хэл 🇲🇳',
    flag: '🇲🇳',
    script: 'cyrillic',
    defaultVoice: 'ru-RU-SvetlanaNeural',
    voices: [
      {
        id: 'ru-RU-SvetlanaNeural',
        name: 'Svetlana (Female) - Steppe Tone',
        gender: 'female',
        country: 'Mongolia',
        description: 'Khalkha Mongolian Cyrillic delivery',
        samplePhrase: 'Сайн байна уу, гайхалтай, боломж, тэвчээр.',
      },
    ],
  },
  {
    code: 'my-MM',
    name: 'Myanmar (Burmese)',
    nativeName: 'မြန်မာဘာသာ 🇲🇲',
    flag: '🇲🇲',
    script: 'other',
    defaultVoice: 'my-MM-NilarNeural',
    voices: [
      {
        id: 'my-MM-NilarNeural',
        name: 'Nilar (Female) - Yangon Studio',
        gender: 'female',
        country: 'Myanmar',
        description: 'Tonal Burmese register and nasal sounds',
        samplePhrase: 'မင်္ဂလာပါ, အရမ်းကောင်းတယ်, အခွင့်အရေး, စိတ်ရှည်မှု.',
      },
    ],
  },
  {
    code: 'ne-NP',
    name: 'Nepali',
    nativeName: 'नेपाली 🇳🇵',
    flag: '🇳🇵',
    script: 'devanagari',
    defaultVoice: 'ne-NP-HemkalaNeural',
    voices: [
      {
        id: 'ne-NP-HemkalaNeural',
        name: 'Hemkala (Female) - Kathmandu Studio',
        gender: 'female',
        country: 'Nepal',
        description: 'Clear Himalayan Nepali Devanagari delivery',
        samplePhrase: 'नमस्ते, धेरै राम्रो, अवसर, धैर्य.',
      },
    ],
  },
  {
    code: 'or-IN',
    name: 'Odia (Oriya)',
    nativeName: 'ଓଡ଼ିଆ 🇮🇳',
    flag: '🇮🇳',
    script: 'other',
    defaultVoice: 'or-IN-SubhasiniNeural',
    voices: [
      {
        id: 'or-IN-SubhasiniNeural',
        name: 'Subhasini (Female) - Bhubaneswar Studio',
        gender: 'female',
        country: 'India',
        description: 'Classical Odia rounded vowels',
        samplePhrase: 'ନମସ୍କାର, ବହୁତ ଭଲ, ସୁଯୋଗ, ଧୈର୍ଯ୍ୟ.',
      },
    ],
  },
  {
    code: 'om-ET',
    name: 'Oromo',
    nativeName: 'Afaan Oromoo 🇪🇹',
    flag: '🇪🇹',
    script: 'latin',
    defaultVoice: 'am-ET-MekdesNeural',
    voices: [
      {
        id: 'am-ET-MekdesNeural',
        name: 'Mekdes (Female) - Horn of Africa Tone',
        gender: 'female',
        country: 'Ethiopia',
        description: 'Cushitic Afroasiatic Oromo language',
        samplePhrase: 'Akkam, baay’ee gaarii, carraa, obsa.',
      },
    ],
  },
  {
    code: 'ps-AF',
    name: 'Pashto',
    nativeName: 'پښتو 🇦🇫',
    flag: '🇦🇫',
    script: 'arabic',
    defaultVoice: 'ps-AF-GulNawazNeural',
    voices: [
      {
        id: 'ps-AF-GulNawazNeural',
        name: 'Gul Nawaz (Male) - Kabul Studio',
        gender: 'male',
        country: 'Afghanistan',
        description: 'Eastern Iranian Pashto phonetics',
        samplePhrase: 'سلام, ډېر ښه, فرصت, صبر.',
      },
    ],
  },
  {
    code: 'qu-PE',
    name: 'Quechua',
    nativeName: 'Runa Simi 🇵🇪',
    flag: '🇵🇪',
    script: 'latin',
    defaultVoice: 'es-PE-CamilaNeural',
    voices: [
      {
        id: 'es-PE-CamilaNeural',
        name: 'Camila (Female) - Inca Highland Tone',
        gender: 'female',
        country: 'Peru',
        description: 'Traditional Andean Quechua',
        samplePhrase: 'Allianllachu, ancha allin, suyana.',
      },
    ],
  },
  {
    code: 'sm-WS',
    name: 'Samoan',
    nativeName: 'Gagana Samoa 🇼🇸',
    flag: '🇼🇸',
    script: 'latin',
    defaultVoice: 'en-NZ-MollyNeural',
    voices: [
      {
        id: 'en-NZ-MollyNeural',
        name: 'Molly (Female) - Pacific Tone',
        gender: 'female',
        country: 'Samoa',
        description: 'Oceanic Polynesian Samoan pronunciation',
        samplePhrase: 'Talofa, manaia tele, avanoa, onosai.',
      },
    ],
  },
  {
    code: 'sa-IN',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम् 🇮🇳',
    flag: '🇮🇳',
    script: 'devanagari',
    defaultVoice: 'hi-IN-SwaraNeural',
    voices: [
      {
        id: 'hi-IN-SwaraNeural',
        name: 'Swara (Female) - Vedic Classical Tone',
        gender: 'female',
        country: 'India',
        description: 'Ancient classical Vedic Sanskrit meter',
        samplePhrase: 'नमस्ते, उत्तमम्, अवसरः, धैर्यम्.',
      },
    ],
  },
  {
    code: 'gd-GB',
    name: 'Scots Gaelic',
    nativeName: 'Gàidhlig 🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    script: 'latin',
    defaultVoice: 'en-GB-SoniaNeural',
    voices: [
      {
        id: 'en-GB-SoniaNeural',
        name: 'Sonia (Female) - Highlands Tone',
        gender: 'female',
        country: 'Scotland',
        description: 'Celtic Scottish Gaelic pronunciation',
        samplePhrase: 'Halò, sgoinneil, cothrom, foighidinn.',
      },
    ],
  },
  {
    code: 'nso-ZA',
    name: 'Sepedi (Northern Sotho)',
    nativeName: 'Sesotho sa Leboa 🇿🇦',
    flag: '🇿🇦',
    script: 'latin',
    defaultVoice: 'en-ZA-LeahNeural',
    voices: [
      {
        id: 'en-ZA-LeahNeural',
        name: 'Leah (Female) - South African Tone',
        gender: 'female',
        country: 'South Africa',
        description: 'Bantu Sepedi pronunciation',
        samplePhrase: 'Thobela, botse kudu, monyetla, kgotlelelo.',
      },
    ],
  },
  {
    code: 'sr-RS',
    name: 'Serbian',
    nativeName: 'Српски 🇷🇸',
    flag: '🇷🇸',
    script: 'cyrillic',
    defaultVoice: 'sr-RS-NicholasNeural',
    voices: [
      {
        id: 'sr-RS-NicholasNeural',
        name: 'Nicholas (Male) - Belgrade Studio',
        gender: 'male',
        country: 'Serbia',
        description: 'Standard Serbian Cyrillic cadence',
        samplePhrase: 'Здраво, одлично, прилика, стрпљење.',
      },
    ],
  },
  {
    code: 'st-ZA',
    name: 'Sesotho',
    nativeName: 'Sesotho 🇱🇸',
    flag: '🇱🇸',
    script: 'latin',
    defaultVoice: 'en-ZA-LeahNeural',
    voices: [
      {
        id: 'en-ZA-LeahNeural',
        name: 'Leah (Female) - Southern Africa',
        gender: 'female',
        country: 'Lesotho',
        description: 'Standard Southern Sotho delivery',
        samplePhrase: 'Dumela, hantle haholo, monyetla, mamello.',
      },
    ],
  },
  {
    code: 'sn-ZW',
    name: 'Shona',
    nativeName: 'chiShona 🇿🇼',
    flag: '🇿🇼',
    script: 'latin',
    defaultVoice: 'en-ZA-LeahNeural',
    voices: [
      {
        id: 'en-ZA-LeahNeural',
        name: 'Leah (Female) - Zimbabwean Tone',
        gender: 'female',
        country: 'Zimbabwe',
        description: 'Standard Bantu Shona pronunciation',
        samplePhrase: 'Mhoro, zvakanaka kwazvo, mukana, mwoyo murefu.',
      },
    ],
  },
  {
    code: 'sd-PK',
    name: 'Sindhi',
    nativeName: 'سنڌي 🇵🇰',
    flag: '🇵🇰',
    script: 'arabic',
    defaultVoice: 'ur-PK-UzmaNeural',
    voices: [
      {
        id: 'ur-PK-UzmaNeural',
        name: 'Uzma (Female) - Indus Tone',
        gender: 'female',
        country: 'Pakistan',
        description: 'Indo-Aryan Sindhi Arabic-script delivery',
        samplePhrase: 'سلام, تمام سٺو, موقعو, صبر.',
      },
    ],
  },
  {
    code: 'si-LK',
    name: 'Sinhala',
    nativeName: 'සිංහල 🇱🇰',
    flag: '🇱🇰',
    script: 'other',
    defaultVoice: 'si-LK-SameeraNeural',
    voices: [
      {
        id: 'si-LK-SameeraNeural',
        name: 'Sameera (Male) - Colombo Studio',
        gender: 'male',
        country: 'Sri Lanka',
        description: 'Standard Sri Lankan Sinhala delivery',
        samplePhrase: 'ආයුබෝවන්, ඉතා විශිෂ්ටයි, අවස්ථාව, ඉවසීම.',
      },
    ],
  },
  {
    code: 'sk-SK',
    name: 'Slovak',
    nativeName: 'Slovenčina 🇸🇰',
    flag: '🇸🇰',
    script: 'latin',
    defaultVoice: 'sk-SK-ViktoriaNeural',
    voices: [
      {
        id: 'sk-SK-ViktoriaNeural',
        name: 'Viktoria (Female) - Bratislava Studio',
        gender: 'female',
        country: 'Slovakia',
        description: 'Central Slovak West Slavic articulation',
        samplePhrase: 'Ahoj, skvelé, príležitosť, trpezlivosť.',
      },
    ],
  },
  {
    code: 'sl-SI',
    name: 'Slovenian',
    nativeName: 'Slovenščina 🇸🇮',
    flag: '🇸🇮',
    script: 'latin',
    defaultVoice: 'sl-SI-PetraNeural',
    voices: [
      {
        id: 'sl-SI-PetraNeural',
        name: 'Petra (Female) - Ljubljana Studio',
        gender: 'female',
        country: 'Slovenia',
        description: 'South Slavic dual-grammatical precision',
        samplePhrase: 'Živjo, odlično, priložnost, potrpežljivost.',
      },
    ],
  },
  {
    code: 'so-SO',
    name: 'Somali',
    nativeName: 'Af Soomaali 🇸🇴',
    flag: '🇸🇴',
    script: 'latin',
    defaultVoice: 'so-SO-MuuseNeural',
    voices: [
      {
        id: 'so-SO-MuuseNeural',
        name: 'Muuse (Male) - Mogadishu Studio',
        gender: 'male',
        country: 'Somalia',
        description: 'Cushitic Afroasiatic Somali tone',
        samplePhrase: 'Nabadeey, aad u wanaagsan, fursad, samir.',
      },
    ],
  },
  {
    code: 'su-ID',
    name: 'Sundanese',
    nativeName: 'Basa Sunda 🇮🇩',
    flag: '🇮🇩',
    script: 'latin',
    defaultVoice: 'su-ID-TutiNeural',
    voices: [
      {
        id: 'su-ID-TutiNeural',
        name: 'Tuti (Female) - West Java Studio',
        gender: 'female',
        country: 'Indonesia',
        description: 'Melodious West Javanese Sundanese',
        samplePhrase: 'Sampurasun, sae pisan, kasempetan, kasabaran.',
      },
    ],
  },
  {
    code: 'tg-TJ',
    name: 'Tajik',
    nativeName: 'Тоҷикӣ 🇹🇯',
    flag: '🇹🇯',
    script: 'cyrillic',
    defaultVoice: 'ru-RU-SvetlanaNeural',
    voices: [
      {
        id: 'ru-RU-SvetlanaNeural',
        name: 'Svetlana (Female) - Pamir Tone',
        gender: 'female',
        country: 'Tajikistan',
        description: 'Persian-family Tajik Cyrillic articulation',
        samplePhrase: 'Салом, хеле хуб, имконият, сабр.',
      },
    ],
  },
  {
    code: 'tt-RU',
    name: 'Tatar',
    nativeName: 'Татар теле 🇷🇺',
    flag: '🇷🇺',
    script: 'cyrillic',
    defaultVoice: 'ru-RU-SvetlanaNeural',
    voices: [
      {
        id: 'ru-RU-SvetlanaNeural',
        name: 'Svetlana (Female) - Volga Tone',
        gender: 'female',
        country: 'Russia',
        description: 'Kipchak Turkic Tatar delivery',
        samplePhrase: 'Сәлам, бик яхшы, мөмкинлек, сабырлык.',
      },
    ],
  },
  {
    code: 'ti-ET',
    name: 'Tigrinya',
    nativeName: 'ትግርኛ 🇪🇹',
    flag: '🇪🇹',
    script: 'other',
    defaultVoice: 'am-ET-MekdesNeural',
    voices: [
      {
        id: 'am-ET-MekdesNeural',
        name: 'Mekdes (Female) - Eritrea & Tigray Tone',
        gender: 'female',
        country: 'Ethiopia',
        description: 'Semitic Geʽez script Tigrinya',
        samplePhrase: 'ሰላም, ብጣዕሚ ጽቡቕ, ዕድል, ዓቕሊ.',
      },
    ],
  },
  {
    code: 'ts-ZA',
    name: 'Tsonga',
    nativeName: 'Xitsonga 🇿🇦',
    flag: '🇿🇦',
    script: 'latin',
    defaultVoice: 'en-ZA-LeahNeural',
    voices: [
      {
        id: 'en-ZA-LeahNeural',
        name: 'Leah (Female) - Limpopo Tone',
        gender: 'female',
        country: 'South Africa',
        description: 'Southern African Xitsonga delivery',
        samplePhrase: 'Avuxeni, kahle swinene, nkarhi, mbilu yo leha.',
      },
    ],
  },
  {
    code: 'tk-TM',
    name: 'Turkmen',
    nativeName: 'Türkmençe 🇹🇲',
    flag: '🇹🇲',
    script: 'latin',
    defaultVoice: 'tr-TR-EmelNeural',
    voices: [
      {
        id: 'tr-TR-EmelNeural',
        name: 'Emel (Female) - Ashgabat Tone',
        gender: 'female',
        country: 'Turkmenistan',
        description: 'Oghuz Turkic Turkmen delivery',
        samplePhrase: 'Salam, örän gowy, mümkinçilik, sabyr.',
      },
    ],
  },
  {
    code: 'ak-GH',
    name: 'Twi (Akan)',
    nativeName: 'Twi 🇬🇭',
    flag: '🇬🇭',
    script: 'latin',
    defaultVoice: 'en-NG-EzinneNeural',
    voices: [
      {
        id: 'en-NG-EzinneNeural',
        name: 'Ezinne (Female) - Ashanti Tone',
        gender: 'female',
        country: 'Ghana',
        description: 'Standard Ghanaian Akan Twi dialect',
        samplePhrase: 'Akwaaba, eye paara, kwan, aboterɛ.',
      },
    ],
  },
  {
    code: 'ug-CN',
    name: 'Uyghur',
    nativeName: 'ئۇيغۇرچە 🇨🇳',
    flag: '🇨🇳',
    script: 'arabic',
    defaultVoice: 'tr-TR-EmelNeural',
    voices: [
      {
        id: 'tr-TR-EmelNeural',
        name: 'Emel (Female) - Silk Road Tone',
        gender: 'female',
        country: 'China',
        description: 'Karluk Turkic Uyghur Arabic script',
        samplePhrase: 'ياخشىمۇسىز, بەك ياخشى, پۇرسەت, سەۋر.',
      },
    ],
  },
  {
    code: 'uz-UZ',
    name: 'Uzbek',
    nativeName: "O'zbek tili 🇺🇿",
    flag: '🇺🇿',
    script: 'latin',
    defaultVoice: 'uz-UZ-MadinaNeural',
    voices: [
      {
        id: 'uz-UZ-MadinaNeural',
        name: 'Madina (Female) - Tashkent Studio',
        gender: 'female',
        country: 'Uzbekistan',
        description: 'Standard Latinized Uzbek delivery',
        samplePhrase: 'Salom, juda yaxshi, imkoniyat, sabr.',
      },
    ],
  },
  {
    code: 'cy-GB',
    name: 'Welsh',
    nativeName: 'Cymraeg 🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    script: 'latin',
    defaultVoice: 'cy-GB-NiaNeural',
    voices: [
      {
        id: 'cy-GB-NiaNeural',
        name: 'Nia (Female) - Cardiff Studio',
        gender: 'female',
        country: 'Wales',
        description: 'Brythonic Celtic Welsh consonant mutations',
        samplePhrase: 'Helo, ardderchog, cyfle, amynedd.',
      },
    ],
  },
  {
    code: 'xh-ZA',
    name: 'Xhosa',
    nativeName: 'isiXhosa 🇿🇦',
    flag: '🇿🇦',
    script: 'latin',
    defaultVoice: 'xh-ZA-ZolekaNeural',
    voices: [
      {
        id: 'xh-ZA-ZolekaNeural',
        name: 'Zoleka (Female) - Cape Town Studio',
        gender: 'female',
        country: 'South Africa',
        description: 'Nguni Bantu isiXhosa click consonants',
        samplePhrase: 'Molo, kuhle kakhulu, ithuba, umonde.',
      },
    ],
  },
  {
    code: 'yi-001',
    name: 'Yiddish',
    nativeName: 'ייִדיש ✡️',
    flag: '✡️',
    script: 'other',
    defaultVoice: 'de-DE-KatjaNeural',
    voices: [
      {
        id: 'de-DE-KatjaNeural',
        name: 'Katja (Female) - Ashkenazi Tone',
        gender: 'female',
        country: 'International',
        description: 'Germanic-Hebrew Yiddish delivery',
        samplePhrase: 'שלום עליכם, זייער גוט, געלעגנהייט, געדולד.',
      },
    ],
  },
  {
    code: 'yo-NG',
    name: 'Yoruba',
    nativeName: 'Èdè Yorùbá 🇳🇬',
    flag: '🇳🇬',
    script: 'latin',
    defaultVoice: 'yo-NG-KikelomoNeural',
    voices: [
      {
        id: 'yo-NG-KikelomoNeural',
        name: 'Kikelomo (Female) - Lagos Studio',
        gender: 'female',
        country: 'Nigeria',
        description: 'Three-tone level Yoruba pitch articulation',
        samplePhrase: 'Bawo, o dara pupọ, anfani, suuru.',
      },
    ],
  },
  {
    code: 'zu-ZA',
    name: 'Zulu',
    nativeName: 'isiZulu 🇿🇦',
    flag: '🇿🇦',
    script: 'latin',
    defaultVoice: 'zu-ZA-ThembaNeural',
    voices: [
      {
        id: 'zu-ZA-ThembaNeural',
        name: 'Themba (Male) - Durban Studio',
        gender: 'male',
        country: 'South Africa',
        description: 'Rich Nguni Bantu isiZulu click articulation',
        samplePhrase: 'Sawubona, kuhle kakhulu, ithuba, ukubekezela.',
      },
    ],
  },
];

// Synonyms and alias mappings for Google Translate language codes
const LANG_CODE_ALIASES: Record<string, string> = {
  ar: 'ar-EG',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  ja: 'ja-JP',
  zh: 'zh-CN',
  'zh-cn': 'zh-CN',
  'zh-tw': 'zh-TW',
  ko: 'ko-KR',
  ru: 'ru-RU',
  tr: 'tr-TR',
  pt: 'pt-BR',
  nl: 'nl-NL',
  pl: 'pl-PL',
  hi: 'hi-IN',
  ur: 'ur-PK',
  fa: 'fa-IR',
  id: 'id-ID',
  sv: 'sv-SE',
  vi: 'vi-VN',
  el: 'el-GR',
  he: 'he-IL',
  iw: 'he-IL', // Google legacy code for Hebrew
  th: 'th-TH',
  uk: 'uk-UA',
  ro: 'ro-RO',
  cs: 'cs-CZ',
  hu: 'hu-HU',
  da: 'da-DK',
  fi: 'fi-FI',
  no: 'nb-NO',
  nb: 'nb-NO',
  fil: 'fil-PH',
  tl: 'fil-PH', // Google legacy code for Tagalog/Filipino
  ms: 'ms-MY',
  bn: 'bn-BD',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  sw: 'sw-KE',
  af: 'af-ZA',
  sq: 'sq-AL',
  am: 'am-ET',
  hy: 'hy-AM',
  as: 'as-IN',
  ay: 'ay-BO',
  az: 'az-AZ',
  bm: 'bm-ML',
  eu: 'eu-ES',
  be: 'be-BY',
  bho: 'bho-IN',
  bs: 'bs-BA',
  bg: 'bg-BG',
  ca: 'ca-ES',
  ceb: 'ceb-PH',
  ny: 'ny-MW',
  co: 'co-FR',
  hr: 'hr-HR',
  dv: 'dv-MV',
  doi: 'doi-IN',
  eo: 'eo-001',
  et: 'et-EE',
  ee: 'ee-GH',
  fy: 'fy-NL',
  gl: 'gl-ES',
  ka: 'ka-GE',
  gn: 'gn-PY',
  ht: 'ht-HT',
  ha: 'ha-NG',
  haw: 'haw-US',
  hmn: 'hmn-001',
  is: 'is-IS',
  ig: 'ig-NG',
  ilo: 'ilo-PH',
  ga: 'ga-IE',
  jv: 'jv-ID',
  jw: 'jv-ID', // Google legacy code for Javanese
  kk: 'kk-KZ',
  km: 'km-KH',
  rw: 'rw-RW',
  kok: 'kok-IN',
  kri: 'kri-SL',
  ku: 'ku-TR',
  ckb: 'ckb-IQ',
  ky: 'ky-KG',
  lo: 'lo-LA',
  la: 'la-VA',
  lv: 'lv-LV',
  ln: 'ln-CD',
  lt: 'lt-LT',
  lg: 'lg-UG',
  lb: 'lb-LU',
  mk: 'mk-MK',
  mai: 'mai-IN',
  mg: 'mg-MG',
  mt: 'mt-MT',
  mi: 'mi-NZ',
  mn: 'mn-MN',
  my: 'my-MM',
  ne: 'ne-NP',
  or: 'or-IN',
  om: 'om-ET',
  ps: 'ps-AF',
  qu: 'qu-PE',
  sm: 'sm-WS',
  sa: 'sa-IN',
  gd: 'gd-GB',
  nso: 'nso-ZA',
  sr: 'sr-RS',
  st: 'st-ZA',
  sn: 'sn-ZW',
  sd: 'sd-PK',
  si: 'si-LK',
  sk: 'sk-SK',
  sl: 'sl-SI',
  so: 'so-SO',
  su: 'su-ID',
  tg: 'tg-TJ',
  tt: 'tt-RU',
  ti: 'ti-ET',
  ts: 'ts-ZA',
  tk: 'tk-TM',
  ak: 'ak-GH',
  ug: 'ug-CN',
  uz: 'uz-UZ',
  cy: 'cy-GB',
  xh: 'xh-ZA',
  yi: 'yi-001',
  yo: 'yo-NG',
  zu: 'zu-ZA',
};

// Helper to look up language by code
export function getLanguageByCode(code: string): SupportedLanguage {
  if (!code) return SUPPORTED_LANGUAGES[0];
  const clean = code.trim().toLowerCase();

  // 1. Check alias table
  if (LANG_CODE_ALIASES[clean]) {
    const aliased = SUPPORTED_LANGUAGES.find((l) => l.code === LANG_CODE_ALIASES[clean]);
    if (aliased) return aliased;
  }

  // 2. Exact match
  const exact = SUPPORTED_LANGUAGES.find((l) => l.code.toLowerCase() === clean);
  if (exact) return exact;

  // 3. Match prefix (e.g. "es" matches "es-ES", "ar" matches "ar-EG")
  const primaryTag = clean.split('-')[0].split('_')[0];
  const prefixMatch = SUPPORTED_LANGUAGES.find((l) =>
    l.code.toLowerCase().startsWith(primaryTag + '-')
  );
  if (prefixMatch) return prefixMatch;

  return SUPPORTED_LANGUAGES[0];
}

// Find a voice by ID across all languages
export function getVoiceById(voiceId: string) {
  for (const lang of SUPPORTED_LANGUAGES) {
    const match = lang.voices.find((v) => v.id === voiceId);
    if (match) return { voice: match, language: lang };
  }
  return {
    voice: SUPPORTED_LANGUAGES[0].voices[0],
    language: SUPPORTED_LANGUAGES[0],
  };
}

// Detect language from text script
export function detectLanguageFromText(text: string): SupportedLanguage {
  const trimmed = text.trim();
  if (!trimmed) return SUPPORTED_LANGUAGES[0];

  // Arabic / Persian / Urdu / Pashto / Sindhi / Uyghur script
  if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'ar-EG') || SUPPORTED_LANGUAGES[0];
  }
  // Japanese (Hiragana / Katakana)
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'ja-JP') || SUPPORTED_LANGUAGES[0];
  }
  // Chinese (Hanzi)
  if (/[\u4E00-\u9FFF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'zh-CN') || SUPPORTED_LANGUAGES[0];
  }
  // Korean (Hangul)
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'ko-KR') || SUPPORTED_LANGUAGES[0];
  }
  // Hebrew / Yiddish script
  if (/[\u0590-\u05FF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'he-IL') || SUPPORTED_LANGUAGES[0];
  }
  // Cyrillic (Russian, Ukrainian, etc.)
  if (/[\u0400-\u04FF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'ru-RU') || SUPPORTED_LANGUAGES[0];
  }
  // Greek
  if (/[\u0370-\u03FF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'el-GR') || SUPPORTED_LANGUAGES[0];
  }
  // Devanagari (Hindi, Marathi, Nepali, Sanskrit)
  if (/[\u0900-\u097F]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'hi-IN') || SUPPORTED_LANGUAGES[0];
  }
  // Bengali / Assamese
  if (/[\u0980-\u09FF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'bn-BD') || SUPPORTED_LANGUAGES[0];
  }
  // Tamil
  if (/[\u0B80-\u0BFF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'ta-IN') || SUPPORTED_LANGUAGES[0];
  }
  // Telugu
  if (/[\u0C00-\u0C7F]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'te-IN') || SUPPORTED_LANGUAGES[0];
  }
  // Kannada
  if (/[\u0C80-\u0CFF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'kn-IN') || SUPPORTED_LANGUAGES[0];
  }
  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'ml-IN') || SUPPORTED_LANGUAGES[0];
  }
  // Thai
  if (/[\u0E00-\u0E7F]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'th-TH') || SUPPORTED_LANGUAGES[0];
  }
  // Khmer
  if (/[\u1780-\u17FF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'km-KH') || SUPPORTED_LANGUAGES[0];
  }
  // Georgian
  if (/[\u10A0-\u10FF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'ka-GE') || SUPPORTED_LANGUAGES[0];
  }
  // Armenian
  if (/[\u0530-\u058F]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'hy-AM') || SUPPORTED_LANGUAGES[0];
  }
  // Amharic (Ethiopic)
  if (/[\u1200-\u137F]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'am-ET') || SUPPORTED_LANGUAGES[0];
  }

  // European language diacritic & common word clues
  const lower = trimmed.toLowerCase();
  if (
    /[éàèùâêîôûçëïüœæ]/.test(lower) ||
    /\b(bonjour|bonsoir|salut|merci|comment|je suis|j'ai|c'est|s'il vous|oui|nous sommes|vous êtes|au revoir|mon nom)\b/.test(lower)
  ) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'fr-FR') || SUPPORTED_LANGUAGES[0];
  }
  if (
    /[äöüß]/.test(lower) ||
    /\b(guten morgen|guten tag|gute nacht|danke|bitte|ich bin|ich heiße|wie geht|sehr gut|nicht|auf wiedersehen|tschüss)\b/.test(lower)
  ) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'de-DE') || SUPPORTED_LANGUAGES[0];
  }
  if (
    /[áéíóúñ¿¡]/.test(lower) ||
    /\b(hola|gracias|buenos dias|buenas tardes|buenas noches|por favor|como estas|me llamo|mucho gusto|amigo|adios)\b/.test(lower)
  ) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'es-ES') || SUPPORTED_LANGUAGES[0];
  }
  if (
    /\b(ciao|grazie|buongiorno|buonasera|come stai|mi chiamo|piacere|arrivederci|per favore|molto bene)\b/.test(lower)
  ) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'it-IT') || SUPPORTED_LANGUAGES[0];
  }
  if (
    /[ãõç]/.test(lower) ||
    /\b(obrigado|obrigada|bom dia|boa tarde|boa noite|tudo bem|como vai|meu nome)\b/.test(lower)
  ) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'pt-BR') || SUPPORTED_LANGUAGES[0];
  }
  if (
    /[ğışçöü]/.test(lower) ||
    /\b(merhaba|teşekkür|tesekkur|günaydın|gunaydin|nasılsın|nasilsin|benim adım|benim adim)\b/.test(lower)
  ) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'tr-TR') || SUPPORTED_LANGUAGES[0];
  }

  // Default to English
  return SUPPORTED_LANGUAGES.find((l) => l.code === 'en-US') || SUPPORTED_LANGUAGES[0];
}
