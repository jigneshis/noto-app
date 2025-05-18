
'use client';

import type { Deck, Flashcard } from './types';

const DECKS_STORAGE_KEY = 'cardWeaverDecks';

export function getDecks(): Deck[] {
  if (typeof window === 'undefined') return [];
  const storedDecks = localStorage.getItem(DECKS_STORAGE_KEY);
  const decks = storedDecks ? JSON.parse(storedDecks) : [];
  // Ensure all flashcards have a status, default to 'learning'
  return decks.map((deck: Deck) => ({
    ...deck,
    flashcards: deck.flashcards.map(fc => ({
      ...fc,
      status: fc.status || 'learning' 
    }))
  }));
}

export function getDeck(id: string): Deck | undefined {
  const decks = getDecks();
  const deck = decks.find(deck => deck.id === id);
  if (deck) {
    return {
      ...deck,
      flashcards: deck.flashcards.map(fc => ({
        ...fc,
        status: fc.status || 'learning'
      }))
    };
  }
  return undefined;
}

export function saveDeck(deckToSave: Deck): Deck {
  const decks = getDecks();
  const existingDeckIndex = decks.findIndex(d => d.id === deckToSave.id);
  const now = new Date().toISOString();

  const completeDeckData: Deck = {
      ...deckToSave,
      updatedAt: now,
      createdAt: existingDeckIndex > -1 ? decks[existingDeckIndex].createdAt : now,
      // Ensure flashcards array exists and new flashcards get a default status
      flashcards: (deckToSave.flashcards || []).map(fc => ({
        ...fc,
        id: fc.id || crypto.randomUUID(), // Ensure ID for new cards if not present
        status: fc.status || 'learning'
      })),
      accentColor: deckToSave.accentColor || undefined, 
  };

  if (existingDeckIndex > -1) {
    // Preserve original flashcards if not explicitly provided, but merge status
    const originalFlashcards = decks[existingDeckIndex].flashcards;
    completeDeckData.flashcards = deckToSave.flashcards.length > 0 
      ? deckToSave.flashcards.map(fc => ({...fc, status: fc.status || 'learning'})) 
      : originalFlashcards.map(fc => ({...fc, status: fc.status || 'learning'}));
  }
  
  if (existingDeckIndex > -1) {
    decks[existingDeckIndex] = completeDeckData;
  } else {
    decks.push(completeDeckData);
  }
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
  return completeDeckData;
}

export function deleteDeck(id: string): void {
  let decks = getDecks();
  decks = decks.filter(deck => deck.id !== id);
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
}

export function addFlashcardToDeck(deckId: string, flashcard: Omit<Flashcard, 'id' | 'status'> & { status?: Flashcard['status'] }): Flashcard | undefined {
  const deck = getDeck(deckId);
  if (!deck) return undefined;

  const newFlashcard: Flashcard = {
    ...flashcard,
    id: crypto.randomUUID(),
    status: flashcard.status || 'learning', // Default status
  };
  deck.flashcards.push(newFlashcard);
  saveDeck(deck);
  return newFlashcard;
}

export function updateFlashcardInDeck(deckId: string, updatedFlashcard: Flashcard): Flashcard | undefined {
  const deck = getDeck(deckId);
  if (!deck) return undefined;

  const flashcardIndex = deck.flashcards.findIndex(fc => fc.id === updatedFlashcard.id);
  if (flashcardIndex > -1) {
    deck.flashcards[flashcardIndex] = { ...updatedFlashcard, status: updatedFlashcard.status || 'learning' };
    saveDeck(deck);
    return updatedFlashcard;
  }
  return undefined;
}

export function deleteFlashcardFromDeck(deckId: string, flashcardId: string): void {
  const deck = getDeck(deckId);
  if (!deck) return;

  deck.flashcards = deck.flashcards.filter(fc => fc.id !== flashcardId);
  saveDeck(deck);
}

export function generateSampleData(): void {
  if (typeof window === 'undefined') return;
  if (getDecks().length > 0) return;

  const sampleDecks: Deck[] = [
    {
      id: crypto.randomUUID(),
      name: 'JavaScript Basics',
      description: 'Fundamental concepts of JavaScript programming.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flashcards: [
        { id: crypto.randomUUID(), title: 'Variable Declaration', front: 'How do you declare a variable in JavaScript?', back: 'Using var, let, or const keywords.', status: 'learning' },
        { id: crypto.randomUUID(), title: 'Data Types', front: 'Name three primitive data types in JavaScript.', back: 'String, Number, Boolean (also: null, undefined, Symbol, BigInt).', status: 'mastered' },
      ],
      accentColor: "240 60% 60%", 
    },
    {
      id: crypto.randomUUID(),
      name: 'World Capitals',
      description: 'Learn the capitals of various countries.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flashcards: [
        { id: crypto.randomUUID(), title: 'France', front: 'What is the capital of France?', back: 'Paris', status: 'learning' },
        { id: crypto.randomUUID(), title: 'Japan', front: 'What is the capital of Japan?', back: 'Tokyo', status: 'learning' },
        { id: crypto.randomUUID(), title: 'Canada', front: 'What is the capital of Canada?', back: 'Ottawa', status: 'mastered' },
      ],
      accentColor: "120 60% 45%", 
    },
    {
      id: crypto.randomUUID(),
      name: 'Solar System Facts',
      description: 'Explore planets and celestial bodies.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flashcards: [
        { id: crypto.randomUUID(), title: 'Largest Planet', front: 'What is the largest planet in our solar system?', back: 'Jupiter', status: 'learning' },
        { id: crypto.randomUUID(), title: 'Hottest Planet', front: 'What is the hottest planet in our solar system?', back: 'Venus', status: 'learning' },
      ],
    },
  ];
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(sampleDecks));
}
