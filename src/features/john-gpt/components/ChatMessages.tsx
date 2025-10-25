import React from 'react';
import { UIMessage } from '@ai-sdk/react';
import { formatTime } from '@/lib/utils';
import { BrainIcon } from '@/components/ui/BrainIcon';

/**
 * Props for the ChatMessages component
 */
interface ChatMessagesProps {
  /** The array of chat messages from the AI SDK */
  messages: UIMessage[];
  /** Whether the AI is currently loading/generating a response */
  isLoading: boolean;
  /** Whether auto-scroll is enabled */
  autoScrollEnabled?: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  autoScrollEnabled = true
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Smooth auto-scroll logic - only scroll if user is within 100px of bottom
  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !autoScrollEnabled) return;

    const shouldScroll =
      scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight <= 100;

    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, autoScrollEnabled]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <BrainIcon size={64} className="text-primary opacity-80" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Ask JohnGPT anything</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Get instant help with creative projects, technical questions, or just chat about ideas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollContainerRef}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 group relative ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`}
          >
            {message.parts
              .filter(part => part.type === 'text')
              .map(part => part.text)
              .join('')}

            {/* Timestamp - hover on desktop, always visible on mobile */}
            {(message as any).createdAt && (
              <time
                dateTime={new Date((message as any).createdAt).toISOString()}
                className="block md:opacity-0 md:group-hover:opacity-100 text-xs text-muted-foreground mt-2 transition-opacity"
              >
                {formatTime(new Date((message as any).createdAt))}
              </time>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-center gap-2 p-3 text-muted-foreground">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary animation-delay-200"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary animation-delay-400"></div>
            <span className="text-sm">JohnGPT is thinking...</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
