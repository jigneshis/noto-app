
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
        <Link href="/" className="mr-6 flex items-start space-x-2">
          <Logo className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
          <div>
            <span className="font-bold text-xl sm:text-2xl text-primary"> {/* Adjusted text size for NOTO */}
              NOTO
            </span>
            <p className="text-[0.6rem] sm:text-xs text-muted-foreground leading-tight hidden sm:block"> {/* Smaller tagline */}
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
