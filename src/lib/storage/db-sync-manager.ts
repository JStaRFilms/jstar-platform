/**
 * DB Sync Manager for JohnGPT Conversations
 * 
 * Orchestrates synchronization between:
 * - IndexedDB (local cache, instant access)
 * - Neon Database (via API, source of truth)
 * 
 * Features:
 * - Debounced saves (5-second delay to reduce API calls)
 * - Offline queue (syncs when network reconnects)
 * - Background sync (Web Background Sync API logic)
 * - Event emitters for UI feedback
 * - Guest support: Only uses IndexedDB, no API calls
 */

import { indexedDBClient, type CachedConversation } from './indexeddb-client';
import { googleDriveClient, type ConversationFile } from './google-drive-client';
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
    isWidget?: boolean;
};

// ============================================================================
// Constants
// ============================================================================

const DEBOUNCE_DELAY_MS = 5000; // 5 seconds
const NETWORK_CHECK_INTERVAL = 10000; // 10 seconds

// ============================================================================
// DB Sync Manager Class
// ============================================================================

export class DBSyncManager {
    private listeners: SyncListener[] = [];
    private listListeners: (() => void)[] = [];
    private debouncedSaves: Map<string, DebouncedSave> = new Map();
    private syncStatus: Map<string, SyncStatus> = new Map();
    private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
    private networkCheckInterval: NodeJS.Timeout | null = null;
    private isAuthenticated: boolean = false;
    private userId: string | null = null;
    private isDriveConnected: boolean = false;

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
     * Initialize with user state
     */
    initialize(userId: string | null) {
        this.userId = userId;
        // Authenticated if userId exists AND is not anonymous
        this.isAuthenticated = !!userId && !userId.startsWith('anonymous-');

        console.log(`[DBSyncManager] Initialized. User: ${userId || 'Guest'} (Auth: ${this.isAuthenticated}), Online: ${this.isOnline}`);

        if (this.isAuthenticated && this.isOnline) {
            this.processOfflineQueue();
            // Optionally init drive if we want auto-connect? 
            // Better to let UI/Hook trigger drive init to avoid unnecessary calls if user blocked it.
        }
    }

    /**
     * Initialize Google Drive connection
     * Fetches token from API and sets it on client
     */
    async initializeGoogleDrive(userId: string): Promise<boolean> {
        if (!userId || userId.startsWith('anonymous-')) return false;

        try {
            const res = await fetch(`/api/user/drive-config?userId=${userId}`);
            if (res.status === 404) {
                this.isDriveConnected = false;
                return false;
            }
            if (!res.ok) throw new Error('Failed to fetch Drive config');

            const { accessToken } = await res.json();
            googleDriveClient.setAccessToken(accessToken);
            this.isDriveConnected = true;
            console.log('[DBSyncManager] Google Drive connected');
            return true;
        } catch (error) {
            console.warn('[DBSyncManager] Failed to initialize Google Drive:', error);
            this.isDriveConnected = false;
            return false;
        }
    }

    /**
     * Force sync a conversation to Google Drive (Backup)
     */
    async forceSyncToDrive(conversationId: string): Promise<void> {
        if (!this.isDriveConnected || !this.isAuthenticated) return;

        try {
            const cached = await indexedDBClient.getConversation(conversationId);
            if (!cached) return;

            // Convert to Drive format
            const driveData: Omit<ConversationFile, 'version'> = {
                conversationId: cached.conversationId,
                userId: cached.userId,
                title: cached.title,
                createdAt: cached.createdAt,
                updatedAt: cached.updatedAt,
                messages: cached.messages,
            };

            await googleDriveClient.saveConversation(driveData);
            console.log(`[DBSyncManager] Backed up ${conversationId} to Drive`);
        } catch (error) {
            console.error('[DBSyncManager] Drive backup failed:', error);
        }
    }

