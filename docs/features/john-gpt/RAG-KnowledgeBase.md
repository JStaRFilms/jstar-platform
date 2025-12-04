# Feature: JohnGPT RAG & Knowledge Base

## 1. Purpose

The Retrieval-Augmented Generation (RAG) system allows JohnGPT to access and answer questions about J StaR Films' specific business data (services, portfolio, pricing) which is not present in the AI model's training data. It uses vector embeddings to semantically search the knowledge base and inject relevant context into the chat.

## 2. Architecture Overview

### 2.1. Components

1.  **Embedding Model:** Google Gemini `text-embedding-004`.
2.  **Vector Database:** Neon Postgres with `pgvector` extension.
3.  **Search Logic:** Cosine similarity search via Prisma raw queries.
4.  **AI Tool:** `searchKnowledge` tool exposed to the LLM.

### 2.2. Data Flow

1.  **User Query:** "How much does a music video cost?"
2.  **Tool Call:** LLM decides to call `searchKnowledge({ query: "music video pricing" })`.
3.  **Embedding:** System generates a vector embedding for the query using Gemini.
4.  **Vector Search:** Database finds the most similar content chunks using cosine similarity.
5.  **Context Injection:** Relevant chunks are formatted and returned to the LLM.
6.  **Response:** LLM generates a natural language answer using the retrieved information.

## 3. Implementation Details

### 3.1. Database Schema

The system uses a `site_embeddings` table in Postgres:

```sql
model SiteEmbedding {
  id        String                 @id @default(uuid())
  pageUrl   String                 @map("page_url")
  pageTitle String                 @map("page_title")
  content   String                 @map("content_chunk")
  embedding Unsupported("vector")? // pgvector type
  createdAt DateTime               @default(now()) @map("created_at")

  @@map("site_embeddings")
}
```

### 3.2. RAG Utilities (`src/lib/ai/rag-utils.ts`)

*   `generateQueryEmbedding(query)`: Calls Gemini API to get a 768-dimensional vector.
*   `searchKnowledgeBase(query, limit, threshold)`: Executes raw SQL query to find nearest neighbors.
*   `formatSearchResults(results)`: Formats the retrieved chunks into a string for the LLM context window.

### 3.3. AI Tool Definition (`src/app/api/chat/route.ts`)

The tool is defined using the Vercel AI SDK:

```typescript
searchKnowledge: tool({
  description: 'Search the knowledge base for information about services, portfolio, pricing...',
  inputSchema: z.object({
    query: z.string().describe('What to search for in the knowledge base'),
  }),
  execute: async ({ query }) => {
    const results = await searchKnowledgeBase(query, 5, 0.5);
    return formatSearchResults(results);
  },
}),
```

## 4. Usage Guidelines

### When to use RAG?
The system is designed to trigger RAG when the user asks about:
*   **Services & Offerings** (e.g., "Do you do web design?")
*   **Pricing & Rates** (e.g., "What are your hourly rates?")
*   **Portfolio & Past Work** (e.g., "Show me your music videos.")
*   **Company Info** (e.g., "Who is John?")

### When NOT to use RAG?
*   General coding questions (e.g., "How do I center a div?")
*   Creative writing tasks (e.g., "Write a poem.")
*   General knowledge (e.g., "What is the capital of France?")

## 5. Maintenance

### Updating the Knowledge Base
Currently, the knowledge base is populated via a seeding script (`scripts/embed-site.ts`). To update the knowledge base:
1.  Update the content on the website or in the source files.
2.  Run the embedding script: `npm run embed-site`.

### Verification
Use the verification script to test retrieval accuracy:
`npx tsx scripts/verify-rag.ts "your test query"`
