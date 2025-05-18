
export interface Flashcard {
  id: string;
  title: string;
  front: string; // Question
  back: string;  // Answer
  status?: 'learning' | 'mastered'; // New field for prioritization
}

export interface Deck {
  id:string;
  name: string;
  description?: string;
  flashcards: Flashcard[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  accentColor?: string; // HSL string, e.g., "210 90% 50%"
}
