/*
  Warnings:

  - A unique constraint covering the columns `[workosId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN "picture" TEXT;
ALTER TABLE "users" ADD COLUMN "workosId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_workosId_key" ON "users"("workosId");
