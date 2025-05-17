
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FlashcardCard } from '@/components/flashcard-card';
import { FlashcardForm } from '@/components/flashcard-form';
import type { Deck, Flashcard } from '@/lib/types';
import * as store from '@/lib/localStorageStore';
import { PlusCircle, ArrowLeft, Brain, Copy, Check, Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';

export default function DeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  const { user, loading: authLoading } = useAuth();
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isFlashcardFormOpen, setIsFlashcardFormOpen] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [shareableLink, setShareableLink] = useState('');
  const [copied, setCopied] = useState(false);
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
        setDeck(currentDeck);
        if (typeof window !== 'undefined') {
             setShareableLink(`${window.location.origin}/decks/${deckId}`);
        }
      } else {
        toast({ title: 'Deck not found', variant: 'destructive' });
        router.push('/');
      }
    }
  }, [deckId, router, toast, user]);

  const refreshDeck = () => {
    if (user && deckId) {
      setDeck(store.getDeck(deckId) || null);
    }
  };

  const handleFlashcardSubmit = (flashcardData: Omit<Flashcard, 'id'> | Flashcard) => {
    if (!deck || !user) return;

    if ('id' in flashcardData && editingFlashcard) { 
      store.updateFlashcardInDeck(deck.id, flashcardData as Flashcard);
      toast({ title: "Flashcard Updated!", description: `Flashcard "${flashcardData.title}" updated.` });
    } else { 
      store.addFlashcardToDeck(deck.id, flashcardData);
      toast({ title: "Flashcard Created!", description: `Flashcard "${flashcardData.title}" added to deck.` });
    }
    refreshDeck();
    setEditingFlashcard(null);
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    if (!user) return;
    setEditingFlashcard(flashcard);
    setIsFlashcardFormOpen(true);
  };

  const handleDeleteFlashcard = (flashcardId: string) => {
    if (!deck || !user) return;
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

  if (authLoading || !user) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!deck) {
    // This state can occur briefly or if deck load fails after auth
    return <div className="container mx-auto py-8 text-center">Loading deck details...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        onClick={() => router.push('/')} 
        className="mb-6 animate-in fade-in slide-in-from-left-5 duration-500 ease-out active:scale-95 transition-transform"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Decks
      </Button>

      <div className="mb-8 p-6 bg-card rounded-lg shadow-sm border">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 animate-in fade-in slide-in-from-top-5 duration-500 delay-100 ease-out">{deck.name}</h1>
        {deck.description && <p className="text-muted-foreground mb-4 animate-in fade-in slide-in-from-top-5 duration-500 delay-200 ease-out">{deck.description}</p>}
         <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center animate-in fade-in slide-in-from-bottom-5 duration-500 delay-300 ease-out">
            <Label htmlFor="share-link" className="text-sm font-medium shrink-0">Share this deck:</Label>
            <div className="flex w-full max-w-md">
              <Input id="share-link" type="text" value={shareableLink} readOnly className="flex-grow rounded-r-none"/>
              <Button onClick={copyToClipboard} variant="outline" className="rounded-l-none active:scale-95 transition-transform">
                {copied ? <Check className="h-4 w-4 text-green-500 animate-in fade-in zoom-in-50" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
          </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 animate-in fade-in slide-in-from-bottom-5 duration-500 delay-400 ease-out">
        <h2 className="text-xl sm:text-2xl font-semibold">Flashcards ({deck.flashcards.length})</h2>
        <div className="flex gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
            <Button onClick={() => { setEditingFlashcard(null); setIsFlashcardFormOpen(true); }} className="active:scale-95 transition-transform w-full sm:w-auto">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Flashcard
            </Button>
            {deck.flashcards.length > 0 && (
                <Link href={`/decks/${deck.id}/quiz`} passHref legacyBehavior>
                    <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground active:scale-95 transition-transform w-full sm:w-auto">
                        <Brain className="mr-2 h-5 w-5" /> Start Quiz
                    </Button>
                </Link>
            )}
        </div>
      </div>

      {deck.flashcards.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-lg shadow-sm border animate-in fade-in zoom-in-95 duration-500 ease-out delay-500">
          <p className="text-xl text-muted-foreground mb-4">This deck is empty. Add some flashcards!</p>
          <EmptyFlashcardIcon className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deck.flashcards.map((flashcard, index) => (
            <FlashcardCard
              key={flashcard.id}
              flashcard={flashcard}
              onEdit={handleEditFlashcard}
              onDelete={handleDeleteFlashcard}
              className="animate-in fade-in-50 zoom-in-95 duration-300 ease-out"
              style={{ animationDelay: `${index * 75}ms` }}
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

// Renamed LightbulbIcon to EmptyFlashcardIcon to be more specific
function EmptyFlashcardIcon(props: React.SVGProps<SVGSVGElement>) {
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
      {/* Simple stack of cards icon */}
      <rect x="2" y="7" width="18" height="12" rx="2" ry="2" />
      <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
      <path d="M6 7V3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
      <line x1="12" y1="11" x2="12" y2="15" />
      <line x1="10" y1="13" x2="14" y2="13" />
    </svg>
  )
}

