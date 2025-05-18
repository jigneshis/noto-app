
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import * as store from '@/lib/localStorageStore';
import type { Flashcard } from '@/lib/types';
import { Loader2, Plus } from 'lucide-react';

interface QuickAddFlashcardFormProps {
  deckId: string;
  onFlashcardAdded: () => void;
}

export function QuickAddFlashcardForm({ deckId, onFlashcardAdded }: QuickAddFlashcardFormProps) {
  const [title, setTitle] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !front.trim() || !back.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in Title, Front, and Back for the flashcard.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      store.addFlashcardToDeck(deckId, { title, front, back, status: 'learning' });
      toast({
        title: 'Flashcard Added!',
        description: `"${title}" was added to the deck.`,
      });
      setTitle('');
      setFront('');
      setBack('');
      onFlashcardAdded(); // Callback to refresh parent component's state
    } catch (error) {
      console.error('Error adding flashcard quickly:', error);
      toast({
        title: 'Error',
        description: 'Could not add the flashcard.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-card shadow-sm mt-6 mb-8 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      <h3 className="text-lg font-semibold text-primary">Quick Add Flashcard</h3>
      <div>
        <Label htmlFor="quick-title">Title</Label>
        <Input
          id="quick-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Flashcard Title"
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="quick-front">Front (Question)</Label>
        <Textarea
          id="quick-front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="Enter question or term..."
          className="mt-1 min-h-[80px]"
          disabled={isLoading}
        />
         <p className="text-xs text-muted-foreground mt-1">Markdown supported.</p>
      </div>
      <div>
        <Label htmlFor="quick-back">Back (Answer)</Label>
        <Textarea
          id="quick-back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Enter answer or definition..."
          className="mt-1 min-h-[80px]"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">Markdown supported.</p>
      </div>
      <Button type="submit" disabled={isLoading || !title.trim() || !front.trim() || !back.trim()} className="w-full sm:w-auto active:scale-95 transition-transform">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        Add Quick Card
      </Button>
    </form>
  );
}
