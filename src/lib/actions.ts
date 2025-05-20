
'use server';
import { generateFlashcardsFromText as generateFlashcardsFromTextFlow } from '@/ai/flows/generate-flashcards-from-text';
import { summarizeContentIntoFlashcards as summarizeContentIntoFlashcardsFlow } from '@/ai/flows/summarize-content-into-flashcards';
import { explainContentSimply as explainContentSimplyFlow } from '@/ai/flows/explain-content-simply';
import { generateImageForFlashcard as generateImageForFlashcardFlow } from '@/ai/flows/generate-image-for-flashcard';
import { analyzeNoteContent as analyzeNoteContentFlow } from '@/ai/flows/analyze-note-content'; // New import
import type { Flashcard, NoteAnalysisResult } from './types';

export async function generateFlashcardsFromTextAction(text: string): Promise<Omit<Flashcard, 'id' | 'status'>[]> {
  try {
    const result = await generateFlashcardsFromTextFlow({ text });
    return result.flashcards.map(fc => ({
        title: fc.title,
        front: fc.front,
        back: fc.back,
        frontImage: undefined,
        backImage: undefined,
    }));
  } catch (error) {
    console.error("Error generating flashcards from text:", error);
    let errorMessage = "Failed to generate flashcards using AI.";
    if (error instanceof Error && error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}

export async function summarizeContentIntoFlashcardsAction(content: string): Promise<Omit<Flashcard, 'id' | 'status'>[]> {
   try {
    const result = await summarizeContentIntoFlashcardsFlow({ content });
    return result.map(fc => ({
        title: fc.title,
        front: fc.front,
        back: fc.back,
        frontImage: undefined,
        backImage: undefined,
    }));
  } catch (error) {
    console.error("Error summarizing content into flashcards:", error);
    let errorMessage = "Failed to summarize content using AI.";
     if (error instanceof Error && error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}

export async function explainContentSimplyAction(content: string): Promise<string> {
  try {
    const result = await explainContentSimplyFlow({ content });
    return result.simplifiedExplanation;
  } catch (error) {
    console.error("Error explaining content simply:", error);
    let errorMessage = "Failed to explain content using AI.";
     if (error instanceof Error && error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}

export async function generateImageForFlashcardAction(prompt: string): Promise<string> {
  try {
    const result = await generateImageForFlashcardFlow({ prompt });
    return result.imageDataUri;
  } catch (error) {
    console.error("Error generating image for flashcard:", error);
    let errorMessage = "Failed to generate image using AI.";
    if (error instanceof Error && error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}

export async function analyzeNoteContentAction(noteContent: string): Promise<NoteAnalysisResult> {
  try {
    const result = await analyzeNoteContentFlow({ noteContent });
    return result;
  } catch (error) {
    console.error("Error analyzing note content:", error);
    let errorMessage = "Failed to analyze note content using AI.";
    if (error instanceof Error && error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}
