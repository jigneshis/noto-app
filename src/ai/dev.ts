
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-content-into-flashcards.ts';
import '@/ai/flows/explain-content-simply.ts';
import '@/ai/flows/generate-flashcards-from-text.ts';
import '@/ai/flows/generate-image-for-flashcard.ts';
import '@/ai/flows/analyze-note-content.ts'; // Added new flow
