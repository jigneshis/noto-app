
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { QuizView } from '@/components/quiz-view';
import type { Deck } from '@/lib/types';
import * as store from '@/lib/localStorageStore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  const { user, loading: authLoading } = useAuth();
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && deckId) { // Only proceed if user is logged in and deckId is present
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
  }, [deckId, router, toast, user]);

  if (authLoading || !user) {
     return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!deck) {
    // This state can occur briefly or if deck/quiz load fails after auth
    return <div className="container mx-auto py-8 text-center">Loading quiz details...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/decks/${deckId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deck
        </Button>
        <h1 className="text-2xl font-bold text-primary">Quiz: {deck.name}</h1>
      </div>
      
      <QuizView deck={deck} />
    </div>
  );
}
