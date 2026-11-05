# Bilingual Vocabulary Pronunciation Trainer (American English & Egyptian Arabic)

An interactive language acquisition app tailored for Arabic speakers learning English vocabulary. Words are pronounced twice in a clear American male voice, followed by the Egyptian Arabic translation spoken naturally via Gemini AI speech synthesis. Users can quickly enter words as `English, Arabic`, listen to automated sequential playback, or practice with interactive flashcards.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions were confirmed through Phase 1 clarification:
> - **English Pronunciation Voice**: Clear American Male voice (using optimized Web Speech API US male voice with high clarity, e.g. Natural/David/Google US English Male with pitch and rate fine-tuning).
> - **Arabic Translation Voice & Dialect**: Natural AI speech generation powered by Gemini (`gemini-3.8-flash-lite-tts`) specifically instructed for natural, conversational Egyptian colloquial Arabic dialect (`اللهجة المصرية`), with seamless audio streaming and browser cache for instant replays.
> - **Dual Training Modes**: Both **Continuous Sequential Auto-Playback** (with custom inter-word pauses and speed controls) and **Interactive Flashcards Mode** (flip to reveal, self-paced pronunciation, pronunciation score, and mastered tags).

---

## 1. Overview & Core Concept

- **What It Does**:
  - Accepts vocabulary input formatted simply as `English word, Arabic word` (single entry or multiline bulk paste, with smart comma/tab/dash normalization).
  - Implements the exact requested audio pattern: **[English 1x] ➔ [Brief Pause] ➔ [English 2x] ➔ [Pause] ➔ [Egyptian Arabic 1x]**.
  - Provides a **Voice Studio** drawer allowing real-time voice auditioning, pitch/speed adjustment, and switching between AI generated Egyptian audio and system voices.
  - Supports quick preloaded starter decks (Everyday Conversation, Tech & Work, Travel, Food & Dining) to let users test instantly without typing.
- **Target Audience**: Arabic speakers, Egyptian learners, and bilingual students aiming to master American English pronunciation with familiar Egyptian Arabic translations.
- **Key Value**: Eliminates mechanical, robotic TTS and replaces it with native-cadence American male English pronunciation paired with warm, authentic Egyptian spoken translations, reinforcing auditory memory through spaced immediate repetition (2x English + 1x Arabic).

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Vocabulary Entry & Import**:
   - Single-word quick bar: Type `schedule, جدول مواعيد` and press Enter.
   - Bulk Input Modal / Drawer: Paste dozens of lines like `apple, تفاحة \n book, كتاب \n awesome, حاجة تحفة` with live preview and validation count.
2. **Sequential Auto-Playback**:
   - Visual waveform/audio ring pulses when English plays (Cycle 1 / 2 indicator).
   - Card highlights with smooth transition when the Egyptian Arabic translation plays.
   - Seamless progression to the next word with play/pause, speed (0.75x, 1x, 1.25x), and repeat controls.
3. **Interactive Flashcard Mode**:
   - Flip card between English word (phonetics + sample sentence) and Egyptian Arabic meaning.
   - Dedicated buttons to trigger: "Play English (2x)", "Play Egyptian (1x)", or "Full Sequence".
   - Marking cards as "Learning" or "Mastered".
4. **Voice Studio & Settings**:
   - Audition the American Male voice with test phrases.
   - Test Egyptian Arabic synthesis with authentic phrasing.
   - Adjust pause duration between repetitions (e.g., 0.5s to 2s).

### Visual Identity & Theme
- **Aesthetic Direction**: Modern educational studio, warm minimalist academic feel, distraction-free typography and crisp acoustic visualizers.
- **Color Palette**:
  - Dominant Canvas (60%): Slate deep dark mode canvas (`#0b0f19`) and soft white paper mode (`#f8fafc`).
  - Structural Panels (30%): Rich midnight slate (`#131c2e`), crisp border dividers (`#1e293b`), and calm cards (`#182338`).
  - Semantic Accents (10%): Royal Indigo/Azure for English speech waves (`#3b82f6` / `#6366f1`) and warm Terracotta/Amber Gold for Egyptian Arabic translations (`#f59e0b` / `#d97706`).
