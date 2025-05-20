
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NoteForm } from '@/components/note-form';
import type { Note, NoteAnalysisResult } from '@/lib/types';
import * as store from '@/lib/localStorageStore';
import { ArrowLeft, Edit, FileText, Loader2, Pin as PinIcon, PinOff as PinOffIcon, Search, Sparkles, X as XIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader as ModalHeader, DialogTitle as ModalTitle, DialogDescription as ModalDescription, DialogFooter as ModalFooter } from '@/components/ui/dialog';
import { analyzeNoteContentAction } from '@/lib/actions';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Component for highlighting text
const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-300 dark:bg-yellow-500 text-black px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
};


export default function NoteViewPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.noteId as string;

  const [note, setNote] = useState<Note | null>(null);
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [intraNoteSearchTerm, setIntraNoteSearchTerm] = useState('');
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [noteAnalysis, setNoteAnalysis] = useState<NoteAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  const handlePinToggle = () => {
    if (!note) return;
    const updatedNote = { ...note, isPinned: !note.isPinned };
    store.saveNote(updatedNote);
    setNote(updatedNote); // Update local state immediately
    toast({
      title: `Note ${updatedNote.isPinned ? 'Pinned' : 'Unpinned'}`,
      description: `"${note.title}" has been ${updatedNote.isPinned ? 'pinned.' : 'unpinned.'}`,
    });
  };

  const handleAnalyzeNote = async () => {
    if (!note || !note.content) {
        toast({ title: "Cannot Analyze", description: "Note content is empty.", variant: "destructive"});
        return;
    }
    setIsAnalyzing(true);
    setNoteAnalysis(null);
    try {
        const result = await analyzeNoteContentAction(note.content);
        setNoteAnalysis(result);
        setIsAnalysisModalOpen(true);
    } catch (error) {
        toast({ title: "AI Analysis Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
        setIsAnalyzing(false);
    }
  };
  
  // Custom renderer for react-markdown to highlight text
  const markdownComponents: Components = {
    text: (props) => {
      const { children } = props;
      if (typeof children === 'string') {
        return <HighlightedText text={children} highlight={intraNoteSearchTerm} />;
      }
      return <>{children}</>;
    },
    // Ensure other elements pass through correctly
    p: ({node, ...props}) => <p {...props} />,
    h1: ({node, ...props}) => <h1 {...props} />,
    h2: ({node, ...props}) => <h2 {...props} />,
    h3: ({node, ...props}) => <h3 {...props} />,
    li: ({node, ...props}) => <li {...props} />,
    ul: ({node, ...props}) => <ul {...props} />,
    ol: ({node, ...props}) => <ol {...props} />,
    strong: ({node, ...props}) => <strong {...props} />,
    em: ({node, ...props}) => <em {...props} />,
    code: ({node, inline, className, children, ...props}) => {
        const match = /language-(\w+)/.exec(className || '')
        if (!inline && match) {
             return <code className={className} {...props}>{children}</code>
        }
        return inline ? <code className={className} {...props}><HighlightedText text={String(children)} highlight={intraNoteSearchTerm} /></code> : <code className={className} {...props}>{children}</code>
    },
    a: ({node, ...props}) => <a {...props} />,
    // Add other elements as needed or use a more generic text node traversal if performance allows.
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
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
                onClick={handlePinToggle}
                variant="outline"
                className="animate-in fade-in slide-in-from-right-5 duration-500 delay-50 ease-out active:scale-95 transition-transform w-full sm:w-auto"
            >
                {note.isPinned ? <PinIcon className="mr-2 h-4 w-4 fill-primary text-primary" /> : <PinOffIcon className="mr-2 h-4 w-4" />}
                {note.isPinned ? 'Unpin Note' : 'Pin Note'}
            </Button>
            <Button
                onClick={handleAnalyzeNote}
                variant="outline"
                disabled={isAnalyzing}
                className="animate-in fade-in slide-in-from-right-5 duration-500 delay-100 ease-out active:scale-95 transition-transform w-full sm:w-auto"
            >
                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                Analyze with AI
            </Button>
            <Button
              onClick={() => setIsNoteFormOpen(true)}
              className="animate-in fade-in slide-in-from-right-5 duration-500 delay-150 ease-out active:scale-95 transition-transform w-full sm:w-auto"
              style={noteAccentColor ? { backgroundColor: noteAccentColor, color: 'hsl(var(--primary-foreground))' } : {}}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Note
            </Button>
        </div>
      </div>

      <div className="mb-6 relative animate-in fade-in slide-in-from-bottom-5 duration-500 delay-200 ease-out">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
            type="search"
            placeholder="Search within this note..."
            value={intraNoteSearchTerm}
            onChange={(e) => setIntraNoteSearchTerm(e.target.value)}
            className="pl-10 w-full md:max-w-sm"
        />
        {intraNoteSearchTerm && (
             <Button variant="ghost" size="icon" onClick={() => setIntraNoteSearchTerm('')} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                <XIcon className="h-4 w-4 text-muted-foreground"/>
             </Button>
        )}
      </div>

      <Card
        className="w-full animate-in fade-in zoom-in-95 duration-500 delay-250 ease-out"
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
           {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
                {note.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
            </div>
            )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[calc(100vh-20rem)]">
            <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {note.content}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <NoteForm
        isOpen={isNoteFormOpen}
        onClose={() => setIsNoteFormOpen(false)}
        onSubmit={handleNoteSubmit}
        initialData={note}
      />

      <Dialog open={isAnalysisModalOpen} onOpenChange={setIsAnalysisModalOpen}>
        <DialogContent className="sm:max-w-md">
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent"/>AI Note Analysis</ModalTitle>
            <ModalDescription>Summary and keywords generated by AI for your note "{note.title}".</ModalDescription>
          </ModalHeader>
          {noteAnalysis ? (
            <div className="py-4 space-y-4">
              <div>
                <h4 className="font-semibold text-primary mb-1">Summary:</h4>
                <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md">{noteAnalysis.summary}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-1">Keywords:</h4>
                <div className="flex flex-wrap gap-2">
                  {noteAnalysis.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">{keyword}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Loading analysis...</p>
            </div>
          )}
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsAnalysisModalOpen(false)}>Close</Button>
          </ModalFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
