-- CreateTable
CREATE TABLE "public"."page_navigation" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "requiredTier" "public"."UserTier" NOT NULL DEFAULT 'GUEST',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "embedding" vector(768) NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_navigation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "page_navigation_url_key" ON "public"."page_navigation"("url");

-- CreateIndex
CREATE INDEX "page_navigation_category_idx" ON "public"."page_navigation"("category");

-- CreateIndex
CREATE INDEX "page_navigation_requiredTier_idx" ON "public"."page_navigation"("requiredTier");
