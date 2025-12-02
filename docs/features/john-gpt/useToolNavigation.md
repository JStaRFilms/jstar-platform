# Feature: useToolNavigation Hook

## 1. Purpose

The `useToolNavigation` hook handles the `navigate` tool invocation for JohnGPT by monitoring chat messages for navigation tool calls and performing client-side navigation using Next.js router. When a 'navigate' tool invocation is detected, it executes the navigation and confirms the action by adding a tool result to the chat.

## 2. Parameters

| Parameter       | Type                                                                 | Required | Description                                                                 |
|-----------------|----------------------------------------------------------------------|----------|-----------------------------------------------------------------------------|
| `messages`      | `any[]`                                                              | Yes      | Array of chat messages to monitor for tool invocations.                     |
| `addToolResult` | `(result: { toolCallId: string; tool: string; output: { success: boolean; message: string } }) => void` | Yes      | Function to add tool results back to the chat, used to confirm navigation. |

## 3. Usage Example

```tsx
import { useToolNavigation } from '../hooks/useToolNavigation';

const ChatComponent = ({ messages, addToolResult }) => {
  // Use the hook to handle navigation tool invocations
  useToolNavigation(messages, addToolResult);

  return (
    <div>
      {/* Chat UI */}
    </div>
  );
};