
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import type { Deck } from '@/lib/types';
import { Loader2, Palette, Tags } from 'lucide-react';

interface DeckFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deck: Omit<Deck, 'flashcards' | 'createdAt' | 'updatedAt'> | Deck) => void;
  initialData?: Deck | null;
}

const accentColorOptions = [
  { name: 'Default Blue', value: '215 80% 55%' },
  { name: 'Forest Green', value: '120 60% 45%' },
  { name: 'Sunset Orange', value: '30 90% 55%' },
  { name: 'Royal Purple', value: '270 60% 55%' },
  { name: 'Cherry Pink', value: '340 80% 60%' },
  { name: 'Teal Burst', value: '180 70% 45%' },
  { name: 'Goldenrod', value: '45 85% 55%' },
  { name: 'Graphite Gray', value: '220 10% 40%' },
];

export function DeckForm({ isOpen, onClose, onSubmit, initialData }: DeckFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState<string | undefined>(undefined);
  const [tagsInput, setTagsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setAccentColor(initialData.accentColor || undefined);
      setTagsInput((initialData.tags || []).join(', '));
    } else {
      setName('');
      setDescription('');
      setAccentColor(undefined);
      setTagsInput('');
    }
    setIsLoading(false); 
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Deck name is required.');
      return;
    }
    setIsLoading(true);

    const processedTags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const deckData = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      description,
      accentColor: accentColor === "undefined" || accentColor === "" ? undefined : accentColor,
      tags: processedTags,
    };

    try {
      if (initialData) {
          onSubmit({ ...initialData, ...deckData });
      } else {
          onSubmit({ ...deckData, flashcards: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Deck);
      }
    } catch (error) {
      console.error("Error submitting deck form:", error);
    } finally {
      setIsLoading(false);
      if (!initialData || (initialData && initialData.id === deckData.id)) { 
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Deck' : 'Create New Deck'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                placeholder="e.g., Biology Chapter 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={isLoading}
                placeholder="A brief overview of this deck's content"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags" className="flex items-center">
                 <Tags className="mr-2 h-4 w-4 text-muted-foreground" />
                 Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                disabled={isLoading}
                placeholder="e.g., biology, exam1, science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor" className="flex items-center">
                <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
                Accent Color
              </Label>
              <Select
                value={accentColor || "undefined"}
                onValueChange={(value) => setAccentColor(value === "undefined" ? undefined : value)}
                disabled={isLoading}
              >
                <SelectTrigger id="accentColor" className="w-full">
                  <SelectValue placeholder="Default Theme Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Choose a color</SelectLabel>
                    <SelectItem value="undefined">Default Theme Color</SelectItem>
                    {accentColorOptions.map(color => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <span 
                            className="w-4 h-4 rounded-full mr-2 border" 
                            style={{ backgroundColor: `hsl(${color.value})` }}
                          ></span>
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || !name.trim()} className="active:scale-95 transition-transform">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Deck'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