- **Typography**:
  - Display & English: `Plus Jakarta Sans` / `Outfit` (clean geometric clarity).
  - Arabic Typography: `Cairo` / `Tajawal` / system Arabic sans with balanced line-height.
  - Tabular counters & timers: `tabular-nums` for playback progress and intervals.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Audio Engine (Server Gemini TTS + Client SpeechSynthesis)**
  - *Chosen Approach*: Server-side `/api/tts` proxy using `@google/genai` (`gemini-3.8-flash-lite-tts`) with custom prompt instructions for authentic Egyptian Arabic dialect nuances and phonetics. Client-side audio caching in memory / IndexedDB so repeated playbacks are instantaneous and zero-cost. Client Web Speech API for American Male voice provides zero-latency instant response.
  - *Why*: Web Speech API standard Arabic voices often sound stiff or classical Modern Standard Arabic (Fusha), whereas Gemini 3.8 Flash Lite TTS generates fluid, authentic Egyptian colloquial pronunciation.
  - *Alternative Considered*: Browser-only TTS (lacks authentic Egyptian dialect cadences).
- **Decision 2: Smart Comma Separator Parser**
  - *Chosen Approach*: Tolerates English comma `,`, Arabic comma `،`, tabs, or ` - ` hyphens, trimming whitespace and validating both tokens before adding to list.
- **Decision 3: Local Storage Persistence**
  - *Chosen Approach*: User word lists, playback preferences (speed, pause duration), and progress are stored in `localStorage`, so no sign-up is required and data persists across sessions.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Frontend                        │
│                                                             │
│  ┌────────────────────┐   ┌──────────────────────────────┐  │
│  │   Top Bar Navbar   │   │  Audio Controller & Engine   │  │
│  │ Brand / Mode / Vibe│   │  EN (2x) -> Pause -> AR (1x) │  │
│  └────────────────────┘   └───────────────┬──────────────┘  │
│                                           │                 │
│  ┌────────────────────────────────────────┼──────────────┐  │
│  │            Views & Interactions        ▼              │  │
│  │  - Bulk Input & Quick Input (EN, AR)                  │  │
│  │  - Sequential Auto-Player (Active Word Highlight)     │  │
│  │  - Interactive Flashcards (Flip, Practice, Rate)      │  │
│  │  - Voice Studio (Preview American Male & Egyptian)    │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────┘
                                │ POST /api/tts (Arabic text)
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express Server (server.ts)                  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  @google/genai SDK (gemini-3.8-flash-lite-tts)         │  │
│  │  Style: "Lively, clear Egyptian Arabic pronunciation" │  │
│  │  Returns: Audio base64 / WAV binary                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown
1. `src/components/Navbar.tsx`: Top bar adhering to 3-zone contract with Mode Switcher (Continuous Player / Flashcards / Word List) and Voice Studio button.
2. `src/components/AudioEngine.ts`: State machine coordinating:
   - Play English 1st time ➔ delay 600ms
   - Play English 2nd time ➔ delay 800ms
   - Play Egyptian Arabic translation 1st time ➔ delay 1200ms
   - Auto-advance to next word if sequential mode is on.
3. `src/components/WordInput.tsx`: Real-time word input supporting single `word, كلمة` input and bulk multi-line importer with presets.
4. `src/components/ContinuousPlayer.tsx`: Hero visualizer card showing current word, repetition status badge (English #1, English #2, Arabic translation), playback controls, scrub progress, and playlist.
5. `src/components/FlashcardDeck.tsx`: 3D flipping card for active self-testing with repetition sound triggers.
6. `src/components/VoiceStudioModal.tsx`: Live voice test panel to audition the American male voice and Egyptian Arabic AI voice with pitch and rate sliders.
7. `server.ts`: Secure server handling `/api/tts` for Gemini audio generation.
