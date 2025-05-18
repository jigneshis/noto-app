
// src/components/footer.tsx
'use client';

import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-8 mt-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1.5">
          Crafted with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by Beasty, dedicated to enhancing your quality of life.
        </p>
        <p className="mt-1">
          Powered by Turri.ai
        </p>
      </div>
    </footer>
  );
}
