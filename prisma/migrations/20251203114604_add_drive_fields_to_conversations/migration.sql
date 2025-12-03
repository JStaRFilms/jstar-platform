/*
  Warnings:

  - Made the column `title` on table `conversations` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `role` to the `personas` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."embedding_idx";

-- AlterTable
ALTER TABLE "public"."conversations" ADD COLUMN     "driveFileId" TEXT,
ADD COLUMN     "driveVersion" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "title" SET DEFAULT 'New Chat',
ALTER COLUMN "messages" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."personas" ADD COLUMN     "role" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "conversations_userId_updatedAt_idx" ON "public"."conversations"("userId", "updatedAt");
