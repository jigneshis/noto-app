
'use client';

import type { Deck, Flashcard } from './types';

const DECKS_STORAGE_KEY = 'cardWeaverDecks';

export function getDecks(): Deck[] {
  if (typeof window === 'undefined') return [];
  const storedDecks = localStorage.getItem(DECKS_STORAGE_KEY);
  const decks = storedDecks ? JSON.parse(storedDecks) : [];
  // Ensure all decks have necessary fields with defaults
  return decks.map((deck: Deck) => ({
    ...deck,
    flashcards: (deck.flashcards || []).map(fc => ({
      ...fc,
      status: fc.status || 'learning',
      frontImage: fc.frontImage || undefined,
      backImage: fc.backImage || undefined,
    })),
    tags: deck.tags || [],
    accentColor: deck.accentColor || undefined,
  }));
}

export function getDeck(id: string): Deck | undefined {
  const decks = getDecks();
  const deck = decks.find(d => d.id === id);
  if (deck) {
    return {
      ...deck,
      flashcards: (deck.flashcards || []).map(fc => ({
        ...fc,
        status: fc.status || 'learning',
        frontImage: fc.frontImage || undefined,
        backImage: fc.backImage || undefined,
      })),
      tags: deck.tags || [],
      accentColor: deck.accentColor || undefined,
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
      flashcards: (deckToSave.flashcards || []).map(fc => ({
        ...fc,
        id: fc.id || crypto.randomUUID(),
        status: fc.status || 'learning',
        frontImage: fc.frontImage || undefined,
        backImage: fc.backImage || undefined,
      })),
      tags: deckToSave.tags || [],
      accentColor: deckToSave.accentColor || undefined,
  };

  if (existingDeckIndex > -1) {
    const originalFlashcards = decks[existingDeckIndex].flashcards;
    // Preserve existing flashcards if deckToSave doesn't provide new ones (e.g. when only deck metadata is updated)
    // but ensure new fields like images are potentially updated or kept from deckToSave
     completeDeckData.flashcards = deckToSave.flashcards.length > 0
      ? deckToSave.flashcards.map(fc => ({
          ...fc,
          id: fc.id || crypto.randomUUID(),
          status: fc.status || 'learning',
          frontImage: fc.frontImage || undefined,
          backImage: fc.backImage || undefined,
        }))
      : originalFlashcards.map(fc => ({ // if deckToSave.flashcards is empty, keep original ones
          ...fc,
          status: fc.status || 'learning',
          frontImage: fc.frontImage || undefined,
          backImage: fc.backImage || undefined,
        }));
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
    status: flashcard.status || 'learning',
    frontImage: flashcard.frontImage || undefined,
    backImage: flashcard.backImage || undefined,
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
    deck.flashcards[flashcardIndex] = {
        ...updatedFlashcard,
        status: updatedFlashcard.status || 'learning',
        frontImage: updatedFlashcard.frontImage || undefined,
        backImage: updatedFlashcard.backImage || undefined,
    };
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
