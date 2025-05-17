
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Deck } from '@/lib/types';
import { FileText, Edit3, Trash2, Layers, Brain } from 'lucide-react';
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

interface DeckCardProps {
  deck: Deck;
  onEdit: (deck: Deck) => void;
  onDelete: (deckId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function DeckCard({ deck, onEdit, onDelete, className, style }: DeckCardProps) {
  return (
    <Card 
      className={cn(
        "flex flex-col shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-out",
        className
      )}
      style={style}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Layers className="h-6 w-6" />
          {deck.name}
        </CardTitle>
        {deck.description && <CardDescription>{deck.description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground">
          <p>Flashcards: {deck.flashcards.length}</p>
          <p>Last updated: {new Date(deck.updatedAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Link href={`/decks/${deck.id}`} passHref legacyBehavior>
          <Button variant="outline" className="flex-1 active:scale-95 transition-transform">
            <FileText className="mr-2 h-4 w-4" /> View Deck
          </Button>
        </Link>
        <Link href={`/decks/${deck.id}/quiz`} passHref legacyBehavior>
            <Button variant="default" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground active:scale-95 transition-transform">
                <Brain className="mr-2 h-4 w-4" /> Quiz
            </Button>
        </Link>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(deck)} aria-label="Edit deck" className="active:scale-90 transition-transform">
                <Edit3 className="h-5 w-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 active:scale-90 transition-transform" aria-label="Delete deck">
                    <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the deck "{deck.name}" and all its flashcards.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(deck.id)}
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

