import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useChat, UIMessage } from '@ai-sdk/react';
import { useRouter, usePathname } from 'next/navigation';
import { dbSyncManager } from '@/lib/storage/db-sync-manager';

export type BranchingMessage = UIMessage & {
    parentId?: string | null;
    childrenIds?: string[];
    branchIndex?: number;
    branchCount?: number;
};

type TreeNode = {
    id: string;
    message: UIMessage;
    parentId: string | null;
    childrenIds: string[];
    createdAt: number;
};

type MessageTree = Record<string, TreeNode>;

export type UseBranchingChatOptions = {
    conversationId?: string;
    userId?: string;
    api?: string;
    body?: any;
    onFinish?: any; // Let TypeScript infer from useChat
    isWidget?: boolean;
    scrollToSection?: (sectionId: string) => void;
    modelId?: string | null; // Selected AI model ID for dynamic model selection
};

export function useBranchingChat(options: UseBranchingChatOptions = {}) {
    const { conversationId, userId } = options;
    const router = useRouter();
    const pathname = usePathname();

    // Initialize SyncManager
    useEffect(() => {
        dbSyncManager.initialize(userId || null);
    }, [userId]);

    // 1. Internal Tree State
    const [tree, setTree] = useState<MessageTree>({});
    const [headId, setHeadId] = useState<string | null>(null);

    // Track the "active" child for each node to restore history correctly when navigating back
    const [activePathMap, setActivePathMap] = useState<Record<string, string>>({});

    const [currentMode, setCurrentMode] = useState<string | null>(null);

    // 2. Initialize useChat with currentPath for navigation context
    console.log('[useBranchingChat] Options received:', { body: options.body, api: options.api, currentPath: pathname });

    const chatHelpers = useChat({
        ...options,
        // Include currentPath for navigation context
        // NOTE: modelId is passed per-request via sendMessageWithModel, NOT here (body is memoized at init)
        // @ts-expect-error - body is supported but types are strict
        body: { ...options.body, currentPath: pathname, conversationId: conversationId },
        onFinish: (response: any) => {
            // 🚀 Handle navigation tool results HERE (not in UI component)
            // This ensures navigation only happens ONCE when streaming completes
            // Note: onFinish receives {message, messages, isAbort, ...} - must access response.message
            const msg = response.message || response;

            if (msg?.parts) {
                for (const part of msg.parts) {
                    // Handle unified goTo tool
                    if (part.type === 'tool-goTo' && part.state === 'output-available') {
                        const result = part.output;
                        const scrollFn = options.scrollToSection;

                        switch (result?.action) {
                            case 'navigate':
                                // Navigate to page with spotlight effect
                                setTimeout(() => {
                                    console.log('[goTo] Navigating to:', result.url);
                                    // Add spotlight=page param to trigger page glow on arrival
                                    const separator = result.url.includes('?') ? '&' : '?';
                                    router.push(`${result.url}${separator}spotlight=page`);
                                }, 1500);
                                break;

                            case 'scrollToSection':
                                // Scroll to section on current page
                                if (result.sectionId && scrollFn) {
                                    setTimeout(() => {
                                        console.log('[goTo] Scrolling to:', result.sectionId);
                                        scrollFn(result.sectionId);
                                    }, 500);
                                }
                                break;

                            case 'navigateAndScroll':
                                // Navigate to page, then scroll to section
                                setTimeout(() => {
                                    console.log('[goTo] Navigate + Scroll:', result.url, result.sectionId);
                                    // Add spotlight param with section ID
                                    const sep = result.url.includes('?') ? '&' : '?';
                                    router.push(`${result.url}${sep}spotlight=${result.sectionId}`);
                                }, 1500);
                                break;
                        }
                        break; // Only handle one navigation action
                    }
                }
            }

            // Call the original onFinish from ChatView.tsx options
            if (options.onFinish) {
                options.onFinish(response);
            }
        },
    }) as any;

    const { messages, setMessages, sendMessage } = chatHelpers;

    // 🚀 Dynamic model selection wrapper
    // useChat memoizes `body` at init, so we pass modelId per-request via sendMessage options
    const sendMessageWithModel = useCallback(
        async (message: any, modelId?: string | null) => {
            return sendMessage(message, {
                body: { modelId, conversationId },
            });
        },
        [sendMessage, conversationId]
    );

    // Listen for message updates to set the mode from metadata
    useEffect(() => {
        if (!messages || messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        // Check if it's an assistant message and has metadata
        if (lastMessage.role === 'assistant' && (lastMessage as any).metadata) {
            const mode = (lastMessage as any).metadata.mode;
            if (mode) {
                console.log('[useBranchingChat] Found mode in metadata:', mode);
                setCurrentMode(mode);
            }
        }
    }, [messages]);

    // Helper to reconstruct path from a given leaf/head ID
    const getPathToNode = useCallback((leafId: string, currentTree: MessageTree): UIMessage[] => {
        const path: UIMessage[] = [];
        let currentId: string | null = leafId;

        while (currentId && currentTree[currentId]) {
            path.unshift(currentTree[currentId].message);
            currentId = currentTree[currentId].parentId;
        }
        return path;
    }, []);

    // 3. Sync `messages` from useChat to `tree` (for streaming updates)
    useEffect(() => {
        if (messages.length === 0) return;

        const lastMsg = messages[messages.length - 1] as any;

        setTree(prevTree => {
            const existingNode = prevTree[lastMsg.id];

            // Update existing node content (streaming)
            if (existingNode) {
                const existingContent = (existingNode.message as any).content;
                const newContent = lastMsg.content;

                if (existingContent === newContent &&
                    (existingNode.message as any).toolInvocations === lastMsg.toolInvocations) {
                    return prevTree;
                }
                return {
                    ...prevTree,
                    [lastMsg.id]: { ...existingNode, message: lastMsg }
                };
            }

            // New Message Logic
            let newParentId = headId;

            if (messages.length > 1) {
                const parentMsg = messages[messages.length - 2];
                if (prevTree[parentMsg.id]) {
                    newParentId = parentMsg.id;
                }
            } else {
                newParentId = null;
            }

            const newNode: TreeNode = {
                id: lastMsg.id,
                message: lastMsg,
                parentId: newParentId || null,
                childrenIds: [],
                createdAt: Date.now(),
            };

            const nextTree: MessageTree = { ...prevTree, [lastMsg.id]: newNode };

            if (newParentId && prevTree[newParentId] && !prevTree[newParentId].childrenIds.includes(lastMsg.id)) {
                nextTree[newParentId] = {
                    ...prevTree[newParentId],
                    childrenIds: [...prevTree[newParentId].childrenIds, lastMsg.id]
                };
            }

            return nextTree;
        });

        if (lastMsg.id !== headId) {
            setHeadId(lastMsg.id);

            if (messages.length > 1) {
                const parentId = messages[messages.length - 2].id;
                setActivePathMap(prev => ({ ...prev, [parentId]: lastMsg.id }));
            }
        }

    }, [messages, headId]);

    // 3.5. Persistence: Save to IndexedDB (and queue DB sync)
    // Ref for debouncing
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Only save if we have a conversation ID and user ID and messages
        if (!conversationId || !userId || messages.length === 0) return;

        const saveConversation = async () => {
            try {
                // Convert tree to flat message array with branching metadata
                const messagesToSave = messages.map((msg: any) => {
                    const node = tree[msg.id];
                    return {
                        ...msg,
                        parentId: node?.parentId || null,
                        childrenIds: node?.childrenIds || [],
                        createdAt: new Date(node?.createdAt || Date.now()).toISOString(),
                    };
                });

                // Auto-generate title logic (simplified)
                let title = 'New Chat';
                if (messages.length >= 2) {
                    // Get title from first User message
                    const firstUserMsg = messages.find((m: any) => m.role === 'user');
                    if (firstUserMsg?.parts) {
                        const textPart = firstUserMsg.parts.find((p: any) => p.type === 'text');
                        if (textPart && 'text' in textPart) {
                            title = textPart.text.slice(0, 50);
                            if (textPart.text.length > 50) title += '...';
                        }
                    }
                }

                await dbSyncManager.saveConversation(
                    conversationId,
                    userId,
                    title,
                    messagesToSave,
                    {
                        isWidget: options.isWidget,
                        selectedModelId: options.modelId || undefined
                    }
                );

                console.log('[useBranchingChat] Conversation saved to IndexedDB:', conversationId);
            } catch (error) {
                console.error('[useBranchingChat] Save failed:', error);
            }
        };

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set new timeout (2 seconds debounce)
        saveTimeoutRef.current = setTimeout(saveConversation, 2000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };

    }, [messages, tree, conversationId, userId, options.isWidget, options.modelId]);

    // 3.7. Auto-generate AI title after 6 messages (3 exchanges)
    useEffect(() => {
        if (!conversationId || !userId || messages.length !== 6) return;
        if (options.isWidget) return; // Skip for widget

        const generateTitle = async () => {
            try {
                console.log('[useBranchingChat] Generating AI title after 6 messages...');

                // Convert messages to API format
                const messagesToSend = messages.map((msg: any) => ({
                    role: msg.role,
                    content: msg.content,
                    parts: msg.parts,
                }));

                const res = await fetch(`/api/conversations/${conversationId}/title`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: messagesToSend }),
                });

                if (!res.ok) {
                    console.warn('[useBranchingChat] Title generation failed:', res.statusText);
                    return;
                }

                const { title } = await res.json();
                console.log('[useBranchingChat] AI-generated title:', title);

                // Update via SyncManager
                const messagesToSave = messages.map((msg: any) => {
                    const node = tree[msg.id];
                    return { ...msg, parentId: node?.parentId, childrenIds: node?.childrenIds, createdAt: new Date(node?.createdAt || Date.now()).toISOString() };
                });

                await dbSyncManager.saveConversation(
                    conversationId,
                    userId,
                    title,
                    messagesToSave,
                    { isWidget: options.isWidget }
                );

                // Trigger sidebar refresh
                window.dispatchEvent(new CustomEvent('conversation-updated', {
                    detail: { conversationId, title }
                }));

            } catch (error) {
                console.error('[useBranchingChat] Title generation error:', error);
            }
        };

        // Debounce to ensure streaming is complete
        const timer = setTimeout(generateTitle, 3000);
        return () => clearTimeout(timer);
    }, [messages.length, conversationId, userId, options.isWidget]);


    // 4. Branching Logic

    const editMessage = useCallback(async (nodeId: string, newContent: string) => {
        const node = tree[nodeId];
        if (!node) return;

        // 1. Construct path up to PARENT
        const path: UIMessage[] = [];
        let curr: string | null = node.parentId;
        while (curr && tree[curr]) {
            path.unshift(tree[curr].message);
            curr = tree[curr].parentId;
        }

        // 2. Set messages to history
        setMessages(path);

        // 3. Set headId to parent
        if (node.parentId) {
            setHeadId(node.parentId);
        } else {
            setHeadId(null);
        }

        // 4. Append new message
        await sendMessage({
            role: 'user',
            parts: [{ type: 'text', text: newContent }],
        });

    }, [tree, setMessages, sendMessage]);


    const navigateBranch = useCallback((nodeId: string, direction: 'prev' | 'next') => {
        const node = tree[nodeId];
        if (!node || !node.parentId) return;

        const parent = tree[node.parentId];
        if (!parent) return;

        const currentIndex = parent.childrenIds.indexOf(nodeId);
        if (currentIndex === -1) return;

        const nextIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

        if (nextIndex < 0 || nextIndex >= parent.childrenIds.length) return;

        const siblingId = parent.childrenIds[nextIndex];

        // Find the leaf of this sibling branch
        let currentId = siblingId;
        while (activePathMap[currentId] && tree[activePathMap[currentId]]) {
            currentId = activePathMap[currentId];
        }

        setHeadId(currentId);

        // Update active path for the parent
        setActivePathMap(prev => ({ ...prev, [node.parentId as string]: siblingId }));

        // Sync useChat
        const newPath = getPathToNode(currentId, tree);
        setMessages(newPath);

    }, [tree, activePathMap, getPathToNode, setMessages]);


    // 5. Derived State for UI
    const messagesWithBranches = useMemo(() => {
        return messages.map((msg: any) => {
            const node = tree[msg.id];
            if (!node || !node.parentId) return msg;

            const parent = tree[node.parentId];
            if (!parent) return msg;

            const children = parent.childrenIds;
            if (children.length <= 1) return msg;

            return {
                ...msg,
                branchIndex: children.indexOf(msg.id),
                branchCount: children.length,
                parentId: node.parentId,
            } as BranchingMessage;
        });
    }, [messages, tree]);


    return {
        ...chatHelpers,
        messages: messagesWithBranches,
        editMessage,
        navigateBranch,
        currentMode, // Expose current mode
        sendMessageWithModel, // Dynamic model selection per-request
    };
}
