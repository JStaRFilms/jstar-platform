/**
 * useWidgetPersistence Hook
 * 
 * Manages widget-specific chat persistence:
 * - Generates stable session IDs for guests (using localStorage deviceId)
 * - For signed-in users, uses their userId
 * - Auto-loads last session on mount
 * - Provides clear session functionality
 * - Provides "Open in JohnGPT" deep link
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { indexedDBClient } from '@/lib/storage/indexeddb-client';
import { dbSyncManager } from '@/lib/storage/db-sync-manager';

// ============================================================================
// Types
// ============================================================================

export interface WidgetSession {
    sessionId: string;
    userId: string; // 'anonymous-{deviceId}' for guests
    messages: any[];
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface UseWidgetPersistenceOptions {
    userId?: string | null;
}

export interface UseWidgetPersistenceReturn {
    sessionId: string;
    effectiveUserId: string;
    initialMessages: any[];
    isLoading: boolean;
    clearSession: () => Promise<void>;
    openInJohnGPT: () => string; // Returns the URL
}

// ============================================================================
// Constants
// ============================================================================

const DEVICE_ID_KEY = 'jstargpt_device_id';
const WIDGET_SESSION_PREFIX = 'widget-session-';

// ============================================================================
// Utilities
// ============================================================================

/**
 * Generate or retrieve a stable device ID for anonymous users
 */
function getOrCreateDeviceId(): string {
    if (typeof window === 'undefined') {
        return 'ssr-temp-id';
    }

    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
        // Generate a random ID
        deviceId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
}

/**
 * Generate a widget session ID
 */
function generateWidgetSessionId(userId: string): string {
    return `${WIDGET_SESSION_PREFIX}${userId}`;
}

// ============================================================================
// Hook
// ============================================================================

export function useWidgetPersistence(
    options: UseWidgetPersistenceOptions = {}
): UseWidgetPersistenceReturn {
    const { userId: authUserId } = options;

    // Stable user ID (auth user or anonymous with device ID)
    const effectiveUserId = useMemo(() => {
        if (authUserId) {
            return authUserId;
        }
        return `anonymous-${getOrCreateDeviceId()}`;
    }, [authUserId]);

    // Initialize DB Sync Manager
    useEffect(() => {
        dbSyncManager.initialize(effectiveUserId);
    }, [effectiveUserId]);

    // Widget session ID (stable per user)
    const sessionId = useMemo(() => {
        return generateWidgetSessionId(effectiveUserId);
    }, [effectiveUserId]);

    // State
    const [initialMessages, setInitialMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load last widget session on mount
    useEffect(() => {
        const loadSession = async () => {
            try {
                setIsLoading(true);

                // Check if IndexedDB is supported
                if (!indexedDBClient || typeof indexedDB === 'undefined') {
                    console.log('[useWidgetPersistence] IndexedDB not supported');
                    setIsLoading(false);
                    return;
                }

                // Try to load the widget session from dbSyncManager
                // Pass isWidget: true to optionally skip remote API if desired (managed in DBSyncManager)
                const cachedSession = await dbSyncManager.loadConversation(sessionId, { isWidget: true });

                if (cachedSession && cachedSession.messages && cachedSession.messages.length > 0) {
                    console.log('[useWidgetPersistence] Loaded session:', sessionId, 'with', cachedSession.messages.length, 'messages');
                    setInitialMessages(cachedSession.messages);
                } else {
                    console.log('[useWidgetPersistence] No existing session found for:', sessionId);
                }
            } catch (error) {
                console.error('[useWidgetPersistence] Error loading session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSession();
    }, [sessionId]);

    // Clear the current session
    const clearSession = useCallback(async () => {
        try {
            await dbSyncManager.deleteConversation(sessionId);
            setInitialMessages([]);
            console.log('[useWidgetPersistence] Session cleared:', sessionId);
        } catch (error) {
            console.error('[useWidgetPersistence] Error clearing session:', error);
        }
    }, [sessionId]);

    // Generate "Open in JohnGPT" URL
    const openInJohnGPT = useCallback(() => {
        // The full page will import this session
        return `/john-gpt?import=${encodeURIComponent(sessionId)}`;
    }, [sessionId]);

    return {
        sessionId,
        effectiveUserId,
        initialMessages,
        isLoading,
        clearSession,
        openInJohnGPT,
    };
}
