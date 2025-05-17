'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateFlashcardsFromTextAction, summarizeContentIntoFlashcardsAction } from '@/lib/actions';
import type { Flashcard, Deck } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AiFlashcardGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDeckGenerated: (newDeck: Deck) => void;
}

export function AiFlashcardGeneratorDialog({ isOpen, onClose, onDeckGenerated }: AiFlashcardGeneratorDialogProps) {
  const [inputText, setInputText] = useState('');
  const [deckName, setDeckName] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'summarize'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!inputText.trim() || !deckName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both a topic/text and a deck name.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      let generatedFlashcards: Omit<Flashcard, 'id'>[] = [];
      if (activeTab === 'generate') {
        generatedFlashcards = await generateFlashcardsFromTextAction(inputText);
      } else {
        generatedFlashcards = await summarizeContentIntoFlashcardsAction(inputText);
      }

      if (generatedFlashcards.length === 0) {
        toast({
          title: 'No Flashcards Generated',
          description: 'The AI could not generate flashcards from the provided input. Try refining your text or topic.',
          variant: 'default',
        });
        setIsLoading(false);
        return;
      }
      
      const newDeck: Deck = {
        id: crypto.randomUUID(),
        name: deckName,
        description: `AI-generated deck from ${activeTab === 'generate' ? 'topic/text' : 'summary'}: "${inputText.substring(0, 50)}..."`,
        flashcards: generatedFlashcards.map(fc => ({ ...fc, id: crypto.randomUUID() })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onDeckGenerated(newDeck);
      toast({
        title: 'Deck Generated!',
        description: `Successfully generated ${generatedFlashcards.length} flashcards for the deck "${deckName}".`,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Deck',
        description: (error as Error).message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setInputText('');
      setDeckName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Deck with AI</DialogTitle>
          <DialogDescription>
            Let AI help you create flashcards. Choose a method below.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="generate" onValueChange={(value) => setActiveTab(value as 'generate' | 'summarize')} className="w-full pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">From Text/Topic</TabsTrigger>
            <TabsTrigger value="summarize">Summarize Content</TabsTrigger>
          </TabsList>
          <div className="py-4 space-y-4">
             <div>
                <Label htmlFor="deckNameAi">Deck Name</Label>
                <Input
                    id="deckNameAi"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    placeholder="e.g., Photosynthesis Process"
                    className="mt-1"
                />
            </div>
            <TabsContent value="generate" className="mt-0">
              <div>
                <Label htmlFor="topicText">Topic or Text</Label>
                <Textarea
                  id="topicText"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter a topic like 'Cellular Respiration' or paste a paragraph of text..."
                  className="min-h-[150px] mt-1"
                />
              </div>
            </TabsContent>
            <TabsContent value="summarize" className="mt-0">
              <div>
                <Label htmlFor="contentText">Content to Summarize</Label>
                <Textarea
                  id="contentText"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste the content you want to summarize into flashcards..."
                  className="min-h-[150px] mt-1"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleGenerate} disabled={isLoading || !inputText.trim() || !deckName.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Flashcards
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
