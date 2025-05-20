
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Note } from '@/lib/types';
import { FileText, Edit3, Trash2, Tag, Pin, PinOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as store from '@/lib/localStorageStore'; // For pin toggle
import { useToast } from '@/hooks/use-toast'; // For pin toggle feedback

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onPinToggle: (noteId: string) => void; // Callback to refresh list after pinning
  className?: string;
  style?: React.CSSProperties;
}

const MAX_NOTE_NAME_LENGTH = 30;
const MAX_CONTENT_PREVIEW_LENGTH = 150;
const TRUNCATION_SUFFIX = "......";

function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + TRUNCATION_SUFFIX;
  }
  return text;
}

export function NoteCard({ note, onEdit, onDelete, onPinToggle, className, style }: NoteCardProps) {
  const noteAccentColor = note.accentColor ? `hsl(${note.accentColor})` : undefined;
  const displayedNoteName = truncateText(note.title, MAX_NOTE_NAME_LENGTH);
  const contentPreview = note.content.replace(/#/g, '').replace(/\*/g, '').replace(/_/g, '');
  const { toast } = useToast();

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent link navigation if card is wrapped in Link
    const updatedNote = { ...note, isPinned: !note.isPinned };
    store.saveNote(updatedNote);
    onPinToggle(note.id); // Notify parent to refresh/re-sort
    toast({
      title: `Note ${updatedNote.isPinned ? 'Pinned' : 'Unpinned'}`,
      description: `"${truncateText(note.title, MAX_NOTE_NAME_LENGTH)}" has been ${updatedNote.isPinned ? 'pinned' : 'unpinned'}.`,
    });
  };

  return (
    <Card
      className={cn(
        "flex flex-col shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 ease-out group min-h-[280px]",
        note.isPinned && "border-primary/50 ring-2 ring-primary/30",
        className
      )}
      style={{ ...style, borderTop: noteAccentColor ? `3px solid ${noteAccentColor}` : undefined }}
    >
      <CardHeader className="flex flex-row justify-between items-start">
        <div className="flex-grow">
          <CardTitle
            className="flex items-center gap-2 text-primary"
            style={noteAccentColor ? { color: noteAccentColor } : {}}
          >
            <FileText
              className="h-6 w-6"
              style={noteAccentColor ? { color: noteAccentColor } : {}}
            />
            {displayedNoteName}
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            Last updated: {new Date(note.updatedAt).toLocaleDateString()}
          </CardDescription>
        </div>
         <Button
            variant="ghost"
            size="icon"
            onClick={handlePinToggle}
            aria-label={note.isPinned ? "Unpin note" : "Pin note"}
            className="ml-auto shrink-0 text-muted-foreground hover:text-primary active:scale-90 transition-transform"
          >
            {note.isPinned ? <Pin className="h-5 w-5 fill-primary text-primary" /> : <PinOff className="h-5 w-5" />}
          </Button>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="text-sm text-muted-foreground line-clamp-3 prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {truncateText(contentPreview, MAX_CONTENT_PREVIEW_LENGTH)}
            </ReactMarkdown>
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center pt-1">
            <Tag className="h-4 w-4 text-muted-foreground mr-1" />
            {note.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">+{note.tags.length - 3} more</Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 pt-4 border-t mt-auto">
        <Link href={`/notes/${note.id}`} passHref legacyBehavior>
          <Button variant="outline" className="w-full sm:w-auto active:scale-95 transition-transform">
            View/Edit Note
          </Button>
        </Link>
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(note)} aria-label="Edit note metadata" className="active:scale-90 transition-transform">
                <Edit3 className="h-5 w-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 active:scale-90 transition-transform" aria-label="Delete note">
                    <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the note "{truncateText(note.title, MAX_NOTE_NAME_LENGTH)}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(note.id)}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
