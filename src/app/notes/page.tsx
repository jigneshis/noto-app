
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NoteCard } from '@/components/note-card';
import { NoteForm } from '@/components/note-form';
import type { Note } from '@/lib/types';
import * as store from '@/lib/localStorageStore';
import { PlusCircle, FileText as FileTextIconLucide, Loader2, Search, Tag, X, Info, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SortOption = 'createdAt_desc' | 'createdAt_asc' | 'updatedAt_desc' | 'updatedAt_asc' | 'title_asc' | 'title_desc';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { toast } = useToast();
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [noteSearchTerm, setNoteSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('createdAt_desc');

  const fetchNotes = () => {
    setNotes(store.getNotes());
  };

  useEffect(() => {
    setIsLoadingNotes(true);
    fetchNotes();
    setIsLoadingNotes(false);
  }, []);

  const refreshNotes = () => {
    fetchNotes();
  };

  const handleNoteSubmit = (noteData: Note) => {
    store.saveNote(noteData);
    refreshNotes();
    toast({ title: editingNote ? "Note Updated!" : "Note Created!", description: `Note "${noteData.title}" has been successfully ${editingNote ? 'updated' : 'created'}.` });
    setEditingNote(null);
    setIsNoteFormOpen(false);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsNoteFormOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    const noteToDelete = store.getNote(noteId);
    store.deleteNote(noteId);
    refreshNotes();
    toast({ title: "Note Deleted", description: `Note "${noteToDelete?.title}" has been deleted.`, variant: 'destructive' });
  };
  
  const handlePinToggle = () => {
    refreshNotes(); // Re-fetch and re-sort notes
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags?.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [notes]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearSelectedTags = () => {
    setSelectedTags([]);
  };

  const sortedAndFilteredNotes = useMemo(() => {
    let processedNotes = [...notes];

    // Filter by search term
    processedNotes = processedNotes.filter(note =>
      (note.title.toLowerCase().includes(noteSearchTerm.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(noteSearchTerm.toLowerCase())))
    );

    // Filter by selected tags
    if (selectedTags.length > 0) {
      processedNotes = processedNotes.filter(note =>
        selectedTags.every(selTag => note.tags?.includes(selTag))
      );
    }

    // Separate pinned notes
    const pinnedNotes = processedNotes.filter(note => note.isPinned);
    const unpinnedNotes = processedNotes.filter(note => !note.isPinned);

    // Sort unpinned notes
    unpinnedNotes.sort((a, b) => {
      switch (sortOption) {
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'updatedAt_desc':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'updatedAt_asc':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'createdAt_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'createdAt_desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    // Sort pinned notes by the same criteria (among themselves)
    pinnedNotes.sort((a, b) => {
       switch (sortOption) {
        case 'title_asc': return a.title.localeCompare(b.title);
        case 'title_desc': return b.title.localeCompare(a.title);
        case 'updatedAt_desc': return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'updatedAt_asc': return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'createdAt_asc': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'createdAt_desc': default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });


    return [...pinnedNotes, ...unpinnedNotes];
  }, [notes, noteSearchTerm, selectedTags, sortOption]);


  if (isLoadingNotes) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading notes...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary animate-in fade-in slide-in-from-top-5 duration-500 ease-out flex items-center gap-2">
            <FileTextIconLucide className="h-8 w-8" /> My Notes
          </h1>
          <div className="flex gap-2 flex-wrap justify-center sm:justify-end animate-in fade-in slide-in-from-top-5 duration-500 delay-100 ease-out w-full sm:w-auto">
            <Button onClick={() => { setEditingNote(null); setIsNoteFormOpen(true); }} className="active:scale-95 transition-transform w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Note
            </Button>
          </div>
        </div>

        <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 delay-200 ease-out">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="flex items-center gap-2 w-full md:flex-grow">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notes by title or content..."
                  value={noteSearchTerm}
                  onChange={(e) => setNoteSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground shrink-0">
                      <Info className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Search by note title or its content.</p>
                  </TooltipContent>
                </Tooltip>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto md:min-w-[200px]">
                <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
                <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt_desc">Created: Newest</SelectItem>
                        <SelectItem value="createdAt_asc">Created: Oldest</SelectItem>
                        <SelectItem value="updatedAt_desc">Updated: Newest</SelectItem>
                        <SelectItem value="updatedAt_asc">Updated: Oldest</SelectItem>
                        <SelectItem value="title_asc">Title: A-Z</SelectItem>
                        <SelectItem value="title_desc">Title: Z-A</SelectItem>
                    </SelectContent>
                </Select>
            </div>
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

        {sortedAndFilteredNotes.length === 0 ? (
          <div className="text-center py-10 bg-card border rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-500 ease-out delay-300">
            <p className="text-xl text-muted-foreground mb-4">
              {notes.length === 0 ? 'No notes yet. Create your first one!' : 'No notes match your search criteria or selected tags.'}
            </p>
            <FileTextIconLucide className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAndFilteredNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onPinToggle={handlePinToggle}
                className="animate-in fade-in-50 zoom-in-95 duration-300 ease-out"
                style={{ animationDelay: `${(index % 6) * 75}ms` }}
              />
            ))}
          </div>
        )}

        <NoteForm
          isOpen={isNoteFormOpen}
          onClose={() => setIsNoteFormOpen(false)}
          onSubmit={handleNoteSubmit}
          initialData={editingNote}
        />
      </div>
    </TooltipProvider>
  );
}
