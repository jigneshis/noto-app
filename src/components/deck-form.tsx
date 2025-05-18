
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { Deck } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface DeckFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deck: Omit<Deck, 'flashcards' | 'createdAt' | 'updatedAt'> | Deck) => void;
  initialData?: Deck | null;
}

export function DeckForm({ isOpen, onClose, onSubmit, initialData }: DeckFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setIsLoading(false); // Reset loading state when dialog opens or initialData changes
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Deck name is required.');
      return;
    }
    setIsLoading(true);
    const deckData = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      description,
    };
    try {
      if (initialData) {
          onSubmit({ ...initialData, ...deckData });
      } else {
          onSubmit({ ...deckData, flashcards: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Deck);
      }
      // Simulate async operation for demo purposes if onSubmit is synchronous
      // await new Promise(resolve => setTimeout(resolve, 500)); 
    } catch (error) {
      console.error("Error submitting deck form:", error);
      // Optionally show a toast error
    } finally {
      setIsLoading(false);
      if (!initialData || (initialData && initialData.id === deckData.id)) { // only close if submission was "successful"
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) onClose(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Deck' : 'Create New Deck'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Deck'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
