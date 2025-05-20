
'use client';

import type { Deck, Flashcard, Note } from './types'; // Added Note

const DECKS_STORAGE_KEY = 'notoDecks';
const NOTES_STORAGE_KEY = 'notoNotes';

// --- Deck Functions ---
export function getDecks(): Deck[] {
  if (typeof window === 'undefined') return [];
  const storedDecks = localStorage.getItem(DECKS_STORAGE_KEY);
  const decks = storedDecks ? JSON.parse(storedDecks) : [];
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
    completeDeckData.flashcards = deckToSave.flashcards.length > 0
      ? deckToSave.flashcards.map(fc => ({
          ...fc,
          id: fc.id || crypto.randomUUID(),
          status: fc.status || 'learning',
          frontImage: fc.frontImage || undefined,
          backImage: fc.backImage || undefined,
        }))
      : decks[existingDeckIndex].flashcards.map(fc => ({
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

export function addFlashcardToDeck(deckId: string, flashcard: Omit<Flashcard, 'id' | 'status'> & { status?: Flashcard['status'], frontImage?: string, backImage?: string }): Flashcard | undefined {
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

// --- Note Functions ---
export function getNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
  const notes = storedNotes ? JSON.parse(storedNotes) : [];
  return notes.map((note: Note) => ({
    ...note,
    tags: note.tags || [],
    accentColor: note.accentColor || undefined,
    createdAt: note.createdAt || new Date().toISOString(),
    updatedAt: note.updatedAt || new Date().toISOString(),
    isPinned: note.isPinned || false, // Ensure isPinned defaults to false
  }));
}

export function getNote(id: string): Note | undefined {
  const notes = getNotes();
  return notes.find(n => n.id === id);
}

export function saveNote(noteToSave: Note): Note {
  const notes = getNotes();
  const existingNoteIndex = notes.findIndex(n => n.id === noteToSave.id);
  const now = new Date().toISOString();

  const completeNoteData: Note = {
    ...noteToSave,
    updatedAt: now,
    createdAt: existingNoteIndex > -1 ? notes[existingNoteIndex].createdAt : now,
    tags: noteToSave.tags || [],
    accentColor: noteToSave.accentColor || undefined,
    isPinned: noteToSave.isPinned || false, // Ensure isPinned is saved
  };

  if (existingNoteIndex > -1) {
    notes[existingNoteIndex] = completeNoteData;
  } else {
    notes.push(completeNoteData);
  }
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  return completeNoteData;
}

export function deleteNote(id: string): void {
  let notes = getNotes();
  notes = notes.filter(note => note.id !== id);
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}
