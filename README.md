# NOTO by beasty powered by turri.ai

Welcome to NOTO, your personal AI-powered flashcard companion! This application helps you create, organize, study, and master new subjects with unparalleled ease, storing all your data conveniently in your browser's local storage.

## Features

*   **AI-Powered Flashcard Suite**:
    *   **Generate from Topic/Text**: Provide a topic (e.g., "Key Concepts of Photosynthesis") or paste text, and AI will generate a comprehensive set of flashcards.
    *   **Summarize Content**: Paste your notes, and AI will summarize them into key flashcards.
    *   **Simplified Explanations**: Get complex topics on your flashcards explained simply by AI during study or quizzes.
*   **Deck Organization & Customization**:
    *   Create, edit, and delete custom flashcard decks.
    *   Personalize decks with unique accent colors.
    *   Organize decks with tags and filter by them.
    *   Duplicate entire decks with a single click.
    *   Visualize your learning progress with a mastery percentage shown on each deck.
*   **Advanced Flashcard Management**:
    *   Create, edit, and delete individual flashcards within your decks.
    *   Use the "Quick Add" form on the deck page for rapid card creation.
    *   Format flashcard content (questions and answers) using Markdown (bold, italics, lists, etc.).
    *   Track your learning by setting flashcard status to "Learning" or "Mastered".
*   **Interactive & Targeted Quizzing**:
    *   Test your knowledge with engaging quiz sessions.
    *   Filter quizzes to focus on "All Cards," "Learning," or "Mastered" cards.
    *   Flip cards, mark answers as correct/incorrect, and get AI explanations for difficult concepts.
*   **Modern User Experience**:
    *   Fully responsive design for use on desktops, tablets, and mobile devices.
    *   Switch between Light and Dark themes with smooth transitions.
    *   Intuitive interface with an Apple-inspired aesthetic and fluid animations.
    *   Efficiently find your study materials with search bars for decks and flashcards.
*   **Local Data Storage**: All your decks and flashcards are stored directly in your browser's local storage, ensuring privacy and quick access without needing an account.

## Tech Stack

*   **Next.js**: React framework for building the user interface and application structure.
*   **React**: JavaScript library for building user interfaces.
*   **TypeScript**: Superset of JavaScript for type safety.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **ShadCN UI**: Re-usable UI components, built with Radix UI and Tailwind CSS.
*   **Genkit (by Firebase/Google)**: AI integration toolkit for powering generative features.
*   **React Markdown & Remark GFM**: For rendering Markdown content on flashcards.
*   **Lucide React**: For icons.
*   **Next-Themes**: For theme (light/dark mode) management.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jigneshis/noto-app.git
    cd noto-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

3.  **Set up environment variables (for AI features):**
    *   Create a `.env.local` file in the root of your project.
    *   You'll need an API key for the AI provider (e.g., Google AI Studio for Gemini). Add it to your `.env.local` file:
        ```
        GOOGLE_API_KEY=your_google_api_key_here
        ```
    *   *Note: The `.env` file in the repository provides a template for required environment variables.*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running, typically at `http://localhost:9002`.

5.  **Run Genkit development server (for AI features):**
    In a separate terminal:
    ```bash
    npm run genkit:dev
    ```
    This starts the Genkit development UI, typically on `http://localhost:4000`, where you can inspect and test your AI flows.

## Project Structure

*   `src/app/`: Main application pages (Next.js App Router).
    *   `src/app/globals.css`: Global styles and Tailwind CSS theme configuration.
    *   `src/app/layout.tsx`: Root layout component.
*   `src/components/`: Reusable UI components (e.g., `DeckCard`, `FlashcardForm`).
    *   `src/components/ui/`: ShadCN UI components.
*   `src/lib/`: Utility functions and local storage logic (`localStorageStore.ts`).
    *   `src/lib/actions.ts`: Server actions, primarily for calling Genkit flows.
*   `src/ai/`: Genkit flows and AI-related code.
    *   `src/ai/genkit.ts`: Genkit global instance configuration.
    *   `src/ai/flows/`: Individual Genkit flows for AI features.
*   `public/`: Static assets.

To get started with editing, take a look at `src/app/page.tsx`.
