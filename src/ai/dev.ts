
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-content-into-flashcards.ts';
import '@/ai/flows/explain-content-simply.ts';
import '@/ai/flows/generate-flashcards-from-text.ts';
import '@/ai/flows/generate-image-for-flashcard.ts'; // Added new flow