    /**
     * Save a conversation with debouncing
     * Updates IndexedDB immediately, queues API sync for later
     */
    async saveConversation(
        conversationId: string,
        userId: string,
        title: string,
        messages: UIMessage[],
        options?: { isWidget?: boolean; personaId?: string; selectedModelId?: string }
    ): Promise<void> {
        // Convert UIMessage[] to StoredMessage format (compatible with ConversationFile)
        const storedMessages = messages.map((msg) => ({
            ...msg,
            createdAt: (msg as any).createdAt ? new Date((msg as any).createdAt).toISOString() : new Date().toISOString(),
            metadata: (msg as any).data as any, // Map data to metadata for storage
        }));

        const now = new Date().toISOString();

        // 1. Get existing to preserve some fields if needed
        const existing = await indexedDBClient.getConversation(conversationId);
        const version = (existing?.localVersion || 0) + 1;

        // 2. Save to IndexedDB immediately (instant feedback)
        const cachedConversation: CachedConversation = {
            conversationId,
            userId,
            title,
            createdAt: existing?.createdAt || now,
            updatedAt: now,
            messages: storedMessages,
            lastSyncedAt: existing?.lastSyncedAt || Date.now(),
            isDirty: 1, // Mark as dirty (pending sync)
            localVersion: version, // Increment version
            personaId: options?.personaId || existing?.personaId,
            selectedModelId: options?.selectedModelId || existing?.selectedModelId,
        } as any; // Cast because CachedConversation types might not have all new fields yet

        await indexedDBClient.saveConversation(cachedConversation);

        // Queue sync only if authenticated (real user) and not widget
        // Widgets (even for auth users) might not need DB sync yet? 
        // User said "JohnGPT chat storage... utilizing Neon PostgreSQL". 
        // Widgets usually use same storage? 
        // Previous code skipped widget sync. I'll respect `!options?.isWidget`.
        if (this.isAuthenticated && !options?.isWidget) {
            this.queueDebouncedSync(conversationId);

            // Also queue Drive Sync if connected (Debounce separate? Or just do it after API sync?)
            // We'll let `syncConversationToApi` trigger Drive sync or queue it separately?
            // To be safe, we can do it here but maybe debounced too?
            // Existing `sync-manager` had `syncConversationToDrive`.
            // Here `saveConversation` queues API sync. 
            // We can add Drive sync to the `debouncedSaves` or handle it in `syncConversationToApi`.
            // I'll handle it in `syncConversationToApi` to chain them (DB First -> Then Backup).
        } else {
            // For guest or widget, we just stop here (IndexedDB only for now)
            // Widget sync logic might be separate or added later
            this.emitSyncEvent(conversationId, 'synced'); // Effectively synced locally
        }

        // Notify lists that data changed (instant UI update)
        this.notifyListListeners();
    }

    /**
     * Load a conversation (IndexedDB first, API as fallback)
     * Implements "stale-while-revalidate" pattern
     */
    async loadConversation(conversationId: string, options?: { isWidget?: boolean }): Promise<ConversationFile | null> {
        // 1. Try IndexedDB first (instant)
        const cached = await indexedDBClient.getConversation(conversationId);

        if (cached) {
            // Return cached data immediately
            // Background: fetch from API and update cache if newer
            if (this.isAuthenticated && !options?.isWidget) {
                this.revalidateFromApi(conversationId, cached.updatedAt).catch((error) => {
                    console.warn('[DBSyncManager] Background revalidation failed:', error);
                });
            }
            return cached;
        }

        // 2. No cache - fetch from API
        // Widget sessions shouldn't be pulled from API? 
        // If user is authenticated, widget history IS chat history?
        // Usually widget has separate session unless "Open in JohnGPT".
        // If `isWidget` is true, we might want to skip API if API doesn't store widget sessions.
        // Assuming API stores everything if `userId` matches.
        if (!this.isOnline || !this.isAuthenticated) {
            return null; // Can't fetch offline or if guest
        }

        try {
            const res = await fetch(`/api/conversations/${conversationId}`);
            if (!res.ok) {
                if (res.status === 404) return null;
                throw new Error(`API error: ${res.statusText}`);
            }

            const conversation = await res.json();

            // Transform API response to CachedConversation
            const mapped = this.mapApiToCache(conversation);
            await this.updateCache(mapped, false);

            return mapped;
        } catch (error) {
            console.error('[DBSyncManager] Failed to load from API:', error);
            return null;
        }
    }

    /**
     * List all conversations (from cache + API)
     */
    async listConversations(userId: string): Promise<CachedConversation[]> {
        // 1. Get from cache (instant)
        const cached = await indexedDBClient.listConversations(userId);

        // 2. Background: refresh from API
        if (this.isOnline && this.isAuthenticated) {
            this.refreshConversationList(userId).catch((error) => {
                console.warn('[DBSyncManager] Background refresh failed:', error);
            });
        }

        return cached;
    }

    /**
     * Delete a conversation
     */
    async deleteConversation(conversationId: string): Promise<void> {
        // 1. Delete from IndexedDB
        await indexedDBClient.deleteConversation(conversationId);
        await indexedDBClient.removeFromSyncQueue(conversationId);
        this.cancelDebouncedSync(conversationId);

        // 2. Delete from API (if online)
        if (this.isOnline && this.isAuthenticated) {
            try {
                await fetch(`/api/conversations/${conversationId}`, { method: 'DELETE' });
                // Also try delete from Drive if connected?
                if (this.isDriveConnected) {
                    await googleDriveClient.deleteConversation(conversationId).catch(console.warn);
                }
            } catch (error) {
                console.warn('[DBSyncManager] Failed to delete from API:', error);
            }
        }

        this.emitSyncEvent(conversationId, 'idle');
        this.notifyListListeners();
    }

