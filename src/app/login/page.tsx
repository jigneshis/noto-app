
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { GoogleIcon } from '@/components/icons'; 
import { Loader2, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/'); // Redirect to home if already logged in
    }
  }, [user, authLoading, router]);

  const handleAuthSuccess = () => {
    toast({ title: 'Success!', description: 'You are now logged in.' });
    router.push('/'); 
  };

  const handleAuthError = (error: any, action: string) => {
    console.error(`${action} error:`, error);
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Try logging in.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. It should be at least 6 characters.';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Google Sign-In cancelled.';
          // Don't show toast for this specific case, but still log it.
          console.log(errorMessage);
          return; 
        default:
          errorMessage = error.message;
      }
    }
    toast({ title: `${action} Failed`, description: errorMessage, variant: 'destructive' });
  };

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error, 'Sign In');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error, 'Sign Up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error, 'Google Sign-In');
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  if (authLoading || user) {
    // Show loading or redirect handled by useEffect
    return <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-xl relative">
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground z-10"
            onClick={() => router.push('/')}
            aria-label="Close"
        >
            <X className="h-5 w-5" />
        </Button>
        <Tabs defaultValue="signin" className="w-full">
          <CardHeader className="text-center pt-8"> {/* Added padding top to avoid overlap with X button */}
            <CardTitle className="text-2xl">Welcome to NOTO</CardTitle>
            <CardDescription>Sign in or create an account to continue</CardDescription>
            <TabsList className="grid w-full grid-cols-2 mt-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <TabsContent value="signin">
            <form onSubmit={handleEmailSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-signin">Password</Label>
                  <Input
                    id="password-signin"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleEmailSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="Create a password (min. 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <div className="px-6 pb-6">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="mr-2 h-5 w-5" />
              )}
              Google
            </Button>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
