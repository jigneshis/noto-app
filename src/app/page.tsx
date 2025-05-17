
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DeckCard } from '@/components/deck-card';
import { DeckForm } from '@/components/deck-form';
import { AiFlashcardGeneratorDialog } from '@/components/ai-flashcard-generator-dialog';
import type { Deck } from '@/lib/types';
import * as store from '@/lib/localStorageStore';
import { PlusCircle, Sparkles, Loader2, LogIn, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  // const router = useRouter(); // No longer needed for immediate redirection
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isDeckFormOpen, setIsDeckFormOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user && !authLoading) {
      // For now, sample data is global for local storage.
      // If data were user-specific (e.g. Firestore), this would change.
      if (store.getDecks().length === 0) {
         store.generateSampleData();
      }
      setDecks(store.getDecks().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } else if (!user && !authLoading) {
      // Clear decks if user logs out or is not logged in from the start
      setDecks([]);
    }
  }, [user, authLoading]);

  const refreshDecks = () => {
    if (user) { 
      setDecks(store.getDecks().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  const handleDeckSubmit = (deckData: Omit<Deck, 'flashcards' | 'createdAt' | 'updatedAt'> | Deck) => {
    if (!user) return;
    store.saveDeck(deckData as Deck); 
    refreshDecks();
    toast({ title: editingDeck ? "Deck Updated!" : "Deck Created!", description: `Deck "${deckData.name}" has been successfully ${editingDeck ? 'updated' : 'created'}.` });
    setEditingDeck(null);
  };

  const handleEditDeck = (deck: Deck) => {
    if (!user) return;
    setEditingDeck(deck);
    setIsDeckFormOpen(true);
  };

  const handleDeleteDeck = (deckId: string) => {
    if (!user) return;
    const deckToDelete = store.getDeck(deckId);
    store.deleteDeck(deckId);
    refreshDecks();
    toast({ title: "Deck Deleted", description: `Deck "${deckToDelete?.name}" has been deleted.`, variant: 'destructive' });
  };
  
  const handleAiDeckGenerated = (newDeck: Deck) => {
    if (!user) return;
    store.saveDeck(newDeck);
    refreshDecks();
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // View for unauthenticated users
  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 flex flex-col items-center text-center min-h-[calc(100vh-8rem)] justify-center">
        <h1 className="text-5xl font-extrabold text-primary mb-6 tracking-tight">Welcome to NOTO</h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
          Your personal AI-powered flashcard companion. Create, study, and master new subjects with ease.
        </p>
        <Button asChild size="lg" className="shadow-lg hover:shadow-primary/50 transition-shadow">
          <Link href="/login">
            <LogIn className="mr-2 h-5 w-5" /> Get Started / Log In
          </Link>
        </Button>
        <div className="mt-16 w-full max-w-3xl">
          <Image 
            src="https://placehold.co/800x450.png" 
            alt="Dynamic flashcards learning illustration" 
            width={800} 
            height={450} 
            className="mx-auto rounded-xl shadow-2xl object-cover"
            data-ai-hint="education learning"
            priority 
          />
        </div>
        <p className="mt-12 text-sm text-muted-foreground">
          © {new Date().getFullYear()} NOTO by beasty powered by turri.ai
        </p>
      </div>
    );
  }

  // View for authenticated users
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-primary">My Flashcard Decks</h1>
        <div className="flex gap-2 flex-wrap justify-center">
          <Button onClick={() => { setEditingDeck(null); setIsDeckFormOpen(true); }}>
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Deck
          </Button>
          <Button variant="outline" onClick={() => setIsAiGeneratorOpen(true)}>
            <Sparkles className="mr-2 h-5 w-5 text-accent" /> Generate with AI
          </Button>
        </div>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-10 bg-card border rounded-lg shadow-sm">
          <p className="text-xl text-muted-foreground mb-4">No decks yet. Create your first one or use AI!</p>
          <LayersIcon className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} onEdit={handleEditDeck} onDelete={handleDeleteDeck} />
          ))}
        </div>
      )}

      <DeckForm
        isOpen={isDeckFormOpen}
        onClose={() => setIsDeckFormOpen(false)}
        onSubmit={handleDeckSubmit}
        initialData={editingDeck}
      />
      <AiFlashcardGeneratorDialog
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onDeckGenerated={handleAiDeckGenerated}
      />
    </div>
  );
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}
