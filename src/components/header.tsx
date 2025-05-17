
'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons';
import { ThemeToggle } from './theme-toggle';


export function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-4 flex items-center space-x-2">
          <Logo className="h-10 w-auto text-primary flex-shrink-0" /> 
          <div className="flex flex-col justify-center ml-1">
            <p className="text-[0.6rem] sm:text-xs text-muted-foreground leading-tight hidden sm:block">
              by beasty powered by turri.ai
            </p>
          </div>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          {/* Add navigation items here if needed later */}
        </nav>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
