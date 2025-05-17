# NOTO by beasty powered by turri.ai

Welcome to NOTO, your personal AI-powered flashcard companion! This application helps you create, organize, study, and master new subjects with unparalleled ease.

## Features

*   **AI-Powered Flashcard Generation**: Create flashcards from text or summarize content with AI.
*   **Deck Organization**: Manage your study materials by creating custom decks.
*   **Interactive Quizzing**: Test your knowledge with engaging quiz sessions.
*   **Simplified Explanations**: Get complex topics explained clearly by AI.
*   **User Authentication**: Secure sign-in with Google or Email/Password.
*   **Shareable Decks**: (Coming Soon!) Easily share your study decks.
*   **Light & Dark Mode**: Study comfortably, any time of day or night.

## Tech Stack

*   **Next.js**: React framework for server-side rendering and static site generation.
*   **React**: JavaScript library for building user interfaces.
*   **TypeScript**: Superset of JavaScript for type safety.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **ShadCN UI**: Re-usable UI components.
*   **Firebase**: Backend services, primarily for Authentication in this version.
*   **Genkit (by Firebase)**: AI integration toolkit.

## Getting Started

1.  **Clone the repository (once you've set it up on GitHub):**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

3.  **Set up environment variables:**
    *   Create a `.env.local` file in the root of your project.
    *   Copy the contents of `.env` (or `.env.example` if provided) into `.env.local`.
    *   Fill in your Firebase project credentials (API Key, Auth Domain, Project ID, etc.). You can get these from your Firebase project settings.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    ```
    The application should now be running, typically at `http://localhost:9002`.

5.  **Run Genkit development server (for AI features):**
    In a separate terminal:
    ```bash
    npm run genkit:dev
    ```

## Project Structure

*   `src/app/`: Main application pages (App Router).
*   `src/components/`: Reusable UI components.
*   `src/lib/`: Utility functions, Firebase configuration, local storage logic.
*   `src/ai/`: Genkit flows and AI-related code.
*   `src/contexts/`: React context providers (e.g., AuthContext).
*   `public/`: Static assets.

To get started with editing, take a look at `src/app/page.tsx`.
