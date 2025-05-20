
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NoteForm } from '@/components/note-form';
import type { Note } from '@/lib/types';
import * as store from '@/lib/localStorageStore';
import { ArrowLeft, Edit, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NoteViewPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.noteId as string;

  const [note, setNote] = useState<Note | null>(null);
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoadingNote(true);
    if (noteId) {
      const currentNote = store.getNote(noteId);
      if (currentNote) {
        setNote(currentNote);
      } else {
        toast({ title: 'Note not found', variant: 'destructive' });
        router.push('/notes');
      }
    }
    setIsLoadingNote(false);
  }, [noteId, router, toast]);

  const refreshNote = () => {
    if (noteId) {
      setNote(store.getNote(noteId) || null);
    }
  };

  const handleNoteSubmit = (noteData: Note) => {
    store.saveNote(noteData);
    refreshNote();
    toast({ title: "Note Updated!", description: `Note "${noteData.title}" has been updated.` });
    setIsNoteFormOpen(false);
  };

  if (isLoadingNote) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!note) {
    return <div className="container mx-auto py-8 text-center">Note not found or failed to load.</div>;
  }

  const noteAccentColor = note.accentColor ? `hsl(${note.accentColor})` : undefined;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/notes')}
          className="animate-in fade-in slide-in-from-left-5 duration-500 ease-out active:scale-95 transition-transform"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notes
        </Button>
        <Button
          onClick={() => setIsNoteFormOpen(true)}
          className="animate-in fade-in slide-in-from-right-5 duration-500 ease-out active:scale-95 transition-transform w-full sm:w-auto"
          style={noteAccentColor ? { backgroundColor: noteAccentColor, color: 'hsl(var(--primary-foreground))' } : {}}
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Note
        </Button>
      </div>

      <Card
        className="w-full animate-in fade-in zoom-in-95 duration-500 delay-100 ease-out"
        style={noteAccentColor ? { borderTop: `4px solid ${noteAccentColor}` } : {}}
      >
        <CardHeader>
          <CardTitle 
            className="text-2xl sm:text-3xl font-bold text-primary flex items-center gap-2"
            style={noteAccentColor ? { color: noteAccentColor } : {}}
          >
            <FileText className="h-7 w-7"/>
            {note.title}
          </CardTitle>
          <CardDescription className="text-xs">
            Created: {new Date(note.createdAt).toLocaleDateString()} | Last Updated: {new Date(note.updatedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <NoteForm
        isOpen={isNoteFormOpen}
        onClose={() => setIsNoteFormOpen(false)}
        onSubmit={handleNoteSubmit}
        initialData={note}
      />
    </div>
  );
}
