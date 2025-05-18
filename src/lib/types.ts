
export interface Flashcard {
  id: string;
  title: string;
  front: string; // Question
  back: string;  // Answer
  status?: 'learning' | 'mastered';
  frontImage?: string; // Optional base64 data URI for front image
  backImage?: string;  // Optional base64 data URI for back image
}

export interface Deck {
  id:string;
  name: string;
  description?: string;
  flashcards: Flashcard[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  accentColor?: string; // HSL string, e.g., "210 90% 50%"
  tags?: string[];
}

// Type for imported deck structure (can be a single deck or an array of decks)
export type ImportedDecks = Deck | Deck[];
