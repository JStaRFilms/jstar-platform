import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { UIMessage } from 'ai';

interface ChatDB extends DBSchema {
    conversations: {
        key: string;
        value: Conversation;
        indexes: { 'by-date': number };
    };
}

export interface Conversation {
    id: string;
    title: string;
    messages: UIMessage[];
    createdAt: number;
    updatedAt: number;
    personaId: string;
    syncedToDrive: boolean;
    driveFileId?: string;
}

const DB_NAME = 'johngpt-db';
const DB_VERSION = 1;

class ChatStorageService {
    private dbPromise: Promise<IDBPDatabase<ChatDB>>;

    constructor() {
        this.dbPromise = openDB<ChatDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                const store = db.createObjectStore('conversations', { keyPath: 'id' });
                store.createIndex('by-date', 'updatedAt');
            },
        });
    }

    async saveConversation(conversation: Conversation): Promise<void> {
        const db = await this.dbPromise;
        await db.put('conversations', conversation);
    }

    async getConversation(id: string): Promise<Conversation | undefined> {
        const db = await this.dbPromise;
        return db.get('conversations', id);
    }

    async getAllConversations(): Promise<Conversation[]> {
        const db = await this.dbPromise;
        return db.getAllFromIndex('conversations', 'by-date');
    }

    async deleteConversation(id: string): Promise<void> {
        const db = await this.dbPromise;
        await db.delete('conversations', id);
    }

    async clearAll(): Promise<void> {
        const db = await this.dbPromise;
        await db.clear('conversations');
    }

    async syncConversations(userId: string): Promise<void> {
        try {
            // 1. Get all local conversations
            const localConversations = await this.getAllConversations();

            // 2. Fetch remote list from Drive (via API route to keep secrets on server)
            const response = await fetch('/api/johngpt/sync/list');
            if (!response.ok) return;

            const remoteFiles = await response.json();

            // 3. Upload unsynced local changes
            for (const local of localConversations) {
                if (!local.syncedToDrive) {
                    await fetch('/api/johngpt/sync/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(local),
                    });

                    // Mark as synced
                    local.syncedToDrive = true;
                    await this.saveConversation(local);
                }
            }

            // 4. Download new/updated remote files
            for (const remote of remoteFiles) {
                const local = await this.getConversation(remote.name.replace('.json', ''));

                // If local doesn't exist or remote is newer
                if (!local || new Date(remote.modifiedTime).getTime() > local.updatedAt) {
                    const contentRes = await fetch(`/api/johngpt/sync/get?fileId=${remote.id}`);
                    if (contentRes.ok) {
                        const content = await contentRes.json();
                        content.syncedToDrive = true;
                        content.driveFileId = remote.id;
                        await this.saveConversation(content);
                    }
                }
            }
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }
}

export const chatStorage = new ChatStorageService();