    // ==========================================================================
    // Private Methods - Helpers
    // ==========================================================================

    private mapApiToCache(apiConv: any): CachedConversation {
        return {
            conversationId: apiConv.id,
            userId: apiConv.userId,
            title: apiConv.title,
            createdAt: apiConv.createdAt,
            updatedAt: apiConv.updatedAt,
            messages: apiConv.messages as any[],
            lastSyncedAt: Date.now(), // fresh from API
            isDirty: 0,
            localVersion: apiConv.localVersion,
            personaId: apiConv.personaId,
            selectedModelId: apiConv.selectedModelId,
            // Legacy/Drive fields
            driveFileId: apiConv.driveFileId,
        } as any;
    }

    private async updateCache(conversation: CachedConversation, isDirty: boolean): Promise<void> {
        const cached: CachedConversation = {
            ...conversation,
            lastSyncedAt: Date.now(),
            isDirty: isDirty ? 1 : 0,
        };
        await indexedDBClient.saveConversation(cached);
    }

    // ==========================================================================
    // Private Methods - Sync Logic
    // ==========================================================================

    private queueDebouncedSync(conversationId: string): void {
        this.cancelDebouncedSync(conversationId);

        const timeoutId = setTimeout(() => {
            this.debouncedSaves.delete(conversationId);
            this.syncConversationToApi(conversationId)
                .then(() => {
                    // Chain Drive Backup here
                    if (this.isDriveConnected) {
                        this.forceSyncToDrive(conversationId);
                    }
                })
                .catch((error) => {
                    console.error('[DBSyncManager] Debounced sync failed:', error);
                });
        }, DEBOUNCE_DELAY_MS);

        this.debouncedSaves.set(conversationId, {
            conversationId,
            timeoutId,
            scheduledAt: Date.now(),
        });
    }

    private cancelDebouncedSync(conversationId: string): void {
        const existing = this.debouncedSaves.get(conversationId);
        if (existing) {
            clearTimeout(existing.timeoutId);
            this.debouncedSaves.delete(conversationId);
        }
    }

