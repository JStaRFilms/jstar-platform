-- CreateTable
CREATE TABLE "public"."page_sections" (
    "id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "element_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "embedding" vector(768) NOT NULL,
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_sections_element_id_idx" ON "public"."page_sections"("element_id");

-- CreateIndex
CREATE UNIQUE INDEX "page_sections_page_id_element_id_key" ON "public"."page_sections"("page_id", "element_id");

-- AddForeignKey
ALTER TABLE "public"."page_sections" ADD CONSTRAINT "page_sections_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."page_navigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
