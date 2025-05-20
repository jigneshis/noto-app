
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import type { Note } from '@/lib/types';
import { Loader2, Palette, Tags, FileText } from 'lucide-react';

interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: Note) => void;
  initialData?: Note | null;
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

export function NoteForm({ isOpen, onClose, onSubmit, initialData }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [accentColor, setAccentColor] = useState<string | undefined>(undefined);
  const [tagsInput, setTagsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content || '');
      setAccentColor(initialData.accentColor || undefined);
      setTagsInput((initialData.tags || []).join(', '));
    } else {
      setTitle('');
      setContent('');
      setAccentColor(undefined);
      setTagsInput('');
    }
    setIsLoading(false);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Note title is required.');
      return;
    }
    setIsLoading(true);

    const processedTags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const now = new Date().toISOString();
    const noteData: Note = {
      id: initialData?.id || crypto.randomUUID(),
      title,
      content,
      accentColor: accentColor === "undefined" || accentColor === "" ? undefined : accentColor,
      tags: processedTags,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };

    try {
      onSubmit(noteData);
    } catch (error) {
      console.error("Error submitting note form:", error);
    } finally {
      setIsLoading(false);
      if (!initialData || (initialData && initialData.id === noteData.id)) {
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) onClose(); }}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {initialData ? 'Edit Note' : 'Create New Note'}
          </DialogTitle>
          <DialogDescription>
            {initialData ? 'Modify your existing note.' : 'Craft a new note. Markdown is supported for content.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
              placeholder="e.g., Meeting Summary, Project Ideas"
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-content">Content (Markdown Supported)</Label>
            <Textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              disabled={isLoading}
              placeholder="Start writing your note here..."
              className="min-h-[200px] text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-tags" className="flex items-center">
              <Tags className="mr-2 h-4 w-4 text-muted-foreground" />
              Tags (comma-separated)
            </Label>
            <Input
              id="note-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              disabled={isLoading}
              placeholder="e.g., work, personal, ideas"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-accentColor" className="flex items-center">
              <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
              Accent Color
            </Label>
            <Select
              value={accentColor || "undefined"}
              onValueChange={(value) => setAccentColor(value === "undefined" ? undefined : value)}
              disabled={isLoading}
            >
              <SelectTrigger id="note-accentColor" className="w-full">
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
        </form>
        <DialogFooter className="pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="note-form-submit-trigger" onClick={handleSubmit} disabled={isLoading || !title.trim()} className="active:scale-95 transition-transform">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Save Changes' : 'Create Note'}
          </Button>
        </DialogFooter>
        {/* Hidden submit button to trigger form submission from footer */}
        <button type="submit" form="note-form-submit-trigger" id="note-form-submit-trigger" className="hidden"></button>
      </DialogContent>
    </Dialog>
  );
}
