/**
 * Conversation Persistence Hook
 * 
 * Centralized hook for loading/saving JohnGPT conversations
 * Orchestrates between IndexedDB (cache) and Google Drive (cloud storage)
 * 
 * Features:
 * - Loads from cache first (instant), then syncs with Drive in background
 * - Queues saves with debouncing to reduce API calls
 * - Tracks sync status for UI feedback
 * - Handles offline scenarios
 * - Generates conversation titles automatically
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { syncManager, type SyncStatus, type SyncEvent } from '@/lib/storage/sync-manager';
import { indexedDBClient, type CachedConversation } from '@/lib/storage/indexeddb-client';
import { googleDriveClient, type ConversationFile } from '@/lib/storage/google-drive-client';
import type { UIMessage } from '@ai-sdk/react';

// ============================================================================
// Types
// ============================================================================

export type ConversationMetadata = {
    id: string;
    title: string;
    updatedAt: string;
    messageCount: number;
};

export type UseConversationPersistenceReturn = {
    // Loading
    loadConversation: (id: string) => Promise<ConversationFile | null>;
    isLoading: boolean;
    loadError: string | null;

    // Saving
    saveConversation: (
        conversationId: string,
        userId: string,
        title: string,
        messages: UIMessage[]
    ) => Promise<void>;

    // Listing
    listConversations: (userId: string) => Promise<ConversationMetadata[]>;

    // Deleting
    deleteConversation: (conversationId: string) => Promise<void>;

    // Sync status
    syncStatus: SyncStatus;
    lastSyncedAt: Date | null;
    pendingChanges: number;

    // Manual sync
    forceSyncConversation: (conversationId: string) => Promise<void>;

    // Title generation
    generateTitle: (conversationId: string, messages: UIMessage[]) => Promise<string>;
};

// ============================================================================
// Hook
// ============================================================================

export function useConversationPersistence(
    conversationId?: string
): UseConversationPersistenceReturn {
    // State
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
    const [pendingChanges, setPendingChanges] = useState(0);

    // Refs
    const syncUnsubscribeRef = useRef<(() => void) | null>(null);

    // ========================================================================
    // Sync Event Listener
    // ========================================================================

    useEffect(() => {
        // Subscribe to sync events
        const unsubscribe = syncManager.onSyncEvent((event: SyncEvent) => {
            // Only update state if this event is for our conversation
            if (!conversationId || event.conversationId === conversationId) {
                setSyncStatus(event.status);

                if (event.status === 'synced') {
                    setLastSyncedAt(new Date(event.timestamp));
                }
            }
        });

        syncUnsubscribeRef.current = unsubscribe;

        // Update pending changes count periodically
        const updatePendingChanges = async () => {
            try {
                const stats = await indexedDBClient.getStats();
                setPendingChanges(stats.queuedItems);
            } catch (error) {
                console.error('[useConversationPersistence] Failed to get stats:', error);
            }
        };

        const interval = setInterval(updatePendingChanges, 10000); // Every 10 seconds
        updatePendingChanges(); // Initial call

        return () => {
            if (syncUnsubscribeRef.current) {
                syncUnsubscribeRef.current();
            }
            clearInterval(interval);
        };
    }, [conversationId]);

    // ========================================================================
    // Load Conversation
    // ========================================================================

    const loadConversation = useCallback(async (id: string): Promise<ConversationFile | null> => {
        setIsLoading(true);
        setLoadError(null);

        try {
            const conversation = await syncManager.loadConversation(id);

            if (!conversation) {
                setLoadError(`Conversation ${id} not found`);
                return null;
            }

            return conversation;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load conversation';
            setLoadError(errorMessage);
            console.error('[useConversationPersistence] Load error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ========================================================================
    // Save Conversation
    // ========================================================================

    const saveConversation = useCallback(async (
        conversationId: string,
        userId: string,
        title: string,
        messages: UIMessage[]
    ): Promise<void> => {
        try {
            await syncManager.saveConversation(conversationId, userId, title, messages);
        } catch (error) {
            console.error('[useConversationPersistence] Save error:', error);
            throw error;
        }
    }, []);

    // ========================================================================
    // List Conversations
    // ========================================================================

    const listConversations = useCallback(async (userId: string): Promise<ConversationMetadata[]> => {
        try {
            const conversations = await syncManager.listConversations(userId);

            // Transform to metadata format
            return conversations.map((conv) => ({
                id: conv.conversationId,
                title: conv.title,
                updatedAt: conv.updatedAt,
                messageCount: conv.messages.length,
            }));
        } catch (error) {
            console.error('[useConversationPersistence] List error:', error);
            return [];
        }
    }, []);

    // ========================================================================
    // Delete Conversation
    // ========================================================================

    const deleteConversation = useCallback(async (conversationId: string): Promise<void> => {
        try {
            await syncManager.deleteConversation(conversationId);
        } catch (error) {
            console.error('[useConversationPersistence] Delete error:', error);
            throw error;
        }
    }, []);

    // ========================================================================
    // Force Sync
    // ========================================================================

    const forceSyncConversation = useCallback(async (conversationId: string): Promise<void> => {
        try {
            setSyncStatus('syncing');
            await syncManager.forceSyncConversation(conversationId);
        } catch (error) {
            console.error('[useConversationPersistence] Force sync error:', error);
            setSyncStatus('error');
            throw error;
        }
    }, []);

    // ========================================================================
    // Generate Title
    // ========================================================================

    const generateTitle = useCallback(async (
        conversationId: string,
        messages: UIMessage[]
    ): Promise<string> => {
        // Only generate title if we have at least 2 messages (user + assistant)
        if (messages.length < 2) {
            return 'New Chat';
        }

        try {
            // Call API route to generate title
            const response = await fetch(`/api/conversations/${conversationId}/title`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages.slice(0, 4), // Only send first 2 exchanges
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate title');
            }

            const data = await response.json();
            return data.title || 'New Chat';
        } catch (error) {
            console.error('[useConversationPersistence] Title generation error:', error);

            // Fallback: Create title from first user message
            const firstUserMessage = messages.find((m) => m.role === 'user');
            if (firstUserMessage && firstUserMessage.parts) {
                const textPart = firstUserMessage.parts.find((p: any) => p.type === 'text');
                if (textPart && 'text' in textPart) {
                    const text = textPart.text.slice(0, 50);
                    return text.length < 50 ? text : `${text}...`;
                }
            }

            return 'New Chat';
        }
    }, []);

    // ========================================================================
    // Return
    // ========================================================================

    return {
        loadConversation,
        isLoading,
        loadError,
        saveConversation,
        listConversations,
        deleteConversation,
        syncStatus,
        lastSyncedAt,
        pendingChanges,
        forceSyncConversation,
        generateTitle,
    };
}
