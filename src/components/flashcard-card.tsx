'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Flashcard } from '@/lib/types';
import { Edit3, Trash2, RotateCcw, Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { explainContentSimplyAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
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

interface FlashcardCardProps {
  flashcard: Flashcard;
  onEdit: (flashcard: Flashcard) => void;
  onDelete: (flashcardId: string) => void;
}

export function FlashcardCard({ flashcard, onEdit, onDelete }: FlashcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const { toast } = useToast();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setExplanation(null); // Clear explanation when flipping
  };

  const handleExplain = async () => {
    setIsExplaining(true);
    setExplanation(null);
    try {
      const contentToExplain = isFlipped ? flashcard.back : flashcard.front;
      const result = await explainContentSimplyAction(contentToExplain);
      setExplanation(result);
    } catch (error) {
      toast({
        title: 'Error explaining content',
        description: (error as Error).message || 'Could not get explanation from AI.',
        variant: 'destructive',
      });
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 min-h-[300px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-primary truncate">{flashcard.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center items-center p-4 cursor-pointer min-h-[150px]" onClick={handleFlip}>
        <div className="text-center">
          <ScrollArea className="max-h-[120px] w-full">
             <p className="text-lg font-semibold">{isFlipped ? 'Answer:' : 'Question:'}</p>
             <p className="text-md whitespace-pre-wrap">{isFlipped ? flashcard.back : flashcard.front}</p>
          </ScrollArea>
        </div>
        {isExplaining && (
          <div className="mt-4 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">Getting explanation...</p>
          </div>
        )}
        {explanation && (
          <ScrollArea className="mt-4 p-3 bg-muted/50 rounded-md max-h-[100px] w-full">
            <div className="text-sm border-l-2 border-accent pl-2">
              <p className="font-semibold text-accent flex items-center gap-1"><Lightbulb size={16}/> Simplified:</p>
              <p className="whitespace-pre-wrap">{explanation}</p>
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-4 border-t">
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleFlip}>
                <RotateCcw className="mr-2 h-4 w-4" /> Flip
            </Button>
            <Button variant="outline" size="sm" onClick={handleExplain} disabled={isExplaining}>
                {isExplaining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                Explain
            </Button>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(flashcard)} aria-label="Edit flashcard">
                <Edit3 className="h-5 w-5" />
            </Button>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10" aria-label="Delete flashcard">
                    <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the flashcard titled "{flashcard.title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(flashcard.id)}
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
