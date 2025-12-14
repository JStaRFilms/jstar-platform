import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { MessageSchema } from '../schema';
import { z } from 'zod';

export type ConversationMessage = z.infer<typeof MessageSchema>;

export class ConversationService {
    /**
     * Get a single conversation by ID
     */
    static async getConversation(id: string, userId: string) {
        const conversation = await prisma.conversation.findUnique({
            where: { id },
        });

        if (!conversation || conversation.userId !== userId) {
            return null;
        }

        return conversation;
    }

    /**
     * List all conversations for a user
     */
    static async listConversations(userId: string) {
        return prisma.conversation.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                title: true,
                updatedAt: true,
                createdAt: true,
                messageCount: true,
                personaId: true,
                selectedModelId: true,
                localVersion: true,
                syncedVersion: true,
            },
        });
    }

    /**
     * Create a new conversation
     */
    static async createConversation(
        userId: string,
        data: {
            id?: string;
            title?: string;
            messages?: ConversationMessage[];
            personaId?: string;
            selectedModelId?: string;
            localVersion?: number;
        }
    ) {
        return prisma.conversation.create({
            data: {
                id: data.id, // Optional, defaults to cuid if undefined
                userId,
                title: data.title || 'New Chat',
                messages: (data.messages as any) || [],
                messageCount: data.messages?.length || 0,
                personaId: data.personaId,
                selectedModelId: data.selectedModelId,
                localVersion: data.localVersion || 1,
                syncedVersion: data.localVersion || 1, // Assume synced on create
                lastMessageAt: new Date(),
            },
        });
    }

    /**
     * Update a conversation (Full sync)
     * This is designed to be idempotent and handle conflicts via versioning if needed
     */
    static async updateConversation(
        id: string,
        userId: string,
        data: {
            title?: string;
            messages: ConversationMessage[];
            messageCount?: number;
            localVersion: number;
            personaId?: string;
            selectedModelId?: string;
        }
    ) {
        // Ideally we check versions here, but for now we just allow last-write-wins
        // Enforce ownership by filtering on both id and userId using updateMany
        const result = await prisma.conversation.updateMany({
            where: { id, userId },
            data: {
                title: data.title,
                messages: data.messages as any,
                messageCount: data.messages.length,
                localVersion: data.localVersion,
                syncedVersion: data.localVersion,
                personaId: data.personaId,
                selectedModelId: data.selectedModelId,
                lastMessageAt: new Date(),
            },
        });

        if (result.count === 0) {
            // Not found or not owned by user
            throw new Error('Not Found');
        }

        return prisma.conversation.findUnique({ where: { id } });
    }

    /**
     * Delete a conversation
     */
    static async deleteConversation(id: string, userId: string) {
        const result = await prisma.conversation.deleteMany({ where: { id, userId } });
        if (result.count === 0) {
            throw new Error('Not Found');
        }
        return { id } as any;
    }
}
