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
        // from the authenticated user.

        // We update syncedVersion to match localVersion because the server IS the sync target.
        return prisma.conversation.update({
            where: { id, userId },
            data: {
                title: data.title,
                messages: data.messages as any,
                messageCount: data.messages.length, // Trust length over count
                localVersion: data.localVersion,
                syncedVersion: data.localVersion, // Acknowledge sync
                personaId: data.personaId,
                selectedModelId: data.selectedModelId,
                lastMessageAt: new Date(),
            },
        });
    }

    /**
     * Delete a conversation
     */
    static async deleteConversation(id: string, userId: string) {
        // Delete from DB logic
        // Also likely triggers a cascade delete if we had relation tables, 
        // but messages are JSON so it's simple.
        return prisma.conversation.delete({
            where: { id, userId },
        });
    }
}
