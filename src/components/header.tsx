import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { NotebookPen } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl sm:inline-block">
            Card Weaver
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          {/* Add navigation items here if needed later */}
        </nav>
        {/* Add dark mode toggle or user profile button here later if needed */}
      </div>
    </header>
  );
}
