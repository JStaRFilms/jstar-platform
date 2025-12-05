import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Types for our actions
export type NavigationAction = {
    type: 'navigate' | 'login';
    url?: string;
    title?: string;
    requiredTier?: string;
};

type ChatActionState = {
    isChatMinimized: boolean;
    minimizeStyle: 'minimize' | 'peek-bar'; // 'minimize' for desktop, 'peek-bar' for mobile
    activeRoute: string | null;
    pendingAction: NavigationAction | null;
};

type ChatActionContextValue = {
    state: ChatActionState;
    minimizeChat: () => void;
    expandChat: () => void;
    navigateTo: (url: string, options?: { isMobile?: boolean }) => void;
    handleAction: (action: any) => void;
};

const ChatActionContext = createContext<ChatActionContextValue | undefined>(undefined);

export function ChatActionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<ChatActionState>({
        isChatMinimized: false,
        minimizeStyle: 'minimize',
        activeRoute: null,
        pendingAction: null,
    });

    const minimizeChat = useCallback(() => {
        // Determine style based on viewport width (can be refined with useMediaQuery)
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        setState((s) => ({
            ...s,
            isChatMinimized: true,
            minimizeStyle: isMobile ? 'peek-bar' : 'minimize',
        }));
    }, []);

    const expandChat = useCallback(() => {
        setState((s) => ({
            ...s,
            isChatMinimized: false,
        }));
    }, []);

    const navigateTo = useCallback((url: string, options?: { isMobile?: boolean }) => {
        console.log('🚀 [ChatActionContext] navigateTo called with:', url);
        const isMobile = options?.isMobile ?? (typeof window !== 'undefined' && window.innerWidth < 768);

        // Minimize chat to show the page being navigated to
        setState((s) => ({
            ...s,
            isChatMinimized: true,
            minimizeStyle: isMobile ? 'peek-bar' : 'minimize',
            activeRoute: url,
        }));

        // Navigate to the URL - use router.push for client-side navigation (preserves state)
        console.log('🚀 [ChatActionContext] Navigating to:', url);

        // Use requestAnimationFrame to ensure state updates settle before navigation
        requestAnimationFrame(() => {
            router.push(url);
        });
    }, [router]);

    const handleAction = useCallback((action: NavigationAction) => {
        setState((s) => ({ ...s, pendingAction: action }));

        if (action.type === 'navigate' && action.url) {
            navigateTo(action.url);
        }
    }, [navigateTo]);

    return (
        <ChatActionContext.Provider value={{ state, minimizeChat, expandChat, navigateTo, handleAction }}>
            {children}
        </ChatActionContext.Provider>
    );
}

export function useChatActions() {
    const context = useContext(ChatActionContext);
    if (context === undefined) {
        throw new Error('useChatActions must be used within a ChatActionProvider');
    }
    return context;
}
