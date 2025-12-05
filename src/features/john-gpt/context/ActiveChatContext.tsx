'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

type ActiveChatState = {
    conversationId: string | null;
    isFollowMeMode: boolean;
    userId: string | null;
};

type ActiveChatContextValue = {
    state: ActiveChatState;
    activateFollowMe: (conversationId: string, userId: string) => void;
    deactivateFollowMe: () => void;
    isFollowMeActive: boolean;
};

// ============================================================================
// Context
// ============================================================================

const ActiveChatContext = createContext<ActiveChatContextValue | null>(null);

const STORAGE_KEY = 'johngpt_follow_me_state';

// ============================================================================
// Provider
// ============================================================================

export function ActiveChatProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<ActiveChatState>({
        conversationId: null,
        isFollowMeMode: false,
        userId: null,
    });

    // Hydrate from sessionStorage on mount (NOT localStorage - follow-me is temporary per session)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as ActiveChatState;
                setState(parsed);
                console.log('[ActiveChatContext] Hydrated follow-me state:', parsed);
            }
        } catch (error) {
            console.warn('[ActiveChatContext] Failed to hydrate state:', error);
        }
    }, []);

    // Persist to sessionStorage on state change (clears when browser closes)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            if (state.isFollowMeMode) {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            } else {
                sessionStorage.removeItem(STORAGE_KEY);
            }
        } catch (error) {
            console.warn('[ActiveChatContext] Failed to persist state:', error);
        }
    }, [state]);

    const activateFollowMe = useCallback((conversationId: string, userId: string) => {
        console.log('[ActiveChatContext] Activating follow-me mode:', { conversationId, userId });
        setState({
            conversationId,
            isFollowMeMode: true,
            userId,
        });
    }, []);

    const deactivateFollowMe = useCallback(() => {
        console.log('[ActiveChatContext] Deactivating follow-me mode');
        setState({
            conversationId: null,
            isFollowMeMode: false,
            userId: null,
        });
    }, []);

    const value: ActiveChatContextValue = {
        state,
        activateFollowMe,
        deactivateFollowMe,
        isFollowMeActive: state.isFollowMeMode && state.conversationId !== null,
    };

    return (
        <ActiveChatContext.Provider value={value}>
            {children}
        </ActiveChatContext.Provider>
    );
}

// ============================================================================
// Hook
// ============================================================================

export function useActiveChat(): ActiveChatContextValue {
    const context = useContext(ActiveChatContext);

    if (!context) {
        throw new Error('useActiveChat must be used within an ActiveChatProvider');
    }

    return context;
}

// ============================================================================
// Optional Hook (doesn't throw if outside provider)
// ============================================================================

export function useActiveChatOptional(): ActiveChatContextValue | null {
    return useContext(ActiveChatContext);
}
