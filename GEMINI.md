# GEMINI Project Analysis: jstar-platform

## Project Overview

This project, "jstar-platform", is a comprehensive, AI-first personal web platform for John Oluleke-Oke (J StaR Films). It's built with Next.js 15, TypeScript, and Tailwind CSS v4, utilizing a Prisma ORM with a PostgreSQL database.

The platform is designed as a "Creative Operating System" with a multi-tiered architecture:

*   **Public-facing Website:** A portfolio, blog, and services site.
*   **JohnGPT:** A powerful, multi-engine AI assistant with features like conversation history, persona switching, and a prompt library.
*   **Creator Growth Engine:** A suite of tools for audience growth and client acquisition.
*   **Admin Dashboard:** A comprehensive backend for content management (CMS), user management, system diagnostics, and analytics.

The database schema is extensive, supporting features like:
*   Dynamic hero slides for the homepage.
*   Contact submission and newsletter subscriber management.
*   A multi-tiered user system with different access levels.
*   A virtual file storage system with Google Drive integration.
*   A sophisticated AI backend with configurable providers (OpenAI, Google, Groq, etc.), models, and personas.
*   Site content embeddings for Retrieval-Augmented Generation (RAG).

## Building and Running

### Prerequisites
- Node.js 18+
- npm

### Installation & Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    Create a `.env` file and populate it with the necessary database URL and other secrets. A `DIRECT_URL` for Prisma is also required.
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    # ... other secrets
    ```

3.  **Sync Database Schema:**
    This command applies any pending migrations to the database.
    ```bash
    npx prisma db push
    ```

### Development

*   **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5782`.

### Production

*   **Build the application:**
    ```bash
    npm run build
    ```

*   **Start the production server:**
    ```bash
    npm run start
    ```

### Database Commands

*   **Generate Prisma Client:** (This is also run automatically after `npm install`)
    ```bash
    npx prisma generate
    ```

*   **Seed the database:**
    Populates the database with initial data as defined in `prisma/seed.ts`.
    ```bash
    npm run db:seed
    ```

*   **Regenerate All Embeddings (Navigation + RAG):**
    ```bash
    npm run db:embeddings
    ```

*   **Reset and Reseed Database:**
    Forces a database reset, reseeds it, AND regenerates all embeddings. **Warning: This will delete all data.**
    ```bash
    npm run db:reset
    ```

*   **Open Prisma Studio:**
    A GUI for viewing and editing data in your database.
    ```bash
    npx prisma studio
    ```

### Adding New Seed Data (Auto-Discovery)

The seeding system **auto-discovers** all `seed-*.ts` files in the `prisma/` folder. To add new constant data:

1. Create a new file: `prisma/seed-YOUR_NAME.ts`
2. Export a `seed()` function that receives a PrismaClient:

```typescript
import { PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
    console.log('🌱 Seeding YOUR_NAME...');
    
    await prisma.yourModel.upsert({
        where: { uniqueField: 'value' },
        update: { /* fields to update if exists */ },
        create: { /* fields to create if new */ },
    });
    
    console.log('   ✅ YOUR_NAME seeded');
}
```

3. Run `npm run db:seed` - the new seeder will be auto-discovered and executed.

**Key**: Always use `upsert` with a unique field so seeds are idempotent (safe to run multiple times).



## Key Scripts

All utility scripts are in `src/scripts/`:

*   `embed-site.ts`: Creates vector embeddings from site content for the RAG system.
*   `populate-navigation.ts` / `populate-sections.ts`: Populates navigation and page section data with vector embeddings.
*   `verify-*.ts` / `test-*.ts`: Debug and verification utilities.

## Development Conventions

*   **Framework:** Next.js 14/15 with the App Router.
*   **Language:** TypeScript with strict mode enabled.
*   **Styling:** Tailwind CSS v4 with a custom `@theme` configuration. See `docs/Styling-in-Next-and-Tailwind-v4.md`.
*   **Database:** Prisma is the ORM. Schema is defined in `prisma/schema.prisma`.
*   **Component Architecture:** Adherence to a Single Responsibility Principle. Components over 200 lines are flagged for refactoring. See `docs/coding_guidelines.md`.
*   **State Management:** Primarily React Hooks and custom stores. TanStack React Query is used for server-state management.
*   **Documentation:** The `docs/` directory is the single source of truth for all project documentation, including PRDs, architectural decisions, and coding guidelines.
