
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { Flashcard } from '@/lib/types';
import { Loader2 } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(false); // Reset loading state
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !front.trim() || !back.trim()) {
      alert('All fields (Title, Question, Answer) are required.');
      return;
    }
    setIsLoading(true);
    const flashcardData = {
      id: initialData?.id || crypto.randomUUID(), // Assign new ID if not editing
      title,
      front,
      back,
    };
    try {
      onSubmit(flashcardData);
      // Simulate async operation for demo purposes if onSubmit is synchronous
      // await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error submitting flashcard form:", error);
      // Optionally show a toast error
    } finally {
      setIsLoading(false);
       if (!initialData || (initialData && initialData.id === flashcardData.id)) { // only close if submission was "successful"
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) onClose(); }}>
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">Markdown supported (e.g., **bold**, *italic*, - list).</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || !title.trim() || !front.trim() || !back.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Flashcard'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
