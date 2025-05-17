
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
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FlashcardCardProps {
  flashcard: Flashcard;
  onEdit: (flashcard: Flashcard) => void;
  onDelete: (flashcardId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function FlashcardCard({ flashcard, onEdit, onDelete, className, style }: FlashcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const { toast } = useToast();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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
    <Card
      className={cn(
        "w-full shadow-md hover:shadow-2xl transition-shadow duration-300 ease-out min-h-[350px] flex flex-col group",
        className
      )}
      style={style}
    >
      <div
        className="flex-grow [perspective:1000px] cursor-pointer p-4"
        onClick={handleFlip}
      >
        <div
          className={cn(
            "relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ease-in-out",
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          )}
        >
          {/* Front Face */}
          <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col bg-card rounded-lg border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-primary truncate">{flashcard.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-center p-4 text-center">
              <ScrollArea className="max-h-[120px] w-full">
                <p className="text-lg font-semibold">Question:</p>
                <div className="text-md prose dark:prose-invert prose-sm max-w-none"> {/* Added prose classes for markdown styling */}
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{flashcard.front}</ReactMarkdown>
                </div>
              </ScrollArea>
            </CardContent>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col bg-card rounded-lg border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-primary truncate">{flashcard.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-center p-4 text-center">
              <ScrollArea className="max-h-[120px] w-full">
                <p className="text-lg font-semibold">Answer:</p>
                 <div className="text-md prose dark:prose-invert prose-sm max-w-none"> {/* Added prose classes for markdown styling */}
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{flashcard.back}</ReactMarkdown>
                </div>
              </ScrollArea>
            </CardContent>
          </div>
        </div>
      </div>

      {isExplaining && (
        <div className="pt-2 px-6 text-center animate-in fade-in duration-300">
          <Loader2 className="h-6 w-6 animate-spin text-accent mx-auto" />
          <p className="text-sm text-muted-foreground">Getting explanation...</p>
        </div>
      )}
      {explanation && (
        <ScrollArea className="px-6 pt-2 max-h-[100px] w-full animate-in fade-in duration-300">
          <div className="p-3 bg-muted/50 rounded-md text-sm border-l-2 border-accent pl-2">
            <p className="font-semibold text-accent flex items-center gap-1"><Lightbulb size={16}/> Simplified:</p>
            <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
            </div>
          </div>
        </ScrollArea>
      )}

      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-4 border-t mt-auto px-6 pb-6">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleFlip(); }} className="active:scale-95 transition-transform">
              <RotateCcw className="mr-2 h-4 w-4" /> Flip
          </Button>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleExplain(); }} disabled={isExplaining} className="active:scale-95 transition-transform">
              {isExplaining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
              Explain
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(flashcard); }} aria-label="Edit flashcard" className="active:scale-90 transition-transform">
              <Edit3 className="h-5 w-5" />
          </Button>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 active:scale-90 transition-transform" aria-label="Delete flashcard">
                  <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
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
