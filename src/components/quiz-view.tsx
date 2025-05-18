
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Deck, Flashcard } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, CheckCircle, XCircle, ArrowRight, Repeat, ThumbsUp, ThumbsDown, Lightbulb, Loader2, Filter } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { explainContentSimplyAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface QuizViewProps {
  deck: Deck;
  onQuizComplete?: (score: number, total: number) => void;
  className?: string;
}

type QuizFilter = 'all' | 'learning' | 'mastered';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}


export function QuizView({ deck, onQuizComplete, className }: QuizViewProps) {
  const [shuffledFlashcards, setShuffledFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [quizFilter, setQuizFilter] = useState<QuizFilter>('all');
  const [quizStarted, setQuizStarted] = useState(false);
  const { toast } = useToast();

  const startTheQuiz = useCallback(() => {
    let cardsToQuiz = deck.flashcards;
    if (quizFilter === 'learning') {
      cardsToQuiz = deck.flashcards.filter(fc => fc.status === 'learning' || !fc.status);
    } else if (quizFilter === 'mastered') {
      cardsToQuiz = deck.flashcards.filter(fc => fc.status === 'mastered');
    }

    if (cardsToQuiz.length === 0) {
        toast({ title: 'No Cards', description: `No cards match the filter "${quizFilter}". Please adjust filter or add cards.`, variant: 'default', duration: 5000 });
        setQuizStarted(false); // Stay on filter selection
        return;
    }
    setShuffledFlashcards(shuffleArray(cardsToQuiz));
    setCurrentCardIndex(0);
    setIsAnswerVisible(false);
    setScore(0);
    setQuizFinished(false);
    setFeedbackGiven(false);
    setExplanation(null);
    setQuizStarted(true);
  }, [deck.flashcards, quizFilter, toast]);

  const resetQuiz = useCallback(() => {
    setCurrentCardIndex(0);
    setIsAnswerVisible(false);
    setScore(0);
    setQuizFinished(false);
    setFeedbackGiven(false);
    setExplanation(null);
    setQuizStarted(false); // Show filter options again
  }, []);
  
  useEffect(() => {
    // When the component mounts or deck changes, reset to show filter options
    resetQuiz();
  }, [deck, resetQuiz]);


  const currentFlashcard = shuffledFlashcards[currentCardIndex];

  const handleShowAnswer = () => {
    setIsAnswerVisible(true);
  };

  const handleFeedback = (isCorrect: boolean) => {
    if (!isAnswerVisible) {
      toast({ title: "Reveal Answer First", description: "Please reveal the answer before marking.", variant: "default" });
      return;
    }
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    setFeedbackGiven(true);
  };
  
  const moveToNextCard = () => {
    if (currentCardIndex < shuffledFlashcards.length - 1) {
      setCurrentCardIndex(prevIndex => prevIndex + 1);
      setIsAnswerVisible(false);
      setFeedbackGiven(false);
      setExplanation(null);
    } else {
      setQuizFinished(true);
      if (onQuizComplete) {
        onQuizComplete(score, shuffledFlashcards.length);
      }
    }
  };

  const handleExplain = async () => {
    if (!currentFlashcard) return;
    setIsExplaining(true);
    setExplanation(null);
    try {
      const contentToExplain = isAnswerVisible ? currentFlashcard.back : currentFlashcard.front;
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

  if (deck.flashcards.length === 0) {
    return <Card className={cn("w-full max-w-lg mx-auto shadow-xl", className)}><CardContent className="p-6 text-center">This deck has no flashcards to quiz!</CardContent></Card>;
  }

  if (!quizStarted) {
    return (
      <Card className={cn("w-full max-w-lg mx-auto shadow-xl animate-in fade-in zoom-in-95 duration-500 ease-out", className)}>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary flex items-center justify-center gap-2">
            <Filter className="h-6 w-6" /> Quiz Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-lg font-semibold mb-2 block">Filter cards by status:</Label>
            <RadioGroup defaultValue="all" value={quizFilter} onValueChange={(value: QuizFilter) => setQuizFilter(value)} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="r-all" />
                <Label htmlFor="r-all">All Cards ({deck.flashcards.length})</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="learning" id="r-learning" />
                <Label htmlFor="r-learning">Learning ({deck.flashcards.filter(fc => fc.status === 'learning' || !fc.status).length})</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mastered" id="r-mastered" />
                <Label htmlFor="r-mastered">Mastered ({deck.flashcards.filter(fc => fc.status === 'mastered').length})</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={startTheQuiz} size="lg" className="w-full active:scale-95 transition-transform">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }


  if (quizFinished) {
    return (
      <Card className={cn("w-full max-w-lg mx-auto shadow-xl animate-in fade-in zoom-in-95 duration-500 ease-out", className)}>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-xl">Your score: <span className="font-bold text-accent">{score}</span> / {shuffledFlashcards.length}</p>
          <Progress value={(score / shuffledFlashcards.length) * 100} className="w-full" />
          <p className="text-lg">
            {score / shuffledFlashcards.length >= 0.8 ? "Excellent work! 🎉" : 
             score / shuffledFlashcards.length >= 0.5 ? "Good job, keep practicing! 👍" :
             "Keep trying, you'll get there! 💪"}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={resetQuiz} size="lg" className="active:scale-95 transition-transform">
            <Repeat className="mr-2 h-5 w-5" /> Restart Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }


  if (!currentFlashcard) {
     // This can happen briefly if startTheQuiz is called and cardsToQuiz is empty, though that's handled above.
     // Or if shuffledFlashcards is empty for other reasons (should not happen if quizStarted is true).
     return (
      <Card className={cn("w-full max-w-lg mx-auto shadow-xl", className)}>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          Preparing quiz...
        </CardContent>
      </Card>
     );
  }


  return (
    <Card className={cn("w-full max-w-2xl mx-auto shadow-xl flex flex-col min-h-[500px]", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-lg sm:text-xl text-primary truncate">{currentFlashcard.title}</CardTitle>
            <span className="text-xs sm:text-sm text-muted-foreground">
                Card {currentCardIndex + 1} of {shuffledFlashcards.length}
            </span>
        </div>
        <Progress value={((currentCardIndex + 1) / shuffledFlashcards.length) * 100} className="w-full" />
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-center items-center p-4 text-center min-h-[200px]">
        <ScrollArea className="w-full max-h-[150px] mb-4 animate-in fade-in duration-300">
            <div className="text-xl sm:text-2xl font-semibold mb-2 prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentFlashcard.front}</ReactMarkdown>
            </div>
        </ScrollArea>
        {isAnswerVisible && (
          <ScrollArea className="w-full max-h-[150px] p-3 bg-muted/50 rounded-md animate-in fade-in duration-300">
            <div className="text-lg sm:text-xl text-accent prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentFlashcard.back}</ReactMarkdown>
            </div>
          </ScrollArea>
        )}
        {isExplaining && (
          <div className="mt-4 text-center animate-in fade-in duration-300">
            <Loader2 className="h-6 w-6 animate-spin text-accent mx-auto" />
            <p className="text-sm text-muted-foreground">Getting explanation...</p>
          </div>
        )}
        {explanation && (
          <ScrollArea className="mt-4 p-3 bg-secondary/30 rounded-md max-h-[100px] w-full animate-in fade-in duration-300">
            <div className="text-sm border-l-2 border-accent pl-2 text-left">
              <p className="font-semibold text-accent flex items-center gap-1"><Lightbulb size={16}/> Simplified:</p>
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-4 border-t">
        {!isAnswerVisible ? (
          <Button onClick={handleShowAnswer} className="w-full active:scale-95 transition-transform" size="lg">
            <RotateCcw className="mr-2 h-5 w-5" /> Show Answer
          </Button>
        ) : (
          <>
            {!feedbackGiven ? (
              <div className="flex flex-col sm:flex-row justify-around w-full gap-3">
                <Button onClick={() => handleFeedback(false)} variant="destructive" className="flex-1 active:scale-95 transition-transform" size="lg">
                  <ThumbsDown className="mr-2 h-5 w-5" /> Incorrect
                </Button>
                <Button onClick={() => handleFeedback(true)} variant="default" className="bg-green-500 hover:bg-green-600 text-white flex-1 active:scale-95 transition-transform" size="lg">
                  <ThumbsUp className="mr-2 h-5 w-5" /> Correct
                </Button>
              </div>
            ) : (
              <Button onClick={moveToNextCard} className="w-full active:scale-95 transition-transform" size="lg">
                Next Card <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </>
        )}
        <div className="flex flex-col sm:flex-row w-full sm:justify-between items-center mt-2 gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={handleExplain} disabled={isExplaining || !currentFlashcard} className="w-full sm:w-auto active:scale-95 transition-transform">
            {isExplaining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            Explain this
          </Button>
          <span className="text-sm font-medium text-muted-foreground">Score: {score}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
