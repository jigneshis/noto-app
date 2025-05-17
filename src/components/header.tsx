
'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { UserNav } from '@/components/user-nav';
import { LogIn } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { ThemeToggle } from './theme-toggle';


export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-10 w-auto flex-shrink-0" /> {/* Adjusted size, colors are fixed in SVG */}
          {/* The "NOTO" text is now part of the Logo SVG */}
          <div className="flex flex-col justify-center"> {/* Div to help align tagline */}
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
          {loading ? (
             <Skeleton className="h-8 w-20" />
          ) : user ? (
            <UserNav />
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">
                <LogIn className="mr-1 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
