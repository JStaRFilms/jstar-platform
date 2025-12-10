/*
  Warnings:

  - Made the column `messages` on table `conversations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."conversations" ADD COLUMN     "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "localVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "messageCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "selectedModelId" TEXT,
ADD COLUMN     "syncedVersion" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "messages" SET NOT NULL,
ALTER COLUMN "messages" SET DEFAULT '[]';

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "defaultModelId" TEXT,
ADD COLUMN     "paidModelUsageResetAt" TIMESTAMP(3),
ADD COLUMN     "paidModelUsageToday" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."ai_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "apiKey" TEXT,
    "baseUrl" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_models" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "minTier" "public"."UserTier" NOT NULL DEFAULT 'GUEST',
    "contextWindow" INTEGER,
    "hasVision" BOOLEAN NOT NULL DEFAULT false,
    "hasImageGen" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "iconUrl" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "requestsPerMinute" INTEGER,
    "requestsPerDay" INTEGER,
    "tokensPerMinute" INTEGER,
    "tokensPerDay" INTEGER,
    "maxOutputTokens" INTEGER,
    "tierContextCaps" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_model_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 1,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_model_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_providers_name_key" ON "public"."ai_providers"("name");

-- CreateIndex
CREATE INDEX "ai_models_minTier_idx" ON "public"."ai_models"("minTier");

-- CreateIndex
CREATE INDEX "ai_models_isActive_sortOrder_idx" ON "public"."ai_models"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "ai_models_isFeatured_sortOrder_idx" ON "public"."ai_models"("isFeatured", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ai_models_providerId_modelId_key" ON "public"."ai_models"("providerId", "modelId");

-- CreateIndex
CREATE INDEX "user_model_usage_userId_usageCount_idx" ON "public"."user_model_usage"("userId", "usageCount");

-- CreateIndex
CREATE UNIQUE INDEX "user_model_usage_userId_modelId_key" ON "public"."user_model_usage"("userId", "modelId");

-- AddForeignKey
ALTER TABLE "public"."ai_models" ADD CONSTRAINT "ai_models_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."ai_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_model_usage" ADD CONSTRAINT "user_model_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_model_usage" ADD CONSTRAINT "user_model_usage_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "public"."ai_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;
