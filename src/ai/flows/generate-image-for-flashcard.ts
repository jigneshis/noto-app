
'use server';
/**
 * @fileOverview Generates an image for a flashcard based on text.
 *
 * - generateImageForFlashcard - A function that generates an image.
 * - GenerateImageForFlashcardInput - The input type for the function.
 * - GenerateImageForFlashcardOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageForFlashcardInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from. Should be descriptive.'),
});
export type GenerateImageForFlashcardInput = z.infer<typeof GenerateImageForFlashcardInputSchema>;

const GenerateImageForFlashcardOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a Base64 data URI. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateImageForFlashcardOutput = z.infer<typeof GenerateImageForFlashcardOutputSchema>;

export async function generateImageForFlashcard(input: GenerateImageForFlashcardInput): Promise<GenerateImageForFlashcardOutput> {
  return generateImageForFlashcardFlow(input);
}

const generateImageForFlashcardFlow = ai.defineFlow(
  {
    name: 'generateImageForFlashcardFlow',
    inputSchema: GenerateImageForFlashcardInputSchema,
    outputSchema: GenerateImageForFlashcardOutputSchema,
  },
  async (input) => {
    // IMPORTANT: Check Genkit documentation for the exact model name and capabilities for image generation.
    // 'googleai/gemini-2.0-flash-exp' is an example and might require specific project setup or availability.
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // This model is specified for experimental image generation.
      prompt: `Generate a simple, clear, and illustrative image suitable for a flashcard based on the following concept: ${input.prompt}. The image should be visually appealing and help in understanding or remembering the concept. Avoid text in the image unless absolutely essential. Focus on a single, clear subject.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // Both TEXT and IMAGE are often required for image generation models.
        // Add safetySettings if needed, e.g. to be less restrictive for educational content:
        // safetySettings: [
        //   { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        //   { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        // ],
      },
    });

    if (!media || !media.url) {
      throw new Error('AI did not return an image. The generated content might have been blocked or the model did not produce an image.');
    }
    // The media.url is expected to be the data URI for the generated image.
    return { imageDataUri: media.url };
  }
);