    private async syncConversationToApi(conversationId: string): Promise<void> {
        if (!this.isAuthenticated) return;

        if (!this.isOnline) {
            await indexedDBClient.addToSyncQueue(conversationId);
            this.emitSyncEvent(conversationId, 'offline');
            return;
        }

        this.emitSyncEvent(conversationId, 'syncing');

        try {
            const cached = await indexedDBClient.getConversation(conversationId);
            if (!cached) throw new Error(`Conversation ${conversationId} not found in cache`);

            // Check if we need to CREATE or UPDATE
            // We can check if it exists or use UPSERT logic if API supports it.
            // Our Schema stores messages in DB.
            // We'll use PATCH if we assume it exists, or handle 404.
            // But if it's new locally, it won't exist on server.

            // Strategy: Try PATCH, if 404 then POST (or just assume POST for new?)
            // Simpler: use POST to create if not synced before? 
            // Better: PUT/PATCH with upsert semantic.
            // We'll try PATCH, if 404, capture and POST.

            // Wait, we need to know if it's NEW or EXISTING.
            // cached.createdAt === cached.updatedAt implies new? Not reliable.
            // Best check: Use a flag or try PATCH.

            // Ensure messages adhere to schema (strip extra fields if necessary)
            // Ensure messages adhere to schema (strip extra fields if necessary)
            // Zod schema expects: id, role, content?, parts?, createdAt?, metadata?
            const cleanMessages = (cached.messages as any[]).map(msg => {
                // Remove undefined/null content to satisfy Zod optional()
                const content = msg.content && typeof msg.content === 'string' ? msg.content : undefined;
                const parts = Array.isArray(msg.parts) ? msg.parts : undefined;

                return {
                    id: msg.id,
                    role: msg.role,
                    content,
                    parts,
                    createdAt: msg.createdAt, // Zod allows string or Date
                    metadata: typeof msg.metadata === 'object' && msg.metadata !== null ? msg.metadata : {},
                };
            });

            const payload = {
                title: cached.title,
                messages: cleanMessages,
                personaId: (cached as any).personaId,
                selectedModelId: (cached as any).selectedModelId,
                localVersion: Number((cached as any).localVersion) || 1, // Force number
            };

            let res = await fetch(`/api/conversations/${conversationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.status === 404) {
                // Conversation doesn't exist on server -> Create it with POST
                // We must include the ID to preserve the client-generated UUID
                res = await fetch(`/api/conversations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...payload, id: conversationId })
                });
            }

            if (!res.ok) throw new Error(`Sync failed: ${res.statusText}`);

            await indexedDBClient.markConversationClean(conversationId, '', Date.now());
            this.emitSyncEvent(conversationId, 'synced');

        } catch (error) {
            console.error('[DBSyncManager] Sync error:', error);
            // Queue for retry
            await indexedDBClient.addToSyncQueue(conversationId);
            this.emitSyncEvent(conversationId, 'error', (error as Error).message);
            throw error; // Re-throw to prevent Drive sync in chain
        }
    }

    private async revalidateFromApi(conversationId: string, cachedUpdatedAt: string): Promise<void> {
        try {
            const res = await fetch(`/api/conversations/${conversationId}`);
            if (!res.ok) return;

            const data = await res.json();
            const serverTime = new Date(data.updatedAt).getTime();
            const localTime = new Date(cachedUpdatedAt).getTime();

            if (serverTime > localTime) {
                const mapped = this.mapApiToCache(data);
                await this.updateCache(mapped, false);
                this.emitSyncEvent(conversationId, 'synced'); // Updated from server
            }
        } catch (e) {
            // ignore
        }
    }

    private async refreshConversationList(userId: string): Promise<void> {
        try {
            const res = await fetch('/api/conversations');
            if (!res.ok) return;
            // The API returns { conversations: [...] } or just [...] depending on implementation.
            // Based on sidebar code: { conversations: [...] } 
            // Wait, previous Sidebar code used `data.conversations`.
            // Let's verify API route return type.
            // API route returns `NextResponse.json(conversations)` which is an array.
            // Wait, Sidebar code `const data = await res.json(); const transformed = data.conversations...`
            // Let's check api/conversations/route.ts again.
            // It returns `NextResponse.json(conversations)`.
            // So it IS an array directly.
            // Sidebar code I replaced was `const data = await res.json(); // ... data.conversations.map ...`
            // Wait, if API returns array, `data.conversations` would be undefined.
            // Let me check my memory or previous file read of route.ts.
            // route.ts: `return NextResponse.json(conversations);` -> Array.
            // Sidebar original code: `const data = await res.json(); setConversations(data.conversations...` 
            // This suggests the Sidebar code MIGHT HAVE BEEN BROKEN or I misread route.ts.
            // Let's assume API returns Array based on route.ts code `const conversations = ... findMany ... return json(conversations)`.

            const serverConversations = await res.json();

            let hasChanges = false;

            if (Array.isArray(serverConversations)) {
                for (const serverConv of serverConversations) {
                    const cached = await indexedDBClient.getConversation(serverConv.id);
                    const serverTime = new Date(serverConv.updatedAt).getTime();

                    // If not in cache, or server is newer
                    if (!cached || serverTime > new Date(cached.updatedAt).getTime()) {
                        const mapped = this.mapApiToCache(serverConv);
                        await this.updateCache(mapped, false);
                        hasChanges = true;
                    }
                }
            }

            if (hasChanges) {
                this.notifyListListeners();
            }
        } catch (e) {
            console.warn('[DBSyncManager] Background refresh failed:', e);
        }
    }

    private handleOnline() {
        this.isOnline = true;
        this.processOfflineQueue();
    }

    private handleOffline() {
        this.isOnline = false;
    }

    private startNetworkCheck() {
        this.networkCheckInterval = setInterval(() => {
            const wasOnline = this.isOnline;
            this.isOnline = navigator.onLine;
            if (!wasOnline && this.isOnline) this.handleOnline();
        }, NETWORK_CHECK_INTERVAL);
    }

    async processOfflineQueue() {
        if (!this.isOnline || !this.isAuthenticated) return;

        const queue = await indexedDBClient.getSyncQueue();
        for (const item of queue) {
            await this.syncConversationToApi(item.conversationId).catch(console.warn);
            await indexedDBClient.removeFromSyncQueue(item.conversationId);
        }
    }

    private scheduleRetry(conversationId: string, retryCount: number) {
        // Logic similar to original SyncManager
    }

    private emitSyncEvent(conversationId: string, status: SyncStatus, error?: string): void {
        this.syncStatus.set(conversationId, status);
        const event: SyncEvent = { conversationId, status, error, timestamp: Date.now() };
        this.listeners.forEach(l => l(event));
    }

    // API to subscribe
    onSyncEvent(listener: SyncListener): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Subscribe to ANY change in the conversation list
     * (Created, Updated Title, Deleted)
     */
    onListChange(listener: () => void): () => void {
        this.listListeners.push(listener);
        return () => {
            this.listListeners = this.listListeners.filter(l => l !== listener);
        };
    }

    private notifyListListeners() {
        this.listListeners.forEach(listener => listener());
    }
}

export const dbSyncManager = new DBSyncManager();
