
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { QuizView } from '@/components/quiz-view';
import type { Deck } from '@/lib/types';
import * as store from '@/lib/localStorageStore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MAX_DECK_NAME_LENGTH = 21;
const TRUNCATION_SUFFIX = "......";

function truncateDeckName(name: string): string {
  if (name.length > MAX_DECK_NAME_LENGTH) {
    return name.substring(0, MAX_DECK_NAME_LENGTH) + TRUNCATION_SUFFIX;
  }
  return name;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isLoadingDeck, setIsLoadingDeck] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoadingDeck(true);
    if (deckId) { 
      const currentDeck = store.getDeck(deckId);
      if (currentDeck) {
        if (currentDeck.flashcards.length === 0) {
            toast({ title: 'Empty Deck', description: 'This deck has no flashcards to quiz.', variant: 'default' });
            router.push(`/decks/${deckId}`);
            return;
        }
        setDeck(currentDeck);
      } else {
        toast({ title: 'Deck not found', variant: 'destructive' });
        router.push('/');
      }
    }
    setIsLoadingDeck(false);
  }, [deckId, router, toast]);

  if (isLoadingDeck) { 
     return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!deck) {
    return <div className="container mx-auto py-8 text-center">Quiz not found or failed to load.</div>;
  }

  const displayedDeckName = truncateDeckName(deck.name);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6 animate-in fade-in slide-in-from-top-5 duration-500 ease-out">
        <Button variant="outline" onClick={() => router.push(`/decks/${deckId}`)} className="active:scale-95 transition-transform">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deck
        </Button>
        <h1 className="text-2xl font-bold text-primary">Quiz: {displayedDeckName}</h1>
      </div>
      
      <QuizView deck={deck} className="animate-in fade-in zoom-in-95 duration-500 delay-200 ease-out" />
    </div>
  );
}
