
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { Flashcard } from '@/lib/types';
import { Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { generateImageForFlashcardAction } from '@/lib/actions'; // Import new action
import { useToast } from '@/hooks/use-toast';

interface FlashcardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (flashcard: Omit<Flashcard, 'id'> | Flashcard) => void;
  initialData?: Flashcard | null;
}

export function FlashcardForm({ isOpen, onClose, onSubmit, initialData }: FlashcardFormProps) {
  const [title, setTitle] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [status, setStatus] = useState<Flashcard['status']>('learning');
  const [frontImage, setFrontImage] = useState<string | undefined>(undefined);
  const [backImage, setBackImage] = useState<string | undefined>(undefined);
  const [isGeneratingFrontImage, setIsGeneratingFrontImage] = useState(false);
  const [isGeneratingBackImage, setIsGeneratingBackImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setFront(initialData.front);
      setBack(initialData.back);
      setStatus(initialData.status || 'learning');
      setFrontImage(initialData.frontImage || undefined);
      setBackImage(initialData.backImage || undefined);
    } else {
      setTitle('');
      setFront('');
      setBack('');
      setStatus('learning');
      setFrontImage(undefined);
      setBackImage(undefined);
    }
    setIsLoading(false);
    setIsGeneratingFrontImage(false);
    setIsGeneratingBackImage(false);
  }, [initialData, isOpen]);

  const handleGenerateImage = async (contentType: 'front' | 'back') => {
    const textForPrompt = contentType === 'front' ? front : back;
    if (!textForPrompt.trim()) {
      toast({ title: 'Cannot Generate Image', description: `Please provide some text for the ${contentType} of the card first.`, variant: 'destructive' });
      return;
    }

    contentType === 'front' ? setIsGeneratingFrontImage(true) : setIsGeneratingBackImage(true);
    try {
      // Construct a slightly more descriptive prompt if a title exists
      const prompt = title.trim() ? `Flashcard titled "${title}": ${textForPrompt}` : textForPrompt;
      const imageDataUri = await generateImageForFlashcardAction(prompt);
      if (contentType === 'front') {
        setFrontImage(imageDataUri);
      } else {
        setBackImage(imageDataUri);
      }
      toast({ title: 'Image Generated!', description: `AI generated an image for the ${contentType} of the card.` });
    } catch (error) {
      console.error(error);
      toast({ title: 'Image Generation Failed', description: (error as Error).message, variant: 'destructive' });
    } finally {
      contentType === 'front' ? setIsGeneratingFrontImage(false) : setIsGeneratingBackImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !front.trim() || !back.trim()) {
      alert('All fields (Title, Question, Answer) are required.');
      return;
    }
    setIsLoading(true);
    const flashcardData = {
      id: initialData?.id || crypto.randomUUID(),
      title,
      front,
      back,
      status,
      frontImage,
      backImage,
    };
    try {
      onSubmit(flashcardData as Flashcard); // Cast to Flashcard as ID is now always present
    } catch (error) {
      console.error("Error submitting flashcard form:", error);
    } finally {
      setIsLoading(false);
      if (!initialData || (initialData && initialData.id === flashcardData.id)) {
        onClose();
      }
    }
  };

  const commonImageStyles = "w-full h-32 object-contain border rounded-md bg-muted/20 p-1 mt-2";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading && !isGeneratingFrontImage && !isGeneratingBackImage) onClose(); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Flashcard' : 'Create New Flashcard'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="flashcard-title">Title</Label>
              <Input
                id="flashcard-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="flashcard-front">Front (Question)</Label>
              <Textarea
                id="flashcard-front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="col-span-3 mt-1 min-h-[100px]"
                rows={3}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">Markdown supported.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleGenerateImage('front')}
                disabled={isGeneratingFrontImage || isLoading}
                className="mt-2 text-xs active:scale-95 transition-transform"
              >
                {isGeneratingFrontImage ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Sparkles className="mr-2 h-3 w-3 text-accent" />}
                Generate Image for Front
              </Button>
              {frontImage && <img data-ai-hint="flashcard visual" src={frontImage} alt="Generated for front" className={commonImageStyles} />}
            </div>
            <div>
              <Label htmlFor="flashcard-back">Back (Answer)</Label>
              <Textarea
                id="flashcard-back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                className="col-span-3 mt-1 min-h-[100px]"
                rows={3}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">Markdown supported.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleGenerateImage('back')}
                disabled={isGeneratingBackImage || isLoading}
                className="mt-2 text-xs active:scale-95 transition-transform"
              >
                {isGeneratingBackImage ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Sparkles className="mr-2 h-3 w-3 text-accent" />}
                Generate Image for Back
              </Button>
              {backImage && <img data-ai-hint="flashcard visual" src={backImage} alt="Generated for back" className={commonImageStyles} />}
            </div>
            <div>
              <Label className="mb-1 block">Status</Label>
              <RadioGroup
                value={status}
                onValueChange={(value: Flashcard['status']) => setStatus(value)}
                className="flex gap-4"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="learning" id="status-learning" />
                  <Label htmlFor="status-learning">Learning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mastered" id="status-mastered" />
                  <Label htmlFor="status-mastered">Mastered</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading || isGeneratingFrontImage || isGeneratingBackImage}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || isGeneratingFrontImage || isGeneratingBackImage || !title.trim() || !front.trim() || !back.trim()} className="active:scale-95 transition-transform">
              {(isLoading || isGeneratingFrontImage || isGeneratingBackImage) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Flashcard'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

