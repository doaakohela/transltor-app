import { SupportedLanguage } from '../types.ts';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
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
        badge: 'Podcast Style 🎙️',
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
      {
        id: 'en-US-EricNeural',
        name: 'Eric (Male) - Energetic Youthful Tone',
        gender: 'male',
        country: 'United States',
        description: 'Modern, fast-paced conversational delivery',
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
        id: 'ar-LB-LaylaNeural',
        name: 'Layla (Female) - Warm Levant Podcast Tone',
        gender: 'female',
        country: 'Lebanon',
        description: 'Gentle, soothing female voice popular for audiobooks and podcasts',
        samplePhrase: 'كآبة وخنقة، فرصة ممتازة، حاجة تحفة بجد، ولا يهمك يا سيدي.',
        badge: 'Podcast Female 🎙️',
      },
      {
        id: 'ar-EG-SalmaNeural',
        name: 'Salma (Female) - Official Egyptian Female',
        gender: 'female',
        country: 'Egypt',
        description: 'Official Microsoft Egyptian neural female engine',
        samplePhrase: 'كآبة وخنقة، فرصة ممتازة، حاجة تحفة بجد، ولا يهمك يا سيدي.',
        badge: 'Egyptian Female 🇪🇬',
      },
      {
        id: 'ar-JO-SanaNeural',
        name: 'Sana (Female) - Studio Clarity',
        gender: 'female',
        country: 'Jordan',
        description: 'Crisp studio female voice with perfect articulation',
        samplePhrase: 'كآبة وخنقة، فرصة ممتازة، حاجة تحفة بجد، ولا يهمك يا سيدي.',
      },
      {
        id: 'ar-SY-AmanyNeural',
        name: 'Amany (Female) - Melodious Syrian Tone',
        gender: 'female',
        country: 'Syria',
        description: 'Warm, melodious voice comfortable for repeat listening',
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
        name: 'Zariyah (Female) - Saudi Professional',
        gender: 'female',
        country: 'Saudi Arabia',
        description: 'Clear, modern standard Arabic tone',
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
    name: 'Chinese (Mandarin)',
    nativeName: '中文 (普通话) 🇨🇳',
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
      {
        id: 'sv-SE-MattiasNeural',
        name: 'Mattias (Male) - Swedish Male',
        gender: 'male',
        country: 'Sweden',
        description: 'Natural, friendly Swedish male voice',
        samplePhrase: 'Hej, underbart, möjlighet, tålamod, tack så mycket.',
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
      {
        id: 'el-GR-NestorasNeural',
        name: 'Nestoras (Male) - Greek Male',
        gender: 'male',
        country: 'Greece',
        description: 'Articulate, deep male voice for modern Greek',
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
      {
        id: 'he-IL-AvriNeural',
        name: 'Avri (Male) - Hebrew Male',
        gender: 'male',
        country: 'Israel',
        description: 'Warm, clear Israeli male voice',
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
      {
        id: 'th-TH-NiwatNeural',
        name: 'Niwat (Male) - Thai Male',
        gender: 'male',
        country: 'Thailand',
        description: 'Clear, friendly Thai male broadcast tone',
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
      {
        id: 'uk-UA-OstapNeural',
        name: 'Ostap (Male) - Ukrainian Male',
        gender: 'male',
        country: 'Ukraine',
        description: 'Resonant, articulate Ukrainian male voice',
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
        description: 'Cheerful, warm standard Filipino Tagalog articulation',
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
    code: 'bn-IN',
    name: 'Bengali (India / Bangladesh)',
    nativeName: 'বাংলা 🇮🇳',
    flag: '🇮🇳',
    script: 'other',
    defaultVoice: 'bn-IN-TanishaaNeural',
    voices: [
      {
        id: 'bn-IN-TanishaaNeural',
        name: 'Tanishaa (Female) - Studio Bengali',
        gender: 'female',
        country: 'India',
        description: 'Sweet, resonant Bengali phrasing',
        samplePhrase: 'নমস্কার, দুর্দান্ত, সুযোগ, অধ্যবসায়.',
      },
    ],
  },
  {
    code: 'ta-IN',
    name: 'Tamil (India / Singapore)',
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
];

// Helper to look up language by code
export function getLanguageByCode(code: string): SupportedLanguage {
  return (
    SUPPORTED_LANGUAGES.find((l) => l.code === code || l.code.startsWith(code) || code.startsWith(l.code.split('-')[0])) ||
    SUPPORTED_LANGUAGES[0]
  );
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

  // Arabic / Persian / Urdu script
  if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'ar-EG') || SUPPORTED_LANGUAGES[0];
  }
  // Japanese (Hiragana / Katakana)
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'ja-JP') || SUPPORTED_LANGUAGES[0];
  }
  // Chinese (Hanzi / Kanji)
  if (/[\u4E00-\u9FFF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'zh-CN') || SUPPORTED_LANGUAGES[0];
  }
  // Korean (Hangul)
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'ko-KR') || SUPPORTED_LANGUAGES[0];
  }
  // Cyrillic (Russian)
  if (/[\u0400-\u04FF]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'ru-RU') || SUPPORTED_LANGUAGES[0];
  }
  // Devanagari (Hindi)
  if (/[\u0900-\u097F]/.test(trimmed)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'hi-IN') || SUPPORTED_LANGUAGES[0];
  }

  // European language clues
  const lower = trimmed.toLowerCase();
  if (/[éàèùâêîôûçëïüœæ]/.test(lower)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'fr-FR') || SUPPORTED_LANGUAGES[0];
  }
  if (/[äöüß]/.test(lower)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'de-DE') || SUPPORTED_LANGUAGES[0];
  }
  if (/[áéíóúñ¿¡]/.test(lower)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'es-ES') || SUPPORTED_LANGUAGES[0];
  }
  if (/[ğışçöü]/.test(lower)) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === 'tr-TR') || SUPPORTED_LANGUAGES[0];
  }

  // Default to English
  return SUPPORTED_LANGUAGES.find((l) => l.code === 'en-US') || SUPPORTED_LANGUAGES[0];
}
