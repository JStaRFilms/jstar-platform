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
        return prisma.conversation.findFirst({ where: { id, userId } });
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
        try {
            const updated = await prisma.conversation.update({
                where: { id },
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
            // Ownership is ensured by the route pre-check; if additional safety is required,
            // switch to a composite unique constraint and filter on both id and userId.
            return updated;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new Error('Not Found');
            }
            throw error;
        }
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
