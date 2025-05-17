'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { Deck } from '@/lib/types';

interface DeckFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deck: Omit<Deck, 'flashcards' | 'createdAt' | 'updatedAt'> | Deck) => void;
  initialData?: Deck | null;
}

export function DeckForm({ isOpen, onClose, onSubmit, initialData }: DeckFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      // Basic validation, consider using react-hook-form for more complex forms
      alert('Deck name is required.');
      return;
    }
    const deckData = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      description,
    };
    if (initialData) {
        onSubmit({ ...initialData, ...deckData });
    } else {
        onSubmit({ ...deckData, flashcards: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Deck);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{initialData ? 'Save Changes' : 'Create Deck'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
