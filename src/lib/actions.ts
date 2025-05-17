
'use server';
import { generateFlashcardsFromText as generateFlashcardsFromTextFlow } from '@/ai/flows/generate-flashcards-from-text';
import { summarizeContentIntoFlashcards as summarizeContentIntoFlashcardsFlow } from '@/ai/flows/summarize-content-into-flashcards';
import { explainContentSimply as explainContentSimplyFlow } from '@/ai/flows/explain-content-simply';
import type { Flashcard } from './types';

export async function generateFlashcardsFromTextAction(text: string): Promise<Omit<Flashcard, 'id'>[]> {
  try {
    const result = await generateFlashcardsFromTextFlow({ text });
    // The AI flow already returns title, front, back. ID will be added client-side.
    return result.flashcards.map(fc => ({ title: fc.title, front: fc.front, back: fc.back }));
  } catch (error) {
    console.error("Error generating flashcards from text:", error);
    let errorMessage = "Failed to generate flashcards using AI.";
    if (error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}

export async function summarizeContentIntoFlashcardsAction(content: string): Promise<Omit<Flashcard, 'id'>[]> {
   try {
    const result = await summarizeContentIntoFlashcardsFlow({ content });
     // The AI flow already returns title, front, back. ID will be added client-side.
    return result.map(fc => ({ title: fc.title, front: fc.front, back: fc.back }));
  } catch (error) {
    console.error("Error summarizing content into flashcards:", error);
    let errorMessage = "Failed to summarize content using AI.";
    if (error instanceof Error) {
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
    if (error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}

