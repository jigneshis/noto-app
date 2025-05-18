
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeckCard } from '@/components/deck-card';
import { DeckForm } from '@/components/deck-form';
import { AiFlashcardGeneratorDialog } from '@/components/ai-flashcard-generator-dialog';
import type { Deck, Flashcard, ImportedDecks } from '@/lib/types';
import * as store from '@/lib/localStorageStore';
import { PlusCircle, Sparkles, Layers as LayersIconLucide, Loader2, Search, Tag, X, Info, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isDeckFormOpen, setIsDeckFormOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const { toast } = useToast();
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);
  const [deckSearchTerm, setDeckSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoadingDecks(true);
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

  const handleDuplicateDeck = (deckId: string) => {
    const originalDeck = store.getDeck(deckId);
    if (!originalDeck) {
      toast({ title: 'Error Duplicating', description: 'Original deck not found.', variant: 'destructive' });
      return;
    }

    const now = new Date().toISOString();
    const newDeck: Deck = {
      ...originalDeck,
      id: crypto.randomUUID(),
      name: `${originalDeck.name} (Copy)`,
      flashcards: originalDeck.flashcards.map(fc => ({
        ...fc,
        id: crypto.randomUUID(),
      })),
      createdAt: now,
      updatedAt: now,
    };

    store.saveDeck(newDeck);
    refreshDecks();
    toast({ title: 'Deck Duplicated!', description: `Deck "${newDeck.name}" created.` });
  };

  const handleExportDeck = (deckId: string) => {
    const deckToExport = store.getDeck(deckId);
    if (!deckToExport) {
      toast({ title: 'Export Error', description: 'Deck not found.', variant: 'destructive' });
      return;
    }
    try {
      const jsonString = JSON.stringify(deckToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deckToExport.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_noto_deck.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Deck Exported', description: `"${deckToExport.name}" has been exported.` });
    } catch (error) {
      console.error('Error exporting deck:', error);
      toast({ title: 'Export Failed', description: 'Could not export the deck.', variant: 'destructive' });
    }
  };

  const handleImportDecks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const importedData: ImportedDecks = JSON.parse(text);
        
        const decksToImportArray = Array.isArray(importedData) ? importedData : [importedData];
        let importedCount = 0;

        decksToImportArray.forEach(deck => {
          // Basic validation
          if (typeof deck.name !== 'string' || !Array.isArray(deck.flashcards)) {
            throw new Error(`Invalid deck structure for deck named "${deck.name || 'Unknown'}".`);
          }
          const newDeck: Deck = {
            ...deck,
            id: crypto.randomUUID(), // Ensure new ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            flashcards: deck.flashcards.map((fc: any) => ({
              ...fc,
              id: crypto.randomUUID(), // Ensure new flashcard IDs
              status: fc.status || 'learning',
              frontImage: fc.frontImage || undefined,
              backImage: fc.backImage || undefined,
            })),
            tags: deck.tags || [],
            accentColor: deck.accentColor || undefined,
          };
          store.saveDeck(newDeck);
          importedCount++;
        });
        
        refreshDecks();
        toast({ title: 'Import Successful', description: `${importedCount} deck(s) imported successfully.` });
      } catch (error) {
        console.error('Error importing decks:', error);
        toast({ title: 'Import Failed', description: (error as Error).message || 'Invalid JSON file or deck structure.', variant: 'destructive' });
      } finally {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };


  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    decks.forEach(deck => deck.tags?.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [decks]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearSelectedTags = () => {
    setSelectedTags([]);
  };

  const filteredDecks = useMemo(() => {
    return decks
      .filter(deck =>
        (deck.name.toLowerCase().includes(deckSearchTerm.toLowerCase()) ||
        (deck.description && deck.description.toLowerCase().includes(deckSearchTerm.toLowerCase())))
      )
      .filter(deck =>
        selectedTags.length === 0 || selectedTags.every(selTag => deck.tags?.includes(selTag))
      );
  }, [decks, deckSearchTerm, selectedTags]);


  if (isLoadingDecks) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TooltipProvider>
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
             <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="active:scale-95 transition-transform w-full sm:w-auto">
              <Upload className="mr-2 h-5 w-5" /> Import Decks
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportDecks}
              className="hidden"
            />
          </div>
        </div>

        <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 delay-200 ease-out">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search decks by name or description..."
              value={deckSearchTerm}
              onChange={(e) => setDeckSearchTerm(e.target.value)}
              className="w-full md:max-w-md"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Info className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Search by deck name or its description.</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {allTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Filter by Tags:</h3>
                {selectedTags.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearSelectedTags} className="text-xs h-auto py-0.5 px-1.5">
                    <X className="mr-1 h-3 w-3" /> Clear Tags
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                    onClick={() => toggleTag(tag)}
                    className="cursor-pointer hover:opacity-80 transition-opacity text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>


        {filteredDecks.length === 0 ? (
          <div className="text-center py-10 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out delay-300">
            <p className="text-xl text-muted-foreground mb-4">
              {decks.length === 0 ? 'No decks yet. Create your first one or use AI!' : 'No decks match your search criteria or selected tags.'}
            </p>
            <LayersIconLucide className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredDecks.map((deck, index) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onEdit={handleEditDeck}
                onDelete={handleDeleteDeck}
                onDuplicate={handleDuplicateDeck}
                onExport={handleExportDeck}
                className="animate-in fade-in-50 zoom-in-95 duration-300 ease-out"
                style={{ animationDelay: `${(index % 4) * 75}ms` }}
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
    </TooltipProvider>
  );
}
