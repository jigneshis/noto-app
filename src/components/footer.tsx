
// src/components/footer.tsx
'use client';

import { Heart, Github } from 'lucide-react';
import Link from 'next/link';

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
        <p className="mt-4">
          Feel free to get and modify this app according to your needs.
        </p>
        <a
          href="https://github.com/jigneshis/noto-app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-primary hover:underline mt-1"
        >
          <Github className="h-4 w-4" />
          View on GitHub
        </a>
        <div className="mt-4 flex justify-center items-center gap-x-4 text-xs">
          <Link href="/terms" className="hover:text-primary hover:underline">
            Terms & Conditions
          </Link>
          <span className="text-muted-foreground/50">|</span>
          <Link href="/privacy" className="hover:text-primary hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
