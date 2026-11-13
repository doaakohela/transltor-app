export interface VocabularyItem {
  id: string;
  sourceText?: string; // The word in the language being learned
  targetText?: string; // The translation/meaning
  // Backward compatibility fields
  english?: string;
  arabic?: string;
  phonetic?: string;
  category?: string;
  notes?: string;
  mastered?: boolean;
  sourceLang?: string;
  targetLang?: string;
  sourceVoice?: string;
  targetVoice?: string;
  createdAt: number;
}

export type VoiceGender = 'female' | 'male';

export interface VoiceOption {
  id: string;
  name: string;
  gender: VoiceGender;
  country: string;
  description: string;
  samplePhrase: string;
  badge?: string;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  script: 'latin' | 'arabic' | 'cjk' | 'cyrillic' | 'devanagari' | 'other';
  defaultVoice: string;
  voices: VoiceOption[];
}

export type GeminiVoiceName = string;

export interface AudioSettings {
  // Multilingual configuration
  sourceLang: string; // e.g. 'en-US'
  targetLang: string; // e.g. 'ar-EG'
  sourceVoice: string; // e.g. 'en-US-GuyNeural'
  targetVoice: string; // e.g. 'ar-EG-SalmaNeural'
  sourceRepeats: number; // default 2 (speaks source word twice)
  targetRepeats: number; // default 1 (speaks target translation once)

  // Backward compatibility aliases
  enVoiceSource?: 'browser' | 'gemini';
  browserVoiceURI?: string;
  enGeminiVoice?: string;
  enPitch?: number;
  enRate?: number;
  arVoiceSource?: 'gemini' | 'browser';
  arGeminiVoice?: string;
  browserArabicVoiceURI?: string;
  arRate?: number;

  // Delays and pauses (ms)
  pauseBetweenSource: number;
  pauseBetweenLanguages: number;
  pauseBetweenWords: number;

  // Legacy timing aliases
  pauseBetweenEn?: number;
  pauseBetweenEnAndAr?: number;

  // Playback behavior
  autoAdvance: boolean;
  loopPlaylist: boolean;
}

export type PlaybackStage =
  | 'idle'
  | 'source_1'
  | 'pause_source'
  | 'source_2'
  | 'pause_target'
  | 'target_1'
  | 'pause_next'
  // Legacy aliases
  | 'en_1'
  | 'pause_en'
  | 'en_2'
  | 'pause_ar'
  | 'ar_1';

export type AppView =
  | 'player'
  | 'flashcards'
  | 'words'
  | 'studio'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'cookies';
