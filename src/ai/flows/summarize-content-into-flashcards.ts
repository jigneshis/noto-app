'use server';
/**
 * @fileOverview An AI agent that summarizes content into flashcards.
 *
 * - summarizeContentIntoFlashcards - A function that handles the summarization process.
 * - SummarizeContentIntoFlashcardsInput - The input type for the summarizeContentIntoFlashcards function.
 * - SummarizeContentIntoFlashcardsOutput - The return type for the summarizeContentIntoFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContentIntoFlashcardsInputSchema = z.object({
  content: z.string().describe('The content to summarize into flashcards.'),
});
export type SummarizeContentIntoFlashcardsInput = z.infer<typeof SummarizeContentIntoFlashcardsInputSchema>;

const SummarizeContentIntoFlashcardsOutputSchema = z.array(
  z.object({
    title: z.string().describe('The title of the flashcard.'),
    front: z.string().describe('The question or prompt on the front of the flashcard.'),
    back: z.string().describe('The answer or explanation on the back of the flashcard.'),
  })
).describe('An array of flashcards generated from the content.');
export type SummarizeContentIntoFlashcardsOutput = z.infer<typeof SummarizeContentIntoFlashcardsOutputSchema>;

export async function summarizeContentIntoFlashcards(input: SummarizeContentIntoFlashcardsInput): Promise<SummarizeContentIntoFlashcardsOutput> {
  return summarizeContentIntoFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeContentIntoFlashcardsPrompt',
  input: {schema: SummarizeContentIntoFlashcardsInputSchema},
  output: {schema: SummarizeContentIntoFlashcardsOutputSchema},
  prompt: `You are an expert educator that can summarize notes into a set of flashcards. Each flashcard should have a title, a front (question), and a back (answer). Return the list of flashcards as a JSON array.

Content to summarize:\n\n{{content}}`,
});

const summarizeContentIntoFlashcardsFlow = ai.defineFlow(
  {
    name: 'summarizeContentIntoFlashcardsFlow',
    inputSchema: SummarizeContentIntoFlashcardsInputSchema,
    outputSchema: SummarizeContentIntoFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
