
// src/ai/flows/generate-flashcards-from-text.ts
'use server';

/**
 * @fileOverview Flow for generating flashcards from text or topic.
 *
 * - generateFlashcardsFromText - A function that handles the flashcard generation process.
 * - GenerateFlashcardsFromTextInput - The input type for the generateFlashcardsFromText function.
 * - GenerateFlashcardsFromTextOutput - The return type for the generateFlashcardsFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsFromTextInputSchema = z.object({
  text: z.string().describe('The text or topic to generate flashcards from.'),
});
export type GenerateFlashcardsFromTextInput = z.infer<
  typeof GenerateFlashcardsFromTextInputSchema
>;

const GenerateFlashcardsFromTextOutputSchema = z.object({
  flashcards: z
    .array(
      z.object({
        title: z.string().describe('The title of the flashcard.'),
        front: z.string().describe('The question or prompt on the front of the flashcard.'),
        back: z.string().describe('The answer or explanation on the back of the flashcard.'),
      })
    )
    .describe('The generated flashcards.'),
});
export type GenerateFlashcardsFromTextOutput = z.infer<
  typeof GenerateFlashcardsFromTextOutputSchema
>;

export async function generateFlashcardsFromText(
  input: GenerateFlashcardsFromTextInput
): Promise<GenerateFlashcardsFromTextOutput> {
  return generateFlashcardsFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsFromTextPrompt',
  input: {schema: GenerateFlashcardsFromTextInputSchema},
  output: {schema: GenerateFlashcardsFromTextOutputSchema},
  prompt: `You are an expert educator specializing in creating comprehensive and effective flashcards.

  Given the following text or topic, generate a set of flashcards.
  If a broad topic is provided (e.g., 'Key Concepts of Photosynthesis', 'JavaScript ES6 Features', 'Important Events of World War II'), act as a subject matter expert. Create a thorough set of flashcards covering the core aspects, key definitions, important examples, and relevant details for that topic. Aim for at least 5-10 flashcards for broader topics if appropriate.
  If a specific text is provided, summarize it into key flashcards.

  Each flashcard should have a concise title, a clear front (question or concept), and an accurate back (answer or explanation).

  Text/Topic: {{{text}}}

  Ensure that the flashcards are clear, concise, and cover the key concepts comprehensively.
  Your output should be an array of flashcards, each with a title, front, and back.
  `,
});

const generateFlashcardsFromTextFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFromTextFlow',
    inputSchema: GenerateFlashcardsFromTextInputSchema,
    outputSchema: GenerateFlashcardsFromTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
