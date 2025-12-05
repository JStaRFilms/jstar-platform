import React from 'react';
import { UIMessage } from '@ai-sdk/react';
import { formatTime } from '@/lib/utils';
import { BrainIcon } from '@/components/ui/BrainIcon';
import { ColorPalette } from '@/components/ui/color-palette';
import { CodeBlock } from '@/components/ui/code-block';
import { FileAttachment } from '@/components/ui/file-attachment';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter, usePathname } from 'next/navigation';
import type { User as WorkOSUser } from '@workos-inc/node';
import { ExtendedMessage } from '@/lib/chat-types';
import { Check, ChevronDown, Edit2, Copy, Compass, ChevronLeft, ChevronRight, Save, X } from 'lucide-react';
import { BranchingMessage } from '../hooks/useBranchingChat';
import { LoginActionComponent, NavigationPreview } from './ChatActionComponents';

/**
 * Props for the ChatMessages component
 */
interface ChatMessagesProps {
  /** The array of chat messages from the AI SDK */
  messages: ExtendedMessage[] | UIMessage[] | BranchingMessage[];
  /** Whether the AI is currently loading/generating a response */
  isLoading: boolean;
  /** Whether auto-scroll is enabled */
  autoScrollEnabled?: boolean;
  /** The current user, used for avatar */
  user?: WorkOSUser | null;
  /** Handler for editing a message */
  onEdit?: (messageId: string, content: string) => void;
  /** Handler for navigating branches */
  onNavigateBranch?: (messageId: string, direction: 'prev' | 'next') => void;
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
const UserMessageContent = ({
  message,
  isMobile,
  isEditable,
  onEdit,
  onNavigateBranch
}: {
  message: BranchingMessage | any;
  isMobile: boolean;
  isEditable: boolean;
  onEdit?: (messageId: string, content: string) => void;
  onNavigateBranch?: (messageId: string, direction: 'prev' | 'next') => void;
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showCopy, setShowCopy] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false); // For mobile toggle
  const [isEditing, setIsEditing] = React.useState(false);

  // Extract content from parts or fallback to content
  const parts = (message as any).parts || [];
  const textParts = parts.filter((p: any) => p.type === 'text');
  const content = textParts.length > 0
    ? textParts.map((p: any) => p.text).join('')
    : (message as any).content || '';

  const [editContent, setEditContent] = React.useState(content);

  if (!content) return null;

  // Lower threshold to encourage collapsing for multi-line inputs
  const maxLength = 300; // Increased slightly as 5 lines allows more text
  const isLong = content.length > maxLength || content.split('\n').length > 5;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(content);

