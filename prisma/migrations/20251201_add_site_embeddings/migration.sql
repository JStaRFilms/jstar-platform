-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable: site_embeddings
-- Stores embedded chunks of site content for RAG retrieval
CREATE TABLE "site_embeddings" (
    "id" TEXT NOT NULL,
    "page_url" TEXT NOT NULL,
    "page_title" TEXT NOT NULL,
    "content_chunk" TEXT NOT NULL,
    "embedding" vector(768) NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: HNSW index for fast vector similarity search
CREATE INDEX "embedding_idx" ON "site_embeddings" 
USING hnsw ("embedding" vector_cosine_ops);

-- CreateIndex: Regular index on page_url for filtering
CREATE INDEX "site_embeddings_page_url_idx" ON "site_embeddings"("page_url");
