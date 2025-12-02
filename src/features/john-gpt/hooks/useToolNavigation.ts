import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Custom hook to handle tool navigation invocations
 * Watches for 'navigate' tool calls and performs navigation using Next.js router
 *
 * @param messages - Array of chat messages to monitor for tool invocations
 * @param addToolResult - Function to add tool results back to the chat
 */
export function useToolNavigation(
    messages: any[],
    addToolResult: (result: {
        toolCallId: string;
        tool: string;
        output: { success: boolean; message: string };
    }) => void
) {
    const router = useRouter();

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        // Cast to any to avoid type errors if types are outdated
        const toolInvocations = (lastMessage as any)?.toolInvocations;

        if (toolInvocations) {
            for (const toolInvocation of toolInvocations) {
                if (toolInvocation.toolName === 'navigate' && toolInvocation.state === 'input-available') {
                    const { path } = toolInvocation.args;
                    // Execute navigation
                    router.push(path);

                    // Confirm to AI that we navigated
                    addToolResult({
                        toolCallId: toolInvocation.toolCallId,
                        tool: toolInvocation.toolName, // Add tool name
                        output: { success: true, message: `Navigated to ${path}` },
                    });
                }
            }
        }
    }, [messages, router, addToolResult]);
}