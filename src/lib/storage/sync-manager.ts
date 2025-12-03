/**
 * Sync Manager for JohnGPT Conversations
 * 
 * Orchestrates synchronization between:
 * - IndexedDB (local cache, instant access)
 * - Google Drive (cloud backup, source of truth)
 * 
 * Features:
 * - Debounced saves (5-second delay to reduce API calls)
 * - Conflict resolution (last-write-wins via timestamps)
 * - Offline queue (syncs when network reconnects)
 * - Background sync (Web Background Sync API)
 * - Event emitters for UI feedback
 */

import { googleDriveClient, type ConversationFile, type GoogleDriveError } from './google-drive-client';
import { indexedDBClient, type CachedConversation } from './indexeddb-client';
import type { UIMessage } from '@ai-sdk/react';

// ============================================================================
// Types
// ============================================================================

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

export type SyncEvent = {
    conversationId: string;
    status: SyncStatus;
    error?: string;
    timestamp: number;
};

type SyncListener = (event: SyncEvent) => void;

type DebouncedSave = {
    conversationId: string;
    timeoutId: NodeJS.Timeout;
    scheduledAt: number;
};

// ============================================================================
// Constants
// ============================================================================

const DEBOUNCE_DELAY_MS = 5000; // 5 seconds
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAYS = [30000, 60000, 120000]; // 30s, 1m, 2m
const NETWORK_CHECK_INTERVAL = 10000; // 10 seconds

// ============================================================================
// Sync Manager Class
// ============================================================================

export class SyncManager {
    private listeners: SyncListener[] = [];
    private debouncedSaves: Map<string, DebouncedSave> = new Map();
    private syncStatus: Map<string, SyncStatus> = new Map();
    private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
    private networkCheckInterval: NodeJS.Timeout | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            // Listen for online/offline events
            window.addEventListener('online', this.handleOnline.bind(this));
            window.addEventListener('offline', this.handleOffline.bind(this));

            // Periodic network check (some browsers don't fire events reliably)
            this.startNetworkCheck();
        }
    }

    // ==========================================================================
    // Public API
    // ==========================================================================

    /**
     * Save a conversation with debouncing
     * Updates IndexedDB immediately, queues Drive sync for later
     */
    async saveConversation(
        conversationId: string,
        userId: string,
        title: string,
        messages: UIMessage[]
    ): Promise<void> {
        // Convert UIMessage[] to StoredMessage[]
        const storedMessages = messages.map((msg) => ({
            ...msg,
            ...msg,
            createdAt: new Date().toISOString(),
            metadata: msg.metadata as any,
        }));

        // 1. Save to IndexedDB immediately (instant feedback)
        const cachedConversation: CachedConversation = {
            version: 1,
            conversationId,
            userId,
            title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: storedMessages,
            lastSyncedAt: Date.now(),
            isDirty: 1, // Mark as dirty (pending sync)
        };

        await indexedDBClient.saveConversation(cachedConversation);

        // 2. Queue debounced sync to Drive
        this.queueDebouncedSync(conversationId);
    }

    /**
     * Load a conversation (IndexedDB first, Drive as fallback)
     * Implements "stale-while-revalidate" pattern
     */
    async loadConversation(conversationId: string): Promise<ConversationFile | null> {
        // 1. Try IndexedDB first (instant)
        const cached = await indexedDBClient.getConversation(conversationId);

        if (cached) {
            // Return cached data immediately
            // Background: fetch from Drive and update cache if newer
            this.revalidateFromDrive(conversationId, cached.updatedAt).catch((error) => {
                console.warn('[SyncManager] Background revalidation failed:', error);
            });

            return cached;
        }

        // 2. No cache - fetch from Drive
        if (!this.isOnline) {
            return null; // Can't fetch offline
        }

        try {
            const conversation = await googleDriveClient.loadConversation(conversationId);

            if (conversation) {
                // Save to cache for future use
                await this.updateCache(conversation, false);
            }

            return conversation;
        } catch (error) {
            console.error('[SyncManager] Failed to load from Drive:', error);
            return null;
        }
    }

    /**
     * List all conversations (from cache + Drive)
     * Returns cached data immediately, refreshes in background
     */
    async listConversations(userId: string): Promise<CachedConversation[]> {
        // 1. Get from cache (instant)
        const cached = await indexedDBClient.listConversations(userId);

        // 2. Background: refresh from Drive
        if (this.isOnline) {
            this.refreshConversationList(userId).catch((error) => {
                console.warn('[SyncManager] Background refresh failed:', error);
            });
        }

        return cached;
    }

    /**
     * Delete a conversation from everywhere
     */
    async deleteConversation(conversationId: string): Promise<void> {
        // 1. Delete from IndexedDB
        await indexedDBClient.deleteConversation(conversationId);

        // 2. Remove from sync queue if queued
        await indexedDBClient.removeFromSyncQueue(conversationId);

        // 3. Cancel any pending debounced saves
        this.cancelDebouncedSync(conversationId);

        // 4. Delete from Drive (if online)
        if (this.isOnline) {
            try {
                await googleDriveClient.deleteConversation(conversationId);
            } catch (error) {
                console.warn('[SyncManager] Failed to delete from Drive:', error);
                // Not critical - local deletion succeeded
            }
        }

        // 5. Emit event
        this.emitSyncEvent(conversationId, 'idle');
    }

    /**
     * Force immediate sync (no debounce)
     * Used for "Sync Now" button
     */
    async forceSyncConversation(conversationId: string): Promise<void> {
        // Cancel any pending debounced save
        this.cancelDebouncedSync(conversationId);

        // Sync immediately
        await this.syncConversationToDrive(conversationId);
    }

    /**
     * Process offline queue
     * Called when network reconnects
     */
    async processOfflineQueue(): Promise<void> {
        if (!this.isOnline) {
            console.warn('[SyncManager] Cannot process queue - offline');
            return;
        }

        const queue = await indexedDBClient.getSyncQueue();

        for (const item of queue) {
            try {
                await this.syncConversationToDrive(item.conversationId);
                await indexedDBClient.removeFromSyncQueue(item.conversationId);
            } catch (error) {
                // Update retry count
                const newRetryCount = item.retryCount + 1;

                if (newRetryCount >= MAX_RETRY_ATTEMPTS) {
                    console.error(
                        `[SyncManager] Max retries reached for ${item.conversationId}`,
                        error
                    );
                    await indexedDBClient.removeFromSyncQueue(item.conversationId);
                } else {
                    await indexedDBClient.updateSyncQueueRetry(
                        item.conversationId,
                        newRetryCount,
                        (error as Error).message
                    );

                    // Schedule retry
                    this.scheduleRetry(item.conversationId, newRetryCount);
                }
            }
        }
    }

    /**
     * Get sync status for a conversation
     */
    getSyncStatus(conversationId: string): SyncStatus {
        return this.syncStatus.get(conversationId) || 'idle';
    }

    /**
     * Subscribe to sync events
     */
    onSyncEvent(listener: SyncListener): () => void {
        this.listeners.push(listener);

        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    /**
     * Cleanup resources
     */
    cleanup(): void {
        // Cancel all debounced saves
        for (const save of this.debouncedSaves.values()) {
            clearTimeout(save.timeoutId);
        }
        this.debouncedSaves.clear();

        // Stop network check
        if (this.networkCheckInterval) {
            clearInterval(this.networkCheckInterval);
            this.networkCheckInterval = null;
        }

        // Remove event listeners
        if (typeof window !== 'undefined') {
            window.removeEventListener('online', this.handleOnline.bind(this));
            window.removeEventListener('offline', this.handleOffline.bind(this));
        }
    }

    // ==========================================================================
    // Private Methods - Debouncing
    // ==========================================================================

    /**
     * Queue a debounced sync to Drive
     * If called multiple times, resets the timer
     */
    private queueDebouncedSync(conversationId: string): void {
        // Cancel existing debounced save
        this.cancelDebouncedSync(conversationId);

        // Schedule new save
        const timeoutId = setTimeout(() => {
            this.debouncedSaves.delete(conversationId);
            this.syncConversationToDrive(conversationId).catch((error) => {
                console.error('[SyncManager] Debounced sync failed:', error);
            });
        }, DEBOUNCE_DELAY_MS);

        this.debouncedSaves.set(conversationId, {
            conversationId,
            timeoutId,
            scheduledAt: Date.now(),
        });
    }

    /**
     * Cancel a debounced sync
     */
    private cancelDebouncedSync(conversationId: string): void {
        const existing = this.debouncedSaves.get(conversationId);
        if (existing) {
            clearTimeout(existing.timeoutId);
            this.debouncedSaves.delete(conversationId);
        }
    }

    // ==========================================================================
    // Private Methods - Sync Logic
    // ==========================================================================

    /**
     * Sync a conversation to Google Drive
     */
    private async syncConversationToDrive(conversationId: string): Promise<void> {
        if (!this.isOnline) {
            // Add to offline queue
            await indexedDBClient.addToSyncQueue(conversationId);
            this.emitSyncEvent(conversationId, 'offline');
            return;
        }

        // Update status
        this.emitSyncEvent(conversationId, 'syncing');

        try {
            // 1. Get from IndexedDB
            const cached = await indexedDBClient.getConversation(conversationId);
            if (!cached) {
                throw new Error(`Conversation ${conversationId} not found in cache`);
            }

            // 2. Upload to Drive
            const { fileId, updatedAt } = await googleDriveClient.saveConversation({
                conversationId: cached.conversationId,
                userId: cached.userId,
                title: cached.title,
                createdAt: cached.createdAt,
                updatedAt: cached.updatedAt,
                messages: cached.messages,
            });

            // 3. Update cache with Drive metadata
            await indexedDBClient.markConversationClean(
                conversationId,
                fileId,
                Date.now()
            );

            // 4. Update status
            this.emitSyncEvent(conversationId, 'synced');
        } catch (error) {
            const driveError = error as GoogleDriveError;

            // Handle quota errors specially
            if (driveError.code === 403 || driveError.code === 429) {
                // Add to queue for retry
                await indexedDBClient.addToSyncQueue(conversationId);
                this.scheduleRetry(conversationId, 0);
            }

            this.emitSyncEvent(conversationId, 'error', driveError.message);
            throw error;
        }
    }

    /**
     * Revalidate from Drive in the background
     * Updates cache if Drive version is newer
     */
    private async revalidateFromDrive(
        conversationId: string,
        cachedUpdatedAt: string
    ): Promise<void> {
        if (!this.isOnline) {
            return;
        }

        try {
            const driveConversation = await googleDriveClient.loadConversation(conversationId);

            if (!driveConversation) {
                return;
            }

            // Compare timestamps
            const cachedTime = new Date(cachedUpdatedAt).getTime();
            const driveTime = new Date(driveConversation.updatedAt).getTime();

            // Drive version is newer - update cache
            if (driveTime > cachedTime) {
                await this.updateCache(driveConversation, false);
            }
            // Cache is newer - upload to Drive
            else if (cachedTime > driveTime) {
                await this.syncConversationToDrive(conversationId);
            }
        } catch (error) {
            console.warn('[SyncManager] Revalidation failed:', error);
        }
    }

    /**
     * Refresh conversation list from Drive
     */
    private async refreshConversationList(userId: string): Promise<void> {
        try {
            const driveList = await googleDriveClient.listConversations();

            for (const item of driveList) {
                // Check if we have it cached
                const cached = await indexedDBClient.getConversation(item.conversationId);

                // Not cached or outdated - fetch full conversation
                if (!cached || new Date(cached.updatedAt).getTime() < new Date(item.updatedAt).getTime()) {
                    const full = await googleDriveClient.loadConversation(item.conversationId);
                    if (full) {
                        await this.updateCache(full, false);
                    }
                }
            }
        } catch (error) {
            console.warn('[SyncManager] List refresh failed:', error);
        }
    }

    /**
     * Update IndexedDB cache with Drive data
     */
    private async updateCache(conversation: ConversationFile, isDirty: boolean): Promise<void> {
        const cached: CachedConversation = {
            ...conversation,
            lastSyncedAt: Date.now(),
            isDirty: isDirty ? 1 : 0,
        };

        await indexedDBClient.saveConversation(cached);
    }

    // ==========================================================================
    // Private Methods - Network & Retry
    // ==========================================================================

    /**
     * Handle online event
     */
    private handleOnline(): void {
        console.log('[SyncManager] Network online - processing queue');
        this.isOnline = true;
        this.processOfflineQueue().catch((error) => {
            console.error('[SyncManager] Queue processing failed:', error);
        });
    }

    /**
     * Handle offline event
     */
    private handleOffline(): void {
        console.log('[SyncManager] Network offline');
        this.isOnline = false;
    }

    /**
     * Start periodic network check
     */
    private startNetworkCheck(): void {
        this.networkCheckInterval = setInterval(() => {
            const wasOnline = this.isOnline;
            this.isOnline = navigator.onLine;

            // If just came online, process queue
            if (!wasOnline && this.isOnline) {
                this.handleOnline();
            }
        }, NETWORK_CHECK_INTERVAL);
    }

    /**
     * Schedule a retry with exponential backoff
     */
    private scheduleRetry(conversationId: string, retryCount: number): void {
        const delay = RETRY_DELAYS[Math.min(retryCount, RETRY_DELAYS.length - 1)];

        setTimeout(() => {
            if (this.isOnline) {
                this.syncConversationToDrive(conversationId).catch((error) => {
                    console.error('[SyncManager] Retry failed:', error);
                });
            }
        }, delay);
    }

    // ==========================================================================
    // Private Methods - Events
    // ==========================================================================

    /**
     * Emit a sync event to all listeners
     */
    private emitSyncEvent(conversationId: string, status: SyncStatus, error?: string): void {
        this.syncStatus.set(conversationId, status);

        const event: SyncEvent = {
            conversationId,
            status,
            error,
            timestamp: Date.now(),
        };

        for (const listener of this.listeners) {
            try {
                listener(event);
            } catch (err) {
                console.error('[SyncManager] Listener error:', err);
            }
        }
    }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const syncManager = new SyncManager();
