import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

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
    spotlightSectionId: string | null;
};

type ChatActionContextValue = {
    state: ChatActionState;
    minimizeChat: () => void;
    expandChat: () => void;
    navigateTo: (url: string, options?: { isMobile?: boolean }) => void;
    handleAction: (action: any) => void;
    scrollToSection: (sectionId: string) => void;
    clearSpotlight: () => void;
};

const ChatActionContext = createContext<ChatActionContextValue | undefined>(undefined);

export function ChatActionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [state, setState] = useState<ChatActionState>({
        isChatMinimized: false,
        minimizeStyle: 'minimize',
        activeRoute: null,
        pendingAction: null,
        spotlightSectionId: null,
    });

    // Listen for spotlight query param from navigation
    useEffect(() => {
        const spotlight = searchParams.get('spotlight');
        if (spotlight) {
            // console.log('✨ [ChatActionContext] Spotlight param detected:', spotlight);

            // Clean up the URL by removing the spotlight param
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('spotlight');
            window.history.replaceState({}, '', newUrl.pathname + newUrl.search);

            if (spotlight === 'page') {
                // Add spotlight to main content area
                setTimeout(() => {
                    const main = document.querySelector('main') || document.getElementById('main-content');
                    if (main) {
                        main.classList.add('section-spotlight');
                        setTimeout(() => main.classList.remove('section-spotlight'), 2500);
                    }
                }, 500); // Wait for page to render
            } else {
                // It's a section ID - scroll to it
                setTimeout(() => {
                    const element = document.getElementById(spotlight);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        element.classList.add('section-spotlight');
                        setState(s => ({ ...s, spotlightSectionId: spotlight }));
                        setTimeout(() => {
                            element.classList.remove('section-spotlight');
                            setState(s => ({ ...s, spotlightSectionId: null }));
                        }, 2500);
                    }
                }, 800); // Wait longer for page to fully render
            }
        }
    }, [searchParams, pathname]);

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
        // console.log('🚀 [ChatActionContext] navigateTo called with:', url);
        const isMobile = options?.isMobile ?? (typeof window !== 'undefined' && window.innerWidth < 768);

        // Minimize chat to show the page being navigated to
        setState((s) => ({
            ...s,
            isChatMinimized: true,
            minimizeStyle: isMobile ? 'peek-bar' : 'minimize',
            activeRoute: url,
        }));

        // Navigate to the URL - use router.push for client-side navigation (preserves state)
        // console.log('🚀 [ChatActionContext] Navigating to:', url);

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

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            // console.log('✨ [ChatActionContext] Scrolling to section:', sectionId);

            // 1. Scroll to element
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // 2. Add spotlight glow
            element.classList.add('section-spotlight');
            setState(s => ({ ...s, spotlightSectionId: sectionId }));

            // 3. Remove after animation completes
            setTimeout(() => {
                element.classList.remove('section-spotlight');
                setState(s => ({ ...s, spotlightSectionId: null }));
            }, 2500);
        } else {
            console.warn('[ChatActionContext] Section not found:', sectionId);
        }
    }, []);

    const clearSpotlight = useCallback(() => {
        setState(s => {
            if (s.spotlightSectionId) {
                const element = document.getElementById(s.spotlightSectionId);
                element?.classList.remove('section-spotlight');
            }
            return { ...s, spotlightSectionId: null };
        });
    }, []);

    return (
        <ChatActionContext.Provider value={{
            state,
            minimizeChat,
            expandChat,
            navigateTo,
            handleAction,
            scrollToSection,
            clearSpotlight
        }}>
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

