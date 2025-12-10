/**
 * IndexedDB Client for JohnGPT Local Caching
 * 
 * Provides fast, local storage for conversations with offline support.
 * Used as a cache layer - Google Drive is the source of truth.
 * 
 * Features:
 * - Instant conversation loading (no network delay)
 * - Offline queue for pending syncs
 * - Automatic cache invalidation
 * - Storage size management
 */

import type { ConversationFile } from './google-drive-client';

// ============================================================================
// Types
// ============================================================================

export type CachedConversation = ConversationFile & {
    driveFileId?: string;
    lastSyncedAt: number;
    isDirty: number; // 1 (true) or 0 (false) - IndexedDB doesn't support boolean keys
    localVersion?: number;
    personaId?: string | null;
    selectedModelId?: string | null;
};

export type SyncQueueItem = {
    conversationId: string;
    queuedAt: number;
    retryCount: number;
    lastError?: string;
};

// ============================================================================
// Constants
// ============================================================================

const DB_NAME = 'jstargpt_cache';
const DB_VERSION = 1;
const STORE_CONVERSATIONS = 'conversations';
const STORE_SYNC_QUEUE = 'sync_queue';

// ============================================================================
// IndexedDB Client Class
// ============================================================================

export class IndexedDBClient {
    private db: IDBDatabase | null = null;
    private initPromise: Promise<void> | null = null;