    setShowCopy(true);
    setTimeout(() => setShowCopy(false), 2000);
  };

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditContent(content);
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && editContent.trim() !== content) {
      onEdit(message.id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditContent(content);
  };

  const handleMessageClick = () => {
    if (isMobile && !isEditing) {
      setShowActions(!showActions);
    }
  };

  // Branch Navigation
  const showBranchNav = message.branchCount && message.branchCount > 1;
  const currentBranch = (message.branchIndex || 0) + 1;
  const totalBranches = message.branchCount || 1;

  if (isEditing) {
    return (
      <div className="w-full min-w-[300px] max-w-full bg-background/20 rounded-lg p-2 backdrop-blur-sm border border-white/20">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full bg-transparent text-white text-[15px] leading-relaxed resize-none focus:outline-none min-h-[80px]"
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={handleCancelEdit}
            className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Save & Regenerate"
          >
            <Save className="w-3.5 h-3.5" />
            Save & Run
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative group/user-msg transition-all duration-300 ${!isExpanded ? 'max-w-[600px]' : 'max-w-full'} cursor-pointer md:cursor-auto`}
      onClick={handleMessageClick}
    >
      <div
        className={`text-[15px] leading-relaxed break-words transition-all duration-300 text-white relative ${!isExpanded && isLong
          ? 'max-h-[160px] overflow-hidden mask-linear-gradient'
          : ''
          }`}
      >
        <MarkdownRenderer content={content} className="text-white" variant="ghost" />
      </div>

      {/* Branch Navigation (Visible on Hover or if multiple branches exist) */}
      {showBranchNav && (
        <div className="flex items-center gap-1 mt-2 text-white/60 select-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigateBranch?.(message.id, 'prev');
            }}
            className="p-0.5 hover:text-white hover:bg-white/10 rounded transition-colors"
            disabled={currentBranch === 1} // Optional: loop or disable
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <span className="text-[10px] font-medium font-mono">
            {currentBranch} / {totalBranches}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigateBranch?.(message.id, 'next');
            }}
            className="p-0.5 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Actions Toolbar */}
      <div className={`flex items-center gap-1 mt-0.5 justify-end transition-all duration-200 ${isMobile
        ? (showActions ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 overflow-hidden')
        : 'opacity-0 group-hover/user-msg:opacity-100'
        }`}>

        {/* Edit Button */}
        {isEditable && (
          <button
            onClick={handleEditStart}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
            title="Edit message"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
          title="Copy"
        >
          {showCopy ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        {/* Expand/Collapse Button */}
        {isLong && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={`p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white ${isMobile ? 'opacity-100' : ''}`}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            title={isExpanded ? "Show less" : "Show more"}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Mobile-only always visible expand button if actions are hidden and it is long */}
      {isMobile && isLong && !showActions && (
        <div className="absolute bottom-0 right-0 p-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 bg-black/20 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-colors shadow-sm border border-white/10"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
};

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  autoScrollEnabled = true,
  user,
  onEdit,
  onNavigateBranch
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
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

  // Calculate user message indices for editability (ALL user messages are now editable in branching mode)
  // But we might want to keep the "last 2" rule? No, branching allows editing ANY past message.
  // So we'll make all user messages editable.
  const isBranchingMode = true; // Always true now with new hook


  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 scroll-smooth" ref={scrollContainerRef}>
      {messages.map((message) => {
        // Handle both UIMessage and ExtendedMessage structures
        const parts = (message as any).parts || [];
        const textParts = parts.filter((p: any) => p.type === 'text');
        const textContent = textParts.length > 0
          ? textParts.map((p: any) => p.text).join('')
          : (message as any).content || '';



        // Extract media attachments
        const mediaParts = parts.filter((p: any) => p.type === 'image_link');

        // For user messages, we render the entire content in one block to handle compression correctly
        // For assistant messages, we parse it to handle special components like color palettes
        const isUser = message.role === 'user';
        const parsedParts = isUser ? [] : parseMessageContent(textContent);
        const isEditable = isUser;

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
            <div className={`space-y-2 ${message.role === 'user' ? 'max-w-[90%] md:max-w-3xl items-end flex flex-col' : 'max-w-full md:max-w-5xl items-start flex flex-col w-full'}`}>
              {/* Message bubble */}
              <div
                className={`px-5 py-3.5 shadow-sm relative backdrop-blur-md transition-all duration-300 max-w-full ${message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm overflow-hidden w-fit'
                  : 'md:bg-background/60 md:border md:border-border/40 text-foreground rounded-2xl rounded-tl-sm md:hover:bg-background/80 md:hover:shadow-md md:hover:border-border/60 w-full md:w-auto bg-transparent border-none shadow-none p-0 md:px-5 md:py-3.5'
                  }`}
              >
                {/* Message content */}
                <div className="space-y-3">
                  {/* Render Media Attachments first */}
                  {mediaParts.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {mediaParts.map((part: any, i: number) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden border border-border/50 bg-background/50">
                          <div className="flex items-center gap-2 p-2">
                            <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                            </div>
                            <div className="text-xs">
                              <p className="font-medium truncate max-w-[150px]">Image Attachment</p>
                              <p className="text-muted-foreground text-[10px]">ID: {part.driveFileId?.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isUser ? (
                    <UserMessageContent
                      message={message}
                      isMobile={isMobile}
                      isEditable={true} // All user messages are editable in branching mode
                      onEdit={onEdit}
                      onNavigateBranch={onNavigateBranch}
                    />
                  ) : (
                    <>
                      {parsedParts.map((part, index) => {
                        switch (part.type) {
                          case 'text':
                            return <MarkdownRenderer key={index} content={part.content} />;
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
                      {/* Handle tool results from message.parts (AI SDK format) */}
                      {message.parts?.map((part: any, index: number) => {
                        // AI SDK returns tool calls as parts with type 'tool-{toolName}'
                        if (part.type === 'tool-navigate' && part.state === 'output-available') {
                          console.log('🚀 [ChatMessages] Found tool-navigate part:', part);
                          const result = part.output;

                          if (result.action === 'showLoginComponent') {
                            return (
                              <LoginActionComponent
                                key={`tool-nav-${index}`}
                                requiredTier={result.requiredTier}
                                targetUrl={result.targetUrl}
                                pageTitle={result.pageTitle}
                                message={result.message}
                              />
                            );
                          }

                          if (result.action === 'navigate') {
                            // Pass timestamp=0 to mark as "not fresh" - navigation only triggers
                            // when the message is first streamed (handled by the hook's onFinish)
                            return (
                              <NavigationPreview
                                key={`tool-nav-${index}`}
                                url={result.url}
                                title={result.title}
                                message={result.message}
                                timestamp={0}
                              />
                            );
                          }

                          // Fallback for text messages or errors
                          if (typeof result === 'string') {
                            return (
                              <div key={`tool-nav-${index}`} className="text-sm text-muted-foreground italic my-2">
                                {result}
                              </div>
                            );
                          }
                        }
                        return null;
                      })}
                      {/* Legacy toolInvocations handling (kept for compatibility) */}
                      {(message as any).toolInvocations?.map((toolInvocation: any) => {
                        // Special handling for navigation tool results
                        if (toolInvocation.toolName === 'navigate' && toolInvocation.state === 'result') {
                          const result = toolInvocation.result;
                          if (result.action === 'showLoginComponent') {
                            return (
                              <LoginActionComponent
                                key={toolInvocation.toolCallId}
                                requiredTier={result.requiredTier}
                                targetUrl={result.targetUrl}
                                pageTitle={result.pageTitle}
                                message={result.message}
                              />
                            );
                          }
                          if (result.action === 'navigate') {
                            return (
                              <NavigationPreview
                                key={toolInvocation.toolCallId}
                                url={result.url}
                                title={result.title}
                                message={result.message}
                              />
                            );
                          }
                          // Fallback for text messages or errors
                          if (typeof result === 'string') {
                            return (
                              <div key={toolInvocation.toolCallId} className="text-sm text-muted-foreground italic my-2">
                                {result}
                              </div>
                            );
                          }
                        }

                        // Default tool invocation display
                        return (
                          <div key={toolInvocation.toolCallId} className="mt-3 p-3 bg-secondary/30 rounded-xl border border-border/40 flex items-center gap-3 text-sm animate-in fade-in slide-in-from-bottom-2">
                            <div className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center border border-blue-500/20">
                              <Compass className="w-4 h-4 animate-[spin_3s_linear_infinite]" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground text-[10px] uppercase tracking-wider opacity-70 mb-0.5">Action</div>
                              <div className="text-foreground/90 font-medium">
                                {`Calling ${toolInvocation.toolName}...`}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )}
                </div>

                {/* Timestamp - Absolute positioned for cleaner look or inline if preferred, keeping inline for now but subtle */}
                {((message as any).createdAt || (message as any).timestamp) && (
                  <div className={`flex items-center mt-1.5 gap-1.5 ${message.role === 'user' ? 'justify-end text-primary-foreground/70' : 'justify-start text-muted-foreground/70'}`}>
                    <time
                      dateTime={new Date((message as any).timestamp || (message as any).createdAt).toISOString()}
                      className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      {formatTime(new Date((message as any).timestamp || (message as any).createdAt))}
                    </time>
                  </div>
                )}

                {/* Message actions for AI messages */}
                {message.role === 'assistant' && (
                  <>
                    {/* Top Right Copy */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                      <div className="bg-background/80 backdrop-blur-sm border border-border shadow-sm rounded-lg p-0.5 flex items-center">
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

                    {/* Bottom Right Copy - Only for long messages */}
                    {textContent.length > 500 && (
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                        <div className="bg-background/80 backdrop-blur-sm border border-border shadow-sm rounded-lg p-0.5 flex items-center">
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
                  </>
                )}
              </div >

              {/* AI message actions (expandable suggestions) */}
              {
                message.role === 'assistant' && (
                  <div className={`flex flex-wrap gap-2 px-1 transition-opacity duration-500 delay-100 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                    <button className="text-xs bg-background/40 backdrop-blur-sm border border-border/40 px-2.5 py-1 rounded-full hover:bg-background/80 hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground">
                      Expand on colors
                    </button>
                    <button className="text-xs bg-background/40 backdrop-blur-sm border border-border/40 px-2.5 py-1 rounded-full hover:bg-background/80 hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground">
                      CSS variables
                    </button>
                  </div>
                )
              }
            </div >

            {/* User Avatar (right side) */}
            {
              message.role === 'user' && (
                <div className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center font-bold text-xs text-muted-foreground shadow-sm overflow-hidden ring-2 ring-background">
                  {user?.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}</span>
                  )}
                </div>
              )
            }
          </div >
        );
      })}

      {
        isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted/30 border border-border/30 text-muted-foreground">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]"></div>
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]"></div>
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"></div>
              <span className="text-xs font-medium ml-1">Thinking...</span>
            </div>
          </div>
        )
      }

      {/* Teaser CTA for /john-gpt dashboard - only on mobile and when there are messages AND not already on the dashboard */}
      {
        isMobile && messages.length > 0 && !isLoading && !pathname?.startsWith('/john-gpt') && (
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
        )
      }

      <div ref={messagesEndRef} />
    </div >
  );
};
