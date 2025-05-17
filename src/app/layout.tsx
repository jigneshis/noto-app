
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
// import { AuthProvider } from '@/contexts/auth-context'; // Removed
import { ThemeProvider } from 'next-themes';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-geist-sans', // Using Geist variable name for consistency with scaffold
});

export const metadata: Metadata = {
  title: 'NOTO by beasty powered by turri.ai',
  description: 'Create, organize, and share flashcards with AI-powered features.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased transition-colors duration-700 ease-in-out',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange 
        >
          {/* <AuthProvider> Removed AuthProvider */}
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          {/* </AuthProvider> Removed AuthProvider */}
        </ThemeProvider>
      </body>
    </html>
  );
}