    /**
     * Initialize the IndexedDB database
     * Creates stores if they don't exist
     */
    async init(): Promise<void> {
        // Return existing init promise if already initializing
        if (this.initPromise) {
            return this.initPromise;
        }

        // Return immediately if already initialized
        if (this.db) {
            return Promise.resolve();
        }

        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                reject(new Error('Failed to open IndexedDB'));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create conversations store
                if (!db.objectStoreNames.contains(STORE_CONVERSATIONS)) {
                    const conversationStore = db.createObjectStore(STORE_CONVERSATIONS, {
                        keyPath: 'conversationId',
                    });
                    conversationStore.createIndex('userId', 'userId', { unique: false });
                    conversationStore.createIndex('updatedAt', 'updatedAt', { unique: false });
                    conversationStore.createIndex('isDirty', 'isDirty', { unique: false });
                }

                // Create sync queue store
                if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
                    const queueStore = db.createObjectStore(STORE_SYNC_QUEUE, {
                        keyPath: 'conversationId',
                    });
                    queueStore.createIndex('queuedAt', 'queuedAt', { unique: false });
                }
            };
        });

        return this.initPromise;
    }

    /**
     * Check if IndexedDB is supported in the current browser
     */
    static isSupported(): boolean {
        return typeof indexedDB !== 'undefined';
    }

    // ==========================================================================
    // Conversation Cache Operations
    // ==========================================================================

    /**
     * Save a conversation to the local cache
     */
    async saveConversation(conversation: CachedConversation): Promise<void> {
        await this.init();
        if (!this.db) throw new Error('IndexedDB not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_CONVERSATIONS], 'readwrite');
            const store = transaction.objectStore(STORE_CONVERSATIONS);

            const request = store.put(conversation);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get a conversation from the local cache
     */
    async getConversation(conversationId: string): Promise<CachedConversation | null> {
        await this.init();
        if (!this.db) throw new Error('IndexedDB not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_CONVERSATIONS], 'readonly');
            const store = transaction.objectStore(STORE_CONVERSATIONS);

            const request = store.get(conversationId);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * List all cached conversations for a user
     * Returns sorted by most recently updated
     */
    async listConversations(userId: string): Promise<CachedConversation[]> {
        await this.init();
        if (!this.db) throw new Error('IndexedDB not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_CONVERSATIONS], 'readonly');
            const store = transaction.objectStore(STORE_CONVERSATIONS);
            const index = store.index('userId');

            const request = index.getAll(userId);

            request.onsuccess = () => {
                const conversations = request.result || [];
                // Sort by updatedAt descending (most recent first)
                conversations.sort((a, b) => {
                    const dateA = new Date(a.updatedAt).getTime();
                    const dateB = new Date(b.updatedAt).getTime();
                    return dateB - dateA;
                });
                resolve(conversations);
            };

            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete a conversation from the cache
     */
    async deleteConversation(conversationId: string): Promise<void> {
        await this.init();
        if (!this.db) throw new Error('IndexedDB not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_CONVERSATIONS], 'readwrite');
            const store = transaction.objectStore(STORE_CONVERSATIONS);

            const request = store.delete(conversationId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all conversations marked as dirty (pending sync)
     */
    async getDirtyConversations(): Promise<CachedConversation[]> {
        await this.init();
        if (!this.db) throw new Error('IndexedDB not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_CONVERSATIONS], 'readonly');
            const store = transaction.objectStore(STORE_CONVERSATIONS);
            const index = store.index('isDirty');

            const request = index.getAll(1);

            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Mark a conversation as clean (synced to Drive)
     */
    async markConversationClean(
        conversationId: string,
        driveFileId: string,
        lastSyncedAt: number
    ): Promise<void> {
        const conversation = await this.getConversation(conversationId);
        if (!conversation) {
            throw new Error(`Conversation ${conversationId} not found in cache`);
        }

        conversation.isDirty = 0;
        conversation.driveFileId = driveFileId;
        conversation.lastSyncedAt = lastSyncedAt;

        await this.saveConversation(conversation);
    }

    // ==========================================================================
    // Sync Queue Operations
    // ==========================================================================

    /**
     * Add a conversation to the sync queue
     */
    async addToSyncQueue(conversationId: string): Promise<void> {
        await this.init();
        if (!this.db) throw new Error('IndexedDB not initialized');

        const queueItem: SyncQueueItem = {
            conversationId,
            queuedAt: Date.now(),
            retryCount: 0,
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_SYNC_QUEUE], 'readwrite');
            const store = transaction.objectStore(STORE_SYNC_QUEUE);

            const request = store.put(queueItem);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all items in the sync queue
     */
    async getSyncQueue(): Promise<SyncQueueItem[]> {
        await this.init();
        if (!this.db) throw new Error('IndexedDB not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_SYNC_QUEUE], 'readonly');
            const store = transaction.objectStore(STORE_SYNC_QUEUE);

            const request = store.getAll();

            request.onsuccess = () => {
                const items = request.result || [];
                // Sort by queuedAt ascending (oldest first)
                items.sort((a, b) => a.queuedAt - b.queuedAt);
                resolve(items);
            };

            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Remove a conversation from the sync queue
     */
    async removeFromSyncQueue(conversationId: string): Promise<void> {
        await this.init();
        if (!this.db) throw new Error('IndexedDB not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_SYNC_QUEUE], 'readwrite');
            const store = transaction.objectStore(STORE_SYNC_QUEUE);

            const request = store.delete(conversationId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Update retry count for a queue item
     */
    async updateSyncQueueRetry(
        conversationId: string,
        retryCount: number,
        error?: string
    ): Promise<void> {
        await this.init();
        if (!this.db) throw new Error('IndexedDB not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_SYNC_QUEUE], 'readwrite');
            const store = transaction.objectStore(STORE_SYNC_QUEUE);

            const getRequest = store.get(conversationId);

            getRequest.onsuccess = () => {
                const item = getRequest.result;
                if (!item) {
                    reject(new Error(`Queue item ${conversationId} not found`));
                    return;
                }

                item.retryCount = retryCount;
                if (error) {
                    item.lastError = error;
                }

                const putRequest = store.put(item);

                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject(putRequest.error);
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    // ==========================================================================
    // Utility Methods
    // ==========================================================================

    /**
     * Clear all data from the cache
     * WARNING: This will delete all conversations and queue items
     */
    async clearAll(): Promise<void> {
        await this.init();
        if (!this.db) throw new Error('IndexedDB not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [STORE_CONVERSATIONS, STORE_SYNC_QUEUE],
                'readwrite'
            );

            const conversationStore = transaction.objectStore(STORE_CONVERSATIONS);
            const queueStore = transaction.objectStore(STORE_SYNC_QUEUE);

            conversationStore.clear();
            queueStore.clear();

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    /**
     * Get cache statistics
     */
    async getStats(): Promise<{
        totalConversations: number;
        dirtyConversations: number;
        queuedItems: number;
    }> {
        await this.init();
        if (!this.db) throw new Error('IndexedDB not initialized');

        const [total, dirty, queued] = await Promise.all([
            this.getConversationCount(),
            this.getDirtyConversationCount(),
            this.getQueueCount(),
        ]);

        return {
            totalConversations: total,
            dirtyConversations: dirty,
            queuedItems: queued,
        };
    }

    private async getConversationCount(): Promise<number> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_CONVERSATIONS], 'readonly');
            const store = transaction.objectStore(STORE_CONVERSATIONS);

            const request = store.count();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private async getDirtyConversationCount(): Promise<number> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_CONVERSATIONS], 'readonly');
            const store = transaction.objectStore(STORE_CONVERSATIONS);
            const index = store.index('isDirty');

            const request = index.count(1);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private async getQueueCount(): Promise<number> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_SYNC_QUEUE], 'readonly');
            const store = transaction.objectStore(STORE_SYNC_QUEUE);

            const request = store.count();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Close the database connection
     */
    close(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
            this.initPromise = null;
        }
    }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const indexedDBClient = new IndexedDBClient();
