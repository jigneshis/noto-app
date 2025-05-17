
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';

// Since the login feature was removed, this page is no longer functional
// and was intended to be deleted. This is a minimal version to prevent build errors.

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // If this page is somehow accessed, redirect to home.
    router.push('/');
  }, [router]);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-xl relative overflow-hidden">
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground z-20"
            onClick={() => router.push('/')}
            aria-label="Close"
        >
            <X className="h-5 w-5" />
        </Button>
        <CardHeader className="text-center pt-8 pb-4 z-10 relative bg-card/80 backdrop-blur-sm">
            <CardTitle className="text-2xl font-bold text-primary">Login Not Available</CardTitle>
            <CardDescription>The login feature has been removed. Redirecting...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
