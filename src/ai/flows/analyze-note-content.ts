
'use server';
/**
 * @fileOverview AI flow to summarize note content and extract keywords.
 *
 * - analyzeNoteContent - A function that summarizes content and extracts keywords.
 * - AnalyzeNoteContentInput - The input type for the function.
 * - AnalyzeNoteContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNoteContentInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to be analyzed.'),
});
export type AnalyzeNoteContentInput = z.infer<typeof AnalyzeNoteContentInputSchema>;

const AnalyzeNoteContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the note content.'),
  keywords: z.array(z.string()).describe('A list of relevant keywords extracted from the note content (3-5 keywords).'),
});
export type AnalyzeNoteContentOutput = z.infer<typeof AnalyzeNoteContentOutputSchema>;

export async function analyzeNoteContent(input: AnalyzeNoteContentInput): Promise<AnalyzeNoteContentOutput> {
  return analyzeNoteContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNoteContentPrompt',
  input: {schema: AnalyzeNoteContentInputSchema},
  output: {schema: AnalyzeNoteContentOutputSchema},
  prompt: `You are an expert at analyzing text to provide concise summaries and relevant keywords.
  Given the following note content, please:
  1. Generate a brief summary (2-3 sentences).
  2. Extract 3 to 5 main keywords from the content.

  Note Content:
  {{{noteContent}}}

  Return the summary and keywords in the specified JSON format.
  `,
});

const analyzeNoteContentFlow = ai.defineFlow(
  {
    name: 'analyzeNoteContentFlow',
    inputSchema: AnalyzeNoteContentInputSchema,
    outputSchema: AnalyzeNoteContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI did not return an analysis.');
    }
    return output;
  }
);
