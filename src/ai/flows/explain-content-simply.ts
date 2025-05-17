'use server';
/**
 * @fileOverview Explains flashcard content simply.
 *
 * - explainContentSimply - A function that explains complex content in a simplified manner.
 * - ExplainContentSimplyInput - The input type for the explainContentSimply function.
 * - ExplainContentSimplyOutput - The return type for the explainContentSimply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainContentSimplyInputSchema = z.object({
  content: z.string().describe('The content to be explained simply.'),
});
export type ExplainContentSimplyInput = z.infer<typeof ExplainContentSimplyInputSchema>;

const ExplainContentSimplyOutputSchema = z.object({
  simplifiedExplanation: z.string().describe('The simplified explanation of the content.'),
});
export type ExplainContentSimplyOutput = z.infer<typeof ExplainContentSimplyOutputSchema>;

export async function explainContentSimply(input: ExplainContentSimplyInput): Promise<ExplainContentSimplyOutput> {
  return explainContentSimplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainContentSimplyPrompt',
  input: {schema: ExplainContentSimplyInputSchema},
  output: {schema: ExplainContentSimplyOutputSchema},
  prompt: `You are an expert at explaining complex topics in a simple and easy-to-understand way.

  Please explain the following content simply:

  {{{content}}}`,
});

const explainContentSimplyFlow = ai.defineFlow(
  {
    name: 'explainContentSimplyFlow',
    inputSchema: ExplainContentSimplyInputSchema,
    outputSchema: ExplainContentSimplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
