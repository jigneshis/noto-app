
// src/app/privacy/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PrivacyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
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
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6">Privacy Policy</h1>
        
        {lastUpdated && <p className="text-muted-foreground mb-6">Last updated: {lastUpdated}</p>}

        <h2 className="text-2xl font-semibold mt-8 mb-3">1. Introduction</h2>
        <p>
          Welcome to NOTO by beasty powered by turri.ai ("Application", "we", "us", or "our"). 
          This Privacy Policy informs you of our policies regarding the collection, use, and 
          disclosure of personal data when you use our Application and the choices you have 
          associated with that data.
        </p>
        <p>
          We use your data to provide and improve the Application. By using the Application, 
          you agree to the collection and use of information in accordance with this policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">2. Information Collection and Use</h2>
        <p>
          <strong>Local Storage:</strong> The Application primarily stores your data, including flashcard decks and 
          their content, directly on your device using your web browser's local storage. This data is not 
          transmitted to or stored on our servers. We do not have access to the specific content you create 
          and store locally.
        </p>
        <p>
          <strong>AI Features:</strong> When you use AI-powered features (e.g., generating flashcards from text, 
          summarizing content, explaining content), the text or topic you provide is sent to a third-party 
          AI service provider (Google AI via Genkit) to process your request and generate a response. We do not store 
          this input data on our servers after the request is processed by the AI service. The AI service 
          provider may have its own data retention policies. We encourage you to review Google's privacy policies.
        </p>
        <p>
          <strong>Usage Data (Analytics - if implemented):</strong> We may collect information on how the Application is accessed and 
          used ("Usage Data"). This Usage Data may include information such as your computer's Internet 
          Protocol address (e.g., IP address), browser type, browser version, the pages of our 
          Application that you visit, the time and date of your visit, the time spent on those pages, 
          unique device identifiers, and other diagnostic data. <em>(Note: This section is a placeholder; 
          currently, no specific analytics are implemented beyond what the AI provider might collect anonymously).</em>
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">3. Use of Data</h2>
        <p>NOTO uses the collected data for various purposes:</p>
        <ul>
          <li>To provide and maintain the Application (primarily via local storage)</li>
          <li>To provide AI-powered features</li>
          <li>To allow you to participate in interactive features of our Application when you choose to do so</li>
          <li>To provide customer support (if applicable)</li>
          <li>To gather analysis or valuable information so that we can improve the Application (future possibility)</li>
          <li>To monitor the usage of the Application (future possibility)</li>
          <li>To detect, prevent, and address technical issues</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">4. Data Security</h2>
        <p>
          The security of your data is important to us. Data stored locally is subject to the security 
          of your own device and browser. For data transmitted to AI services, we rely on the security 
          measures implemented by Google AI. However, remember that no method of transmission over 
          the Internet or method of electronic storage is 100% secure.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-3">5. Children's Privacy</h2>
        <p>
          Our Application does not address anyone under the age of 13 ("Children"). We do not 
          knowingly collect personally identifiable information from anyone under the age of 13. 
          If you are a parent or guardian and you are aware that your Children has provided us with 
          Personal Data, please contact us. If we become aware that we have collected Personal Data 
          from children without verification of parental consent, we take steps to remove that 
          information from our servers (if any such data were to be collected server-side in the future).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">6. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by 
          posting the new Privacy Policy on this page.
        </p>
        <p>
          We will let you know via email and/or a prominent notice on our Application, prior to the 
          change becoming effective and update the "effective date" at the top of this Privacy Policy.
        </p>
        <p>
          You are advised to review this Privacy Policy periodically for any changes. Changes to this 
          Privacy Policy are effective when they are posted on this page.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us (details to be provided by Application owner).
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
