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
import type { User as WorkOSUser } from '@workos-inc/node';

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
  /** The current user, used for avatar */
  user?: WorkOSUser | null;
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



  // Find all patterns and create parts
  const allMatches: Array<{ index: number, endIndex: number, type: string, data: any }> = [];
  let match: RegExpExecArray | null;

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

/**
 * Component for rendering user message content with collapsible functionality
 */
const UserMessageContent = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!content) return null;

  const maxLength = 300;
  const shouldCollapse = content.length > maxLength;

  if (!shouldCollapse) {
    return <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>;
  }

  return (
    <div className="relative">
      <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${!isExpanded ? 'line-clamp-3' : ''}`}>
        {content}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs font-medium mt-1 hover:underline opacity-80 hover:opacity-100 transition-opacity"
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
};

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  autoScrollEnabled = true,
  user
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Scroll to bottom on mount
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

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
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 scroll-smooth" ref={scrollContainerRef}>
      {messages.map((message) => {
        const textContent = (message.parts
          ? message.parts.filter(part => part.type === 'text').map(part => part.text).join('')
          : (message as any).content) || '';

        const parsedParts = parseMessageContent(textContent);

        return (
          <div
            key={message.id}
            className={`flex items-start gap-3 md:gap-4 group animate-in fade-in slide-in-from-bottom-4 duration-500 ${message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            {/* AI Avatar (left side) */}
            {message.role === 'assistant' && (
              <div className="hidden md:flex w-8 h-8 md:w-9 md:h-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/80 to-purple-600/80 items-center justify-center shadow-md shadow-primary/10 ring-1 ring-white/10">
                <BrainIcon size={18} className="text-white" />
              </div>
            )}

            {/* Message Content & Actions */}
            <div className={`space-y-2 ${message.role === 'user' ? 'max-w-[85%] md:max-w-2xl items-end flex flex-col' : 'max-w-full md:max-w-4xl items-start flex flex-col w-full'}`}>
              {/* Message bubble */}
              <div
                className={`px-5 py-3.5 shadow-sm relative backdrop-blur-md transition-all duration-300 ${message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm'
                  : 'md:bg-background/60 md:border md:border-border/40 text-foreground rounded-2xl rounded-tl-sm md:hover:bg-background/80 md:hover:shadow-md md:hover:border-border/60 w-full md:w-auto bg-transparent border-none shadow-none p-0 md:px-5 md:py-3.5'
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
                          <UserMessageContent key={index} content={part.content} />
                        );
                      case 'color-palette':
                        return (
                          <ColorPalette
                            key={index}
                            colors={part.content}
                            className="max-w-sm my-2"
                          />
                        );
                      case 'code-block':
                        return (
                          <CodeBlock
                            key={index}
                            code={part.content.code}
                            language={part.content.language}
                            className="max-w-full my-2 shadow-sm border border-border/50"
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

                {/* Timestamp - Absolute positioned for cleaner look or inline if preferred, keeping inline for now but subtle */}
                {(message as any).createdAt && (
                  <div className={`flex items-center mt-1.5 gap-1.5 ${message.role === 'user' ? 'justify-end text-primary-foreground/70' : 'justify-start text-muted-foreground/70'}`}>
                    <time
                      dateTime={new Date((message as any).createdAt).toISOString()}
                      className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      {formatTime(new Date((message as any).createdAt))}
                    </time>
                  </div>
                )}

                {/* Message actions for AI messages */}
                {message.role === 'assistant' && (
                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                    <div className="bg-background border border-border shadow-sm rounded-lg p-0.5 flex items-center">
                      <button
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                        title="Copy message"
                        onClick={() => navigator.clipboard.writeText(textContent)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* AI message actions (expandable suggestions) */}
              {message.role === 'assistant' && (
                <div className="flex flex-wrap gap-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <button className="text-xs bg-background/40 backdrop-blur-sm border border-border/40 px-2.5 py-1 rounded-full hover:bg-background/80 hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground">
                    Expand on colors
                  </button>
                  <button className="text-xs bg-background/40 backdrop-blur-sm border border-border/40 px-2.5 py-1 rounded-full hover:bg-background/80 hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground">
                    CSS variables
                  </button>
                </div>
              )}
            </div>

            {/* User Avatar (right side) */}
            {message.role === 'user' && (
              <div className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center font-bold text-xs text-muted-foreground shadow-sm overflow-hidden ring-2 ring-background">
                {user?.profilePictureUrl ? (
                  <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
            )}
          </div>
        );
      })}

      {isLoading && (
        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted/30 border border-border/30 text-muted-foreground">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]"></div>
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]"></div>
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"></div>
            <span className="text-xs font-medium ml-1">Thinking...</span>
          </div>
        </div>
      )}

      {/* Teaser CTA for /john-gpt dashboard - only on mobile and when there are messages */}
      {isMobile && messages.length > 0 && !isLoading && (
        <div className="mx-4 my-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 border border-primary/10 text-center animate-in fade-in zoom-in-95 duration-500">
          <p className="text-sm text-primary font-medium">
            Want more capabilities?
            <button
              onClick={() => router.push('/john-gpt')}
              className="ml-2 text-sm underline decoration-primary/30 underline-offset-4 hover:text-primary/80 transition-colors"
            >
              Open Dashboard
            </button>
          </p>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
