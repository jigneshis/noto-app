'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FlashcardCard } from '@/components/flashcard-card';
import { FlashcardForm } from '@/components/flashcard-form';
import type { Deck, Flashcard } from '@/lib/types';
import * as store from '@/lib/localStorageStore';
import { PlusCircle, ArrowLeft, Brain, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isFlashcardFormOpen, setIsFlashcardFormOpen] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [shareableLink, setShareableLink] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (deckId) {
      const currentDeck = store.getDeck(deckId);
      if (currentDeck) {
        setDeck(currentDeck);
        // For now, the shareable link is just the current page URL.
        // Username and deck name in URL is more complex and requires auth/profiles.
        if (typeof window !== 'undefined') {
             setShareableLink(`${window.location.origin}/decks/${deckId}`);
        }
      } else {
        // Handle deck not found, e.g., redirect or show error
        toast({ title: 'Deck not found', variant: 'destructive' });
        router.push('/');
      }
    }
  }, [deckId, router, toast]);

  const refreshDeck = () => {
    if (deckId) {
      setDeck(store.getDeck(deckId) || null);
    }
  };

  const handleFlashcardSubmit = (flashcardData: Omit<Flashcard, 'id'> | Flashcard) => {
    if (!deck) return;

    if ('id' in flashcardData && editingFlashcard) { // Editing existing
      store.updateFlashcardInDeck(deck.id, flashcardData as Flashcard);
      toast({ title: "Flashcard Updated!", description: `Flashcard "${flashcardData.title}" updated.` });
    } else { // Creating new
      store.addFlashcardToDeck(deck.id, flashcardData);
      toast({ title: "Flashcard Created!", description: `Flashcard "${flashcardData.title}" added to deck.` });
    }
    refreshDeck();
    setEditingFlashcard(null);
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setIsFlashcardFormOpen(true);
  };

  const handleDeleteFlashcard = (flashcardId: string) => {
    if (!deck) return;
    const fcToDelete = deck.flashcards.find(fc => fc.id === flashcardId);
    store.deleteFlashcardFromDeck(deck.id, flashcardId);
    refreshDeck();
    toast({ title: "Flashcard Deleted", description: `Flashcard "${fcToDelete?.title}" deleted.`, variant: 'destructive' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      setCopied(true);
      toast({ title: "Link Copied!", description: "Shareable link copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      toast({ title: "Copy Failed", description: "Could not copy link to clipboard.", variant: "destructive" });
      console.error('Failed to copy: ', err);
    });
  };

  if (!deck) {
    return <div className="container mx-auto py-8 text-center">Loading deck...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => router.push('/')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Decks
      </Button>

      <div className="mb-8 p-6 bg-card rounded-lg shadow-sm border">
        <h1 className="text-3xl font-bold text-primary mb-2">{deck.name}</h1>
        {deck.description && <p className="text-muted-foreground mb-4">{deck.description}</p>}
         <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <Label htmlFor="share-link" className="text-sm font-medium shrink-0">Share this deck:</Label>
            <div className="flex w-full max-w-md">
              <Input id="share-link" type="text" value={shareableLink} readOnly className="flex-grow rounded-r-none"/>
              <Button onClick={copyToClipboard} variant="outline" className="rounded-l-none">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
          </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-semibold">Flashcards ({deck.flashcards.length})</h2>
        <div className="flex gap-2">
            <Button onClick={() => { setEditingFlashcard(null); setIsFlashcardFormOpen(true); }}>
                <PlusCircle className="mr-2 h-5 w-5" /> Add Flashcard
            </Button>
            {deck.flashcards.length > 0 && (
                <Link href={`/decks/${deck.id}/quiz`} passHref legacyBehavior>
                    <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Brain className="mr-2 h-5 w-5" /> Start Quiz
                    </Button>
                </Link>
            )}
        </div>
      </div>

      {deck.flashcards.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-lg shadow-sm border">
          <p className="text-xl text-muted-foreground mb-4">This deck is empty. Add some flashcards!</p>
          <LightbulbIcon className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deck.flashcards.map((flashcard) => (
            <FlashcardCard
              key={flashcard.id}
              flashcard={flashcard}
              onEdit={handleEditFlashcard}
              onDelete={handleDeleteFlashcard}
            />
          ))}
        </div>
      )}

      <FlashcardForm
        isOpen={isFlashcardFormOpen}
        onClose={() => setIsFlashcardFormOpen(false)}
        onSubmit={handleFlashcardSubmit}
        initialData={editingFlashcard}
      />
    </div>
  );
}

function LightbulbIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}
