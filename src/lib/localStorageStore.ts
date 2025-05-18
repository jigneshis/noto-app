
'use client';

import type { Deck, Flashcard } from './types';

const DECKS_STORAGE_KEY = 'cardWeaverDecks';

export function getDecks(): Deck[] {
  if (typeof window === 'undefined') return [];
  const storedDecks = localStorage.getItem(DECKS_STORAGE_KEY);
  return storedDecks ? JSON.parse(storedDecks) : [];
}

export function getDeck(id: string): Deck | undefined {
  const decks = getDecks();
  return decks.find(deck => deck.id === id);
}

export function saveDeck(deckToSave: Deck): Deck {
  const decks = getDecks();
  const existingDeckIndex = decks.findIndex(d => d.id === deckToSave.id);
  const now = new Date().toISOString();

  const completeDeckData = {
      ...deckToSave,
      updatedAt: now,
      createdAt: existingDeckIndex > -1 ? decks[existingDeckIndex].createdAt : now,
      flashcards: existingDeckIndex > -1 ? decks[existingDeckIndex].flashcards : (deckToSave.flashcards || []),
      accentColor: deckToSave.accentColor || undefined, // Ensure accentColor is handled
  };


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

export function addFlashcardToDeck(deckId: string, flashcard: Omit<Flashcard, 'id'>): Flashcard | undefined {
  const deck = getDeck(deckId);
  if (!deck) return undefined;

  const newFlashcard: Flashcard = {
    ...flashcard,
    id: crypto.randomUUID(),
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
    deck.flashcards[flashcardIndex] = updatedFlashcard;
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
  // Only generate if no decks exist at all
  if (getDecks().length > 0) return;


  const sampleDecks: Deck[] = [
    {
      id: crypto.randomUUID(),
      name: 'JavaScript Basics',
      description: 'Fundamental concepts of JavaScript programming.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flashcards: [
        { id: crypto.randomUUID(), title: 'Variable Declaration', front: 'How do you declare a variable in JavaScript?', back: 'Using var, let, or const keywords.' },
        { id: crypto.randomUUID(), title: 'Data Types', front: 'Name three primitive data types in JavaScript.', back: 'String, Number, Boolean (also: null, undefined, Symbol, BigInt).' },
      ],
      accentColor: "240 60% 60%", // Sample Blue
    },
    {
      id: crypto.randomUUID(),
      name: 'World Capitals',
      description: 'Learn the capitals of various countries.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flashcards: [
        { id: crypto.randomUUID(), title: 'France', front: 'What is the capital of France?', back: 'Paris' },
        { id: crypto.randomUUID(), title: 'Japan', front: 'What is the capital of Japan?', back: 'Tokyo' },
        { id: crypto.randomUUID(), title: 'Canada', front: 'What is the capital of Canada?', back: 'Ottawa' },
      ],
      accentColor: "120 60% 45%", // Sample Green
    },
    {
      id: crypto.randomUUID(),
      name: 'Solar System Facts',
      description: 'Explore planets and celestial bodies.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flashcards: [
        { id: crypto.randomUUID(), title: 'Largest Planet', front: 'What is the largest planet in our solar system?', back: 'Jupiter' },
        { id: crypto.randomUUID(), title: 'Hottest Planet', front: 'What is the hottest planet in our solar system?', back: 'Venus' },
      ],
      // No accentColor, will use default
    },
  ];
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(sampleDecks));
}
