import { VocabularyItem } from '../types.ts';

// Clean initial state: No pre-filled unwanted words or forced Arabic translations
export const INITIAL_VOCABULARY: VocabularyItem[] = [];

export const PRESET_PACKS = [
  {
    name: 'Everyday Essentials (English - Spanish)',
    items: [
      { english: 'Hello', arabic: 'Hola' },
      { english: 'Thank you', arabic: 'Gracias' },
      { english: 'Please', arabic: 'Por favor' },
      { english: 'Welcome', arabic: 'Bienvenido' },
      { english: 'Good morning', arabic: 'Buenos días' },
    ],
  },
  {
    name: 'Business & Meetings (English - French)',
    items: [
      { english: 'Meeting', arabic: 'Réunion' },
      { english: 'Deadline', arabic: 'Date limite' },
      { english: 'Opportunity', arabic: 'Opportunité' },
      { english: 'Agreement', arabic: 'Accord' },
      { english: 'Strategy', arabic: 'Stratégie' },
    ],
  },
  {
    name: 'Travel & Exploration (English - German)',
    items: [
      { english: 'Airport', arabic: 'Flughafen' },
      { english: 'Train station', arabic: 'Bahnhof' },
      { english: 'Hotel reservation', arabic: 'Hotelreservierung' },
      { english: 'Ticket', arabic: 'Fahrkarte' },
      { english: 'Passport', arabic: 'Reisepass' },
    ],
  },
  {
    name: 'Everyday Conversation (English - Italian)',
    items: [
      { english: 'Delicious', arabic: 'Delizioso' },
      { english: 'Beautiful', arabic: 'Bellissimo' },
      { english: 'See you soon', arabic: 'A presto' },
      { english: 'Have a great day', arabic: 'Buona giornata' },
      { english: 'My friend', arabic: 'Amico mio' },
    ],
  },
];
