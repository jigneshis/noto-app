
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Deck } from '@/lib/types';
import { FileText, Edit3, Trash2, Layers, Brain, Loader2, Tag, Copy, Download } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DeckCardProps {
  deck: Deck;
  onEdit: (deck: Deck) => void;
  onDelete: (deckId: string) => void;
  onDuplicate: (deckId: string) => void;
  onExport: (deckId: string) => void; // New prop for export
  className?: string;
  style?: React.CSSProperties;
}

const MAX_DECK_NAME_LENGTH = 21;
const TRUNCATION_SUFFIX = "......";

function truncateDeckName(name: string): string {
  if (name.length > MAX_DECK_NAME_LENGTH) {
    return name.substring(0, MAX_DECK_NAME_LENGTH) + TRUNCATION_SUFFIX;
  }
  return name;
}

export function DeckCard({ deck, onEdit, onDelete, onDuplicate, onExport, className, style }: DeckCardProps) {
  const [activeAction, setActiveAction] = useState<'view' | 'quiz' | null>(null);
  const deckAccentColor = deck.accentColor ? `hsl(${deck.accentColor})` : undefined;

  const masteredCards = deck.flashcards.filter(fc => fc.status === 'mastered').length;
  const totalCards = deck.flashcards.length;
  const masteryPercentage = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  const displayedDeckName = truncateDeckName(deck.name);

  return (
    <Card
      className={cn(
        "flex flex-col shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 ease-out group min-h-[420px]",
        className
      )}
      style={{ ...style, borderTop: deckAccentColor ? `3px solid ${deckAccentColor}` : undefined }}
    >
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle
            className="flex items-center gap-2 text-primary"
            style={deckAccentColor ? { color: deckAccentColor } : {}}
          >
            <Layers
              className="h-6 w-6"
              style={deckAccentColor ? { color: deckAccentColor } : {}}
            />
            {displayedDeckName}
          </CardTitle>
          {deck.description && <CardDescription className="line-clamp-2 mt-1">{deck.description}</CardDescription>}
        </div>
        <Button variant="ghost" size="icon" onClick={() => onDuplicate(deck.id)} aria-label="Duplicate deck" className="ml-auto shrink-0">
            <Copy className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="text-sm text-muted-foreground">
          <p>Flashcards: {totalCards}</p>
          <p>Last updated: {new Date(deck.updatedAt).toLocaleDateString()}</p>
        </div>
        {totalCards > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Mastery</span>
              <span>{masteryPercentage}%</span>
            </div>
            <Progress value={masteryPercentage} className="h-2" />
          </div>
        )}
        {deck.tags && deck.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center pt-1">
            <Tag className="h-4 w-4 text-muted-foreground mr-1" />
            {deck.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
            {deck.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">+{deck.tags.length - 3} more</Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 pt-4 border-t mt-auto">
        <div className="grid grid-cols-1 sm:flex sm:gap-2 w-full sm:w-auto gap-2">
          <Link href={`/decks/${deck.id}`} passHref legacyBehavior>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setActiveAction('view')}
              disabled={activeAction === 'view'}
            >
              {activeAction === 'view' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              View Deck
            </Button>
          </Link>
          <Link href={`/decks/${deck.id}/quiz`} passHref legacyBehavior>
              <Button
                variant="default"
                className="w-full text-accent-foreground"
                style={deckAccentColor ? { backgroundColor: deckAccentColor } : {}}
                onClick={() => setActiveAction('quiz')}
                disabled={activeAction === 'quiz' || deck.flashcards.length === 0}
              >
                {activeAction === 'quiz' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="mr-2 h-4 w-4" />
                )}
                Quiz
              </Button>
          </Link>
        </div>
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(deck)} aria-label="Edit deck">
                <Edit3 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onExport(deck.id)} aria-label="Export deck">
                <Download className="h-5 w-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10" aria-label="Delete deck">
                    <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the deck "{truncateDeckName(deck.name)}" and all its flashcards.
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
