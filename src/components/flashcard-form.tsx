
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { Flashcard } from '@/lib/types';

interface FlashcardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (flashcard: Omit<Flashcard, 'id'> | Flashcard) => void;
  initialData?: Flashcard | null;
}

export function FlashcardForm({ isOpen, onClose, onSubmit, initialData }: FlashcardFormProps) {
  const [title, setTitle] = useState('');
  const [front, setFront] = useState(''); // Question
  const [back, setBack] = useState('');   // Answer

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setFront(initialData.front);
      setBack(initialData.back);
    } else {
      setTitle('');
      setFront('');
      setBack('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !front.trim() || !back.trim()) {
      alert('All fields (Title, Question, Answer) are required.');
      return;
    }
    const flashcardData = {
      id: initialData?.id || crypto.randomUUID(), // Assign new ID if not editing
      title,
      front,
      back,
    };
    onSubmit(flashcardData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Flashcard' : 'Create New Flashcard'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="flashcard-title">Title</Label>
              <Input
                id="flashcard-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="flashcard-front">Front (Question)</Label>
              <Textarea
                id="flashcard-front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="col-span-3 mt-1 min-h-[100px]"
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Markdown supported (e.g., **bold**, *italic*, - list).</p>
            </div>
            <div>
              <Label htmlFor="flashcard-back">Back (Answer)</Label>
              <Textarea
                id="flashcard-back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                className="col-span-3 mt-1 min-h-[100px]"
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Markdown supported (e.g., **bold**, *italic*, - list).</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{initialData ? 'Save Changes' : 'Create Flashcard'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
