
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { GoogleIcon } from '@/components/icons'; 
import { Loader2, X, Sparkles, Layers, Brain, Lightbulb, Share2, SunMoon, Fingerprint } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Flashcards',
    description: 'Generate and summarize flashcards with AI.',
  },
  {
    icon: Layers,
    title: 'Organize Your Learning',
    description: 'Create custom decks and manage your study materials.',
  },
  {
    icon: Brain,
    title: 'Interactive Quizzing',
    description: 'Test your knowledge with engaging quiz sessions.',
  },
  {
    icon: Lightbulb,
    title: 'Simplified Explanations',
    description: 'Get complex topics explained clearly by AI.',
  },
  {
    icon: Share2,
    title: 'Shareable Decks',
    description: 'Easily share your study decks with friends or classmates.',
  },
  {
    icon: SunMoon,
    title: 'Light & Dark Mode',
    description: 'Study comfortably, any time of day or night.',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('signin');

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/'); 
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
    return <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 animate-in fade-in-50 slide-in-from-bottom-10 duration-700 ease-out">
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
        <Tabs defaultValue="signin" value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <CardHeader className="text-center pt-8 pb-4 z-10 relative bg-card/80 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
                <Fingerprint className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Access Your NOTO Account</CardTitle>
            <CardDescription>Sign in or create an account to unlock your learning potential.</CardDescription>
            <TabsList className="grid w-full grid-cols-2 mt-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <div className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500 ease-out">
            <TabsContent value="signin">
              <form onSubmit={handleEmailSignIn}>
                <CardContent className="space-y-4 pt-4">
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
                <CardContent className="space-y-4 pt-4">
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
          </div>

          <div className="px-6 pb-6 animate-in fade-in-0 slide-in-from-bottom-5 delay-100 duration-500 ease-out">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
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

            <Separator className="my-6" />

            <div className="space-y-4 text-sm animate-in fade-in-0 slide-in-from-bottom-5 delay-200 duration-500 ease-out">
              <h3 className="text-center font-semibold text-primary text-lg">Why NOTO?</h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <feature.icon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{feature.title}</p>
                      <p className="text-muted-foreground text-xs">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
