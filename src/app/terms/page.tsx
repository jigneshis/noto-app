
// src/app/terms/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TermsPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // Set the effective date from the provided text
    setLastUpdated('May 17, 2025');
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/" passHref legacyBehavior>
          <Button variant="outline" className="active:scale-95 transition-transform">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>

      <article className="prose dark:prose-invert max-w-none bg-card p-6 sm:p-8 rounded-lg shadow-lg border">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6">Terms and Conditions – Noto (by BEASTY)</h1>
        
        {lastUpdated && <p className="text-muted-foreground mb-6">Effective Date: {lastUpdated}</p>}

        <p className="mb-6">
          Welcome to Noto, a flashcard-based digital notes platform powered by BEASTY and integrated with Turri AI. 
          By using our website or app (accessible at <a href="https://noto.beasty.in.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://noto.beasty.in.net</a>), 
          you agree to the following Terms and Conditions.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Noto, you agree to be bound by these Terms and our Privacy Policy. 
          If you do not agree, please do not use the service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">2. User Accounts</h2>
        <p>You must create an account to access certain features.</p>
        <p>You are responsible for keeping your login credentials secure.</p>
        <p>You may edit your username and profile picture at any time in the account settings.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">3. User-Generated Content</h2>
        <p>You may create, edit, and share flashcards.</p>
        <p>All content you create is your responsibility.</p>
        <p>Do not post any illegal, abusive, or inappropriate content.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">4. Custom URLs</h2>
        <p>Flashcards are accessible at:<br /><code>noto.beasty.in.net/{'{username}'}/{'{cardname}'}</code></p>
        <p>You may share your flashcards using this link.</p>
        <p>BEASTY reserves the right to disable or remove any link if it violates our policies.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">5. AI Integration (Turri)</h2>
        <p>Noto integrates AI services via Turri (powered by Gemini).</p>
        <p>Turri suggestions are for informational purposes and should not be taken as professional or academic advice.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">6. Data and Privacy</h2>
        <p>We store your notes, profile, and usage data to provide personalized services.</p>
        <p>
          We will not share your personal data with third parties without consent. (See our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for more details.)
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">7. Limitations</h2>
        <p>Noto is provided “as is.” We make no warranties of uptime, data accuracy, or AI response quality.</p>
        <p>BEASTY is not responsible for any loss of data, misuse, or interruption in service.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">8. Modifications</h2>
        <p>We may modify these Terms at any time.</p>
        <p>Changes will be posted on this page, and your continued use of Noto means you accept them.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">9. Termination</h2>
        <p>We may suspend or terminate your access to Noto if you violate these Terms.</p>
        <p>You can delete your account at any time by mailing us.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">10. Contact</h2>
        <p>For questions or support, please contact us at:<br />
          <a href="mailto:developer@turri.in.net" className="text-primary hover:underline">📧 developer@turri.in.net</a>
        </p>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Thank you for using NOTO!
          </p>
        </div>
      </article>
    </div>
  );
}

