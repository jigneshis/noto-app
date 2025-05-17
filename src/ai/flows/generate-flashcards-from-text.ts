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
  prompt: `You are an expert educator specializing in creating effective flashcards.

  Given the following text or topic, generate a set of flashcards. Each flashcard should have a title, a front (question), and a back (answer).

  Text/Topic: {{{text}}}

  Ensure that the flashcards are clear, concise, and cover the key concepts from the input.

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
