
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeckCard } from '@/components/deck-card';
import { DeckForm } from '@/components/deck-form';
import { AiFlashcardGeneratorDialog } from '@/components/ai-flashcard-generator-dialog';
import type { Deck } from '@/lib/types';
import * as store from '@/lib/localStorageStore';
import { PlusCircle, Sparkles, Layers as LayersIconLucide, Loader2, Search } from 'lucide-react'; 
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isDeckFormOpen, setIsDeckFormOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const { toast } = useToast();
  const [isLoadingDecks, setIsLoadingDecks] = useState(true); 
  const [deckSearchTerm, setDeckSearchTerm] = useState('');

  useEffect(() => {
    setIsLoadingDecks(true);
    // Removed call to store.generateSampleData();
    setDecks(store.getDecks().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setIsLoadingDecks(false);
  }, []);

  const refreshDecks = () => {
    setDecks(store.getDecks().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleDeckSubmit = (deckData: Omit<Deck, 'flashcards' | 'createdAt' | 'updatedAt'> | Deck) => {
    store.saveDeck(deckData as Deck); 
    refreshDecks();
    toast({ title: editingDeck ? "Deck Updated!" : "Deck Created!", description: `Deck "${deckData.name}" has been successfully ${editingDeck ? 'updated' : 'created'}.` });
    setEditingDeck(null);
  };

  const handleEditDeck = (deck: Deck) => {
    setEditingDeck(deck);
    setIsDeckFormOpen(true);
  };

  const handleDeleteDeck = (deckId: string) => {
    const deckToDelete = store.getDeck(deckId);
    store.deleteDeck(deckId);
    refreshDecks();
    toast({ title: "Deck Deleted", description: `Deck "${deckToDelete?.name}" has been deleted.`, variant: 'destructive' });
  };
  
  const handleAiDeckGenerated = (newDeck: Deck) => {
    store.saveDeck(newDeck);
    refreshDecks();
  };

  const filteredDecks = decks.filter(deck => 
    deck.name.toLowerCase().includes(deckSearchTerm.toLowerCase()) ||
    (deck.description && deck.description.toLowerCase().includes(deckSearchTerm.toLowerCase()))
  );

  if (isLoadingDecks) { 
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary animate-in fade-in slide-in-from-top-5 duration-500 ease-out">My Flashcard Decks</h1>
        <div className="flex gap-2 flex-wrap justify-center sm:justify-end animate-in fade-in slide-in-from-top-5 duration-500 delay-100 ease-out w-full sm:w-auto">
          <Button onClick={() => { setEditingDeck(null); setIsDeckFormOpen(true); }} className="active:scale-95 transition-transform w-full sm:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Deck
          </Button>
          <Button variant="outline" onClick={() => setIsAiGeneratorOpen(true)} className="active:scale-95 transition-transform w-full sm:w-auto">
            <Sparkles className="mr-2 h-5 w-5 text-accent" /> Generate with AI
          </Button>
        </div>
      </div>
      
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-5 duration-500 delay-200 ease-out">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search decks by name or description..."
            value={deckSearchTerm}
            onChange={(e) => setDeckSearchTerm(e.target.value)}
            className="pl-10 w-full md:max-w-md"
          />
        </div>
      </div>

      {filteredDecks.length === 0 ? (
        <div className="text-center py-10 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out delay-300">
          <p className="text-xl text-muted-foreground mb-4">
            {decks.length > 0 && deckSearchTerm ? 'No decks match your search.' : 'No decks yet. Create your first one or use AI!'}
          </p>
          <LayersIconLucide className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map((deck, index) => (
            <DeckCard 
              key={deck.id} 
              deck={deck} 
              onEdit={handleEditDeck} 
              onDelete={handleDeleteDeck} 
              className="animate-in fade-in-50 zoom-in-95 duration-300 ease-out"
              style={{ animationDelay: `${(index % 6) * 75}ms` }}
            />
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
