import React from 'react';
import { UIMessage } from '@ai-sdk/react';
import { formatTime } from '@/lib/utils';
import { BrainIcon } from '@/components/ui/BrainIcon';
import { ColorPalette } from '@/components/ui/color-palette';
import { CodeBlock } from '@/components/ui/code-block';
import { FileAttachment } from '@/components/ui/file-attachment';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';

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

/**
 * Parse message content for rich components like color palettes, code blocks, and file attachments
 */
const parseMessageContent = (content: string) => {
  const parts: Array<{ type: 'text' | 'color-palette' | 'code-block' | 'file-attachment', content: any }> = [];

  // Simple parsing logic - expand this based on AI responses
  const colorRegex = /#([0-9A-Fa-f]{3,8})/g;
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  const attachmentRegex = /{{attachment:(.*?)}}/g; // Placeholder for file attachments

  let lastIndex = 0;
  let match;

  // Find all patterns and create parts
  const allMatches: Array<{ index: number, endIndex: number, type: string, data: any }> = [];

  // Colors
  while ((match = colorRegex.exec(content)) !== null) {
    allMatches.push({
      index: match.index,
      endIndex: match.index + match[0].length,
      type: 'color',
      data: match[1]
    });
  }

  // Code blocks
  while ((match = codeBlockRegex.exec(content)) !== null) {
    allMatches.push({
      index: match.index,
      endIndex: match.index + match[0].length,
      type: 'code',
      data: { language: match[1] || 'javascript', code: match[2] }
    });
  }

  // Find color palettes (groups of 3+ colors)
  const colorMatches = allMatches.filter(m => m.type === 'color');
  if (colorMatches.length >= 3) {
    const start = colorMatches[0].index;
    const end = colorMatches[colorMatches.length - 1].endIndex;

    parts.push({ type: 'text', content: content.slice(0, start).trim() });
    parts.push({
      type: 'color-palette',
      content: colorMatches.map(m => ({ hex: `#${m.data}`, name: `Color ${colorMatches.indexOf(m) + 1}` }))
    });
    parts.push({ type: 'text', content: content.slice(end).trim() });
  } else {
    // No color palette, check for code blocks
    const codeMatches = allMatches.filter(m => m.type === 'code');
    if (codeMatches.length > 0) {
      const codeMatch = codeMatches[0];
      parts.push({ type: 'text', content: content.slice(0, codeMatch.index).trim() });
      parts.push({
        type: 'code-block',
        content: { code: codeMatch.data.code, language: codeMatch.data.language }
      });
      parts.push({ type: 'text', content: content.slice(codeMatch.endIndex).trim() });
    } else {
      // Plain text
      parts.push({ type: 'text', content: content });
    }
  }

  return parts.filter(part => part.content !== '');
};

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  autoScrollEnabled = true
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

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
    <div className="flex-1 overflow-y-auto p-6 space-y-8" ref={scrollContainerRef}>
      {messages.map((message) => {
        const textContent = message.parts.filter(part => part.type === 'text').map(part => part.text).join('');
        const parsedParts = parseMessageContent(textContent);

        return (
          <div
            key={message.id}
            className={`flex items-start gap-4 group ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* AI Avatar (left side) */}
            {message.role === 'assistant' && (
              <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                <BrainIcon size={20} />
              </div>
            )}

            {/* Message Content & Actions */}
            <div className="space-y-4">
              {/* Message bubble */}
              <div
                className={`px-4 py-3 rounded-xl group/bubble relative w-fit max-w-md backdrop-blur-sm ${
                  message.role === 'user'
                    ? 'bg-accent-blue/90 text-white rounded-br-none text-right'
                    : 'bg-neutral-800/50 text-neutral-300 rounded-tl-none'
                }`}
              >
                {/* Message content */}
                <div className="space-y-3">
                  {parsedParts.map((part, index) => {
                    switch (part.type) {
                      case 'text':
                        return message.role === 'assistant' ? (
                          <MarkdownRenderer key={index} content={part.content} />
                        ) : (
                          <p key={index} className="text-sm leading-relaxed text-foreground">
                            {part.content}
                          </p>
                        );
                      case 'color-palette':
                        return (
                          <ColorPalette
                            key={index}
                            colors={part.content}
                            className="max-w-sm"
                          />
                        );
                      case 'code-block':
                        return (
                          <CodeBlock
                            key={index}
                            code={part.content.code}
                            language={part.content.language}
                            className="max-w-full"
                          />
                        );
                      case 'file-attachment':
                        return (
                          <FileAttachment
                            key={index}
                            file={part.content}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                </div>

                {/* Timestamp */}
                {(message as any).createdAt && (
                  <time
                    dateTime={new Date((message as any).createdAt).toISOString()}
                    className="block text-xs text-neutral-400 mt-2 md:opacity-60 md:group-hover:opacity-100 transition-opacity"
                  >
                    {formatTime(new Date((message as any).createdAt))}
                  </time>
                )}

                {/* Message actions for AI messages - desktop hover, mobile always */}
                {message.role === 'assistant' && (
                  <div className="absolute top-3 right-3 md:opacity-0 md:group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-700/50 rounded-md transition-colors"
                      title="Copy message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* AI message actions (expandable suggestions) */}
              {message.role === 'assistant' && (
                <div className="flex flex-wrap gap-2">
                  <button className="text-sm bg-neutral-800/40 backdrop-blur-sm border border-neutral-700/60 px-3 py-1.5 rounded-lg hover:bg-neutral-700/60 transition-colors">
                    Expand on colors
                  </button>
                  <button className="text-sm bg-neutral-800/40 backdrop-blur-sm border border-neutral-700/60 px-3 py-1.5 rounded-lg hover:bg-neutral-700/60 transition-colors">
                    CSS variables
                  </button>
                </div>
              )}
            </div>

            {/* User Avatar (right side) */}
            {message.role === 'user' && (
              <div className="w-9 h-9 flex-shrink-0 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-sm">
                U
              </div>
            )}
          </div>
        );
      })}

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

      {/* Teaser CTA for /john-gpt dashboard - only on mobile and when there are messages */}
      {isMobile && messages.length > 0 && !isLoading && (
        <div className="mx-4 my-3 p-3 rounded-lg bg-primary/5 border border-primary/20 text-center">
          <p className="text-sm text-primary">
            Want more?
            <button
              onClick={() => router.push('/john-gpt')}
              className="ml-1 text-sm underline hover:text-primary/80 transition-colors"
            >
              Explore the full dashboard
            </button>
          </p>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
