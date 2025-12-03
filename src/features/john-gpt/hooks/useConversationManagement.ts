import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { UIMessage } from '@ai-sdk/react';

/**
 * Custom hook for managing conversation state and navigation
 * 
 * Handles:
 * - Loading conversations from storage
 * - Tracking active conversation ID with ref for synchronous access
 * - URL navigation when conversations change
 * - Deduplication of messages
 */
export function useConversationManagement(
    conversationId?: string
) {
    const router = useRouter();
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const conversationIdRef = useRef<string | null>(null);

    // Helper to deduplicate messages
    const deduplicateMessages = useCallback((msgs: any[]) => {
        const seen = new Set();
        return msgs.filter(m => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        });
    }, []);


    // Create a new conversation
    const createNewConversation = () => {
        conversationIdRef.current = null;
        setActiveConversationId(null);
        router.push('/john-gpt');
        return null;
    };

    // Navigate to URL when conversation changes
    const navigateToConversation = (convId: string) => {
        conversationIdRef.current = convId;
        setActiveConversationId(convId);
        router.push(`/john-gpt/${convId}`);
    };

    // Get or create conversation ID
    const getOrCreateConversationId = () => {
        let convId = conversationIdRef.current;

        if (!convId) {
            convId = crypto.randomUUID();
            navigateToConversation(convId);
        }

        return convId;
    };

    return {
        activeConversationId,
        setActiveConversationId,
        conversationIdRef,
        deduplicateMessages,
        createNewConversation,
        navigateToConversation,
        getOrCreateConversationId,
    };
}
