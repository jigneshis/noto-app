
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Deck } from '@/lib/types';
import { FileText, Edit3, Trash2, Layers, Brain, Loader2, Tag, Copy } from 'lucide-react';
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
  className?: string;
  style?: React.CSSProperties;
}

export function DeckCard({ deck, onEdit, onDelete, onDuplicate, className, style }: DeckCardProps) {
  const [activeAction, setActiveAction] = useState<'view' | 'quiz' | null>(null);
  const deckAccentColor = deck.accentColor ? `hsl(${deck.accentColor})` : undefined;

  const masteredCards = deck.flashcards.filter(fc => fc.status === 'mastered').length;
  const totalCards = deck.flashcards.length;
  const masteryPercentage = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  return (
    <Card 
      className={cn(
        "flex flex-col shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 ease-out group min-h-[380px]", // Ensure min-height is applied
        className
      )}
      style={{ ...style, borderTop: deckAccentColor ? `3px solid ${deckAccentColor}` : undefined }}
    >
      <CardHeader>
        <CardTitle 
          className="flex items-center gap-2 text-primary" 
          style={deckAccentColor ? { color: deckAccentColor } : {}}
        >
          <Layers 
            className="h-6 w-6" 
            style={deckAccentColor ? { color: deckAccentColor } : {}}
          />
          {deck.name}
        </CardTitle>
        {deck.description && <CardDescription className="line-clamp-2">{deck.description}</CardDescription>}
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
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t mt-auto">
        <div className="grid grid-cols-1 sm:flex sm:gap-2 w-full sm:w-auto gap-2">
          <Link href={`/decks/${deck.id}`} passHref legacyBehavior>
            <Button 
              variant="outline" 
              className="w-full active:scale-95 transition-transform" 
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
                className="w-full text-accent-foreground active:scale-95 transition-transform"
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
        <div className="flex gap-1 self-center sm:self-auto">
            <Button variant="ghost" size="icon" onClick={() => onDuplicate(deck.id)} aria-label="Duplicate deck" className="active:scale-95 transition-transform">
                <Copy className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(deck)} aria-label="Edit deck" className="active:scale-95 transition-transform">
                <Edit3 className="h-5 w-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 active:scale-95 transition-transform" aria-label="Delete deck">
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
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground active:scale-95 transition-transform"
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
