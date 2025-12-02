import { useState, useCallback, useEffect, useMemo } from 'react';
import { useChat, UIMessage } from '@ai-sdk/react';

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

export type UseBranchingChatOptions = any;

export function useBranchingChat(options: UseBranchingChatOptions = {}) {
    // 1. Internal Tree State
    const [tree, setTree] = useState<MessageTree>({});
    const [headId, setHeadId] = useState<string | null>(null);

    // Track the "active" child for each node to restore history correctly when navigating back
    const [activePathMap, setActivePathMap] = useState<Record<string, string>>({});

    // 2. Initialize useChat
    const chatHelpers = useChat({
        ...options,
        onFinish: (message: any, options: any) => {
            options?.onFinish?.(message, options);
        },
    }) as any;

    const { messages, setMessages, reload, append } = chatHelpers;

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
        await append({
            role: 'user',
            parts: [{ type: 'text', text: newContent }],
        });

    }, [tree, setMessages, append]);


    const navigateBranch = useCallback((nodeId: string, direction: 'prev' | 'next') => {
        const node = tree[nodeId];
        if (!node || !node.parentId) return;

        const parent = tree[node.parentId];
        if (!parent) return;

        const currentIndex = parent.childrenIds.indexOf(nodeId);
        if (currentIndex === -1) return;

        let nextIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

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
    };
}
