import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBranchingChat } from '../hooks/useBranchingChat';
import { useWidgetPersistence } from '../hooks/useWidgetPersistence';
import { dbSyncManager } from '@/lib/storage/db-sync-manager';

import { AnimatedCloseIcon } from '@/components/icons/animated-icons';
import { MessageCircle, AlertCircle, Sparkles, Send, Paperclip, X, Maximize2, Minimize2, ChevronUp, ExternalLink, Trash2 } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { EmptyState } from './EmptyState';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSmartAutoScroll } from '@/hooks/useSmartAutoScroll';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';
import type { User as WorkOSUser } from '@workos-inc/node';
import { ChatActionProvider, useChatActions } from '../context/ChatActionContext';
import { useActiveChat } from '../context/ActiveChatContext';

/**
 * Props for the JohnGPT dialog component
 */
type JohnGPTDialogProps = {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when the dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** The current user */
  user?: WorkOSUser | null;
  /** Conversation ID when in follow-me mode (from full JohnGPT page) */
  followMeConversationId?: string;
};

export function JohnGPTDialog(props: JohnGPTDialogProps) {
  return (
    <ChatActionProvider>
      <JohnGPTDialogContent {...props} />
    </ChatActionProvider>
  );
}

function JohnGPTDialogContent({ open, onOpenChange, user, followMeConversationId }: JohnGPTDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, expandChat, minimizeChat, scrollToSection } = useChatActions();
  const { deactivateFollowMe } = useActiveChat();

  // Determine if we're in follow-me mode
  const isFollowMeMode = !!followMeConversationId;

  // Auto-minimize when route changes
  useEffect(() => {
    if (!state.isChatMinimized && open) {
      minimizeChat();
    }
  }, [pathname, searchParams, minimizeChat]);

  // Widget persistence - generates stable session IDs, loads previous session
  const {
    sessionId,
    effectiveUserId,
    initialMessages,
    isLoading: isPersistenceLoading,
    clearSession,
    openInJohnGPT,
  } = useWidgetPersistence({ userId: user?.id });

  // In follow-me mode, use the conversation ID from the full page
  const activeConversationId = isFollowMeMode ? followMeConversationId : sessionId;
  const activeUserId = isFollowMeMode && user?.id ? user.id : effectiveUserId;

  // Initialize useChat - use full-page API in follow-me mode for full capabilities
  const chatHelpers = useBranchingChat({
    api: isFollowMeMode ? '/api/chat' : '/api/chat?context=widget',
    conversationId: activeConversationId,
    userId: activeUserId,
    isWidget: !isFollowMeMode, // In follow-me mode, act like full page
    scrollToSection, // Enable section scrolling from goTo tool
  });
  const { messages, sendMessage, sendMessageWithModel, status, stop, error: chatError, addToolResult, editMessage, navigateBranch, setMessages } = chatHelpers;

  // Load initial messages from IndexedDB when persistence is ready
  // In follow-me mode, load from the active conversation instead
  useEffect(() => {
    const loadMessages = async () => {
      if (isFollowMeMode && followMeConversationId) {
        // Load follow-me conversation from IndexedDB (or API via DBSyncManager)
        try {
          const conversation = await dbSyncManager.loadConversation(followMeConversationId);
          if (conversation && conversation.messages.length > 0) {
            console.log('[JohnGPTDialog] Loading follow-me conversation:', followMeConversationId, 'with', conversation.messages.length, 'messages');
            setMessages(conversation.messages as any);
          }
        } catch (error) {
          console.error('[JohnGPTDialog] Failed to load follow-me conversation:', error);
        }
      } else if (!isPersistenceLoading && initialMessages.length > 0 && messages.length === 0) {
        console.log('[JohnGPTDialog] Loading', initialMessages.length, 'messages from IndexedDB');
        setMessages(initialMessages);
      }
    };

    loadMessages();
  }, [isFollowMeMode, followMeConversationId, isPersistenceLoading, initialMessages, messages.length, setMessages]);

  // Handler for clearing chat
  const handleClearChat = async () => {
    await clearSession();
    setMessages([]);
  };

  // Handler for opening in full JohnGPT page
  const handleOpenInJohnGPT = () => {
    const url = openInJohnGPT();
    router.push(url);
    onOpenChange(false); // Close widget
  };

  // Handler for expanding follow-me widget to full page
  const handleExpandToFullPage = () => {
    if (isFollowMeMode && followMeConversationId) {
      deactivateFollowMe(); // Clear follow-me state
      router.push(`/john-gpt/${followMeConversationId}`);
      onOpenChange(false);
    }
  };


  const [input, setInput] = useState('');

  // Inherited model from full-page JohnGPT (for widget model inheritance)
  const [inheritedModelId, setInheritedModelId] = useState<string | null>(null);

  // Load inherited model from localStorage on mount
  React.useEffect(() => {
    const storedModelId = localStorage.getItem('johngpt-widget-model');
    if (storedModelId) {
      console.log('[JohnGPTDialog] Inherited model from localStorage:', storedModelId);
      setInheritedModelId(storedModelId);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    // Use sendMessageWithModel to pass inherited model ID
    await sendMessageWithModel(
      { role: 'user', parts: [{ type: 'text', text: userMessage }] },
      inheritedModelId
    );
  };

  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle errors from chat with enhanced model-specific messages
  React.useEffect(() => {
    if (chatError) {
      const errorMsg = chatError.message || 'Failed to connect to JohnGPT.';
      if (errorMsg.includes('API key')) {
        setError('Model configuration error. Using default model.');
      } else if (errorMsg.includes('tier') || errorMsg.includes('access')) {
        setError('You don\'t have access to this model. Upgrade your tier.');
      } else {
        setError(errorMsg.length > 100 ? 'Failed to connect to JohnGPT. Please try again.' : errorMsg);
      }
    } else {
      setError(null);
    }
  }, [chatError]);

  const isLoading = status === 'submitted' || status === 'streaming';

  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Smart auto-scroll for widget messages
  const { scrollContainerRef, scrollAnchorRef } = useSmartAutoScroll({
    enabled: true,
    threshold: 100,
    debounceMs: 100,
  });

  // Dynamic height based on expansion state
  const modalHeight = isMobile ? 'h-full' : isExpanded ? 'h-[80vh]' : 'h-[600px]';
  const modalWidth = isMobile ? 'w-full' : isExpanded ? 'max-w-4xl' : 'max-w-[450px]';

  // Z-index logic: Immediate raise on expand, delayed drop on minimize
  const [activeZIndex, setActiveZIndex] = useState(state.isChatMinimized ? 49 : 60);

  React.useEffect(() => {
    if (state.isChatMinimized) {
      // Minimizing: Wait for animation (200ms) before dropping behind navbar
      // Slower timeout for slower animation (0.8s)
      const timer = setTimeout(() => setActiveZIndex(49), 150);
      return () => clearTimeout(timer);
    } else {
      // Expanding: Raise in front immediately
      setActiveZIndex(60);
    }
  }, [state.isChatMinimized]);

  // --- 3-State Morph Logic ---
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Manage Idle Timer
  React.useEffect(() => {
    if (state.isChatMinimized && !isMobile) {
      // Start timer when minimized
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 8000);
    } else {
      // Reset when expanded or mobile
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    }
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [state.isChatMinimized, isMobile]);

  const handleMouseEnter = () => {
    if (!isMobile && state.isChatMinimized) {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && state.isChatMinimized) {
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 8000);
    }
  };

  // DialogContent is now the main flex container with full background coverage
  // Added transform logic for minimized state
  // Mobile: Solomon Physics Animation + Z-index logic
  const dialogClasses = isMobile
    ? cn(
      'fixed inset-x-0 top-0 bottom-16 w-full border-0 shadow-none rounded-none flex flex-col bg-background/90 backdrop-blur-2xl origin-bottom',
      state.isChatMinimized ? 'animate-solomon-in' : 'animate-solomon-out',
      activeZIndex === 60 ? 'z-[60]' : 'z-[49]'
    )
    : cn(
      `fixed right-6 bottom-24 border border-border/40 shadow-2xl flex flex-col bg-background/60 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-bottom-right ring-1 ring-white/10`,
      // Desktop Minimization: Morph to "Glass Pill" or "Icon"
      state.isChatMinimized
        ? (isIdle
          ? 'w-[60px] h-[60px] rounded-2xl translate-y-0 pointer-events-auto z-[60] cursor-pointer hover:scale-110' // Icon State
          : 'w-[200px] h-[60px] rounded-full translate-y-0 pointer-events-auto z-[60] hover:scale-105 cursor-pointer' // Pill State
        )
        : `${modalWidth} ${modalHeight} rounded-3xl opacity-100 translate-y-0 pointer-events-auto z-[60]` // Expanded State
    );

  // Content wrapper classes - controls pointer events
  const contentClasses = cn(
    'flex flex-col h-full w-full',
    state.isChatMinimized ? 'pointer-events-none' : 'pointer-events-auto'
  );

  // Suggestions for empty state
  const suggestions = [
    "Brainstorm video ideas",
    "Refine my brand voice",
    "Create a content calendar",
    "Biblical perspective on creativity",
  ];

  // Wrap onOpenChange to prevent closing when clicking outside
  // Instead, just keep it minimized
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && open) {
      // Trying to close the dialog - just minimize it instead
      minimizeChat();
    } else {
      // Actually opening or fully closing
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
      <DialogContent
        className={dialogClasses}
        hideDefaultClose={true}
        hideOverlay={state.isChatMinimized} // Hide overlay when minimized to allow background clicks
        overlayClassName="bg-transparent transition-all duration-500 pointer-events-none"
        style={isMobile ? { '--solomon-offset': 'calc(100% - 70px)' } as React.CSSProperties : undefined}
        onClick={(!isMobile && state.isChatMinimized) ? expandChat : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Screen reader title for accessibility */}
        <DialogTitle className="sr-only">JohnGPT Chat Assistant</DialogTitle>

        {/* Mobile Peek Bar Handle (Visible when minimized on mobile) - ALWAYS INTERACTIVE */}
        {isMobile && state.isChatMinimized && (
          <div
            className="absolute -top-12 left-0 w-full h-12 bg-background/80 backdrop-blur-md rounded-t-2xl border-t border-white/20 flex items-center justify-between px-4 shadow-lg cursor-pointer pointer-events-auto"
            onClick={expandChat}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground">JohnGPT</span>
            </div>
            <ChevronUp className="w-5 h-5 text-muted-foreground animate-bounce" />
          </div>
        )}

        {/* Desktop Minimized "Glass Pill" View */}
        {!isMobile && state.isChatMinimized && (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            {/* Icon Container - Always visible but morphs position slightly */}
            <div className={cn(
              "w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md ring-1 ring-white/20 transition-all duration-500",
              isIdle ? "scale-110" : "mr-3"
            )}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>

            {/* Text Container - Fades out and collapses when Idle */}
            <div className={cn(
              "flex flex-col transition-all duration-500 overflow-hidden whitespace-nowrap",
              isIdle ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              <span className="text-sm font-semibold text-foreground">JohnGPT</span>
              <span className="text-[10px] text-muted-foreground">Click to expand</span>
            </div>
          </div>
        )}

        {/* Main Content (Hidden when minimized on desktop) */}
        {(!state.isChatMinimized || isMobile) && (
          <div className={contentClasses}>

            {/* Header */}
            <div className={cn(
              "flex-shrink-0 flex items-center justify-between p-4 border-b border-border/40 bg-background/40 backdrop-blur-xl rounded-t-3xl transition-all duration-300",
              (isMobile && state.isChatMinimized) ? "hidden" : "flex"
            )}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    JohnGPT
                    <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium border border-primary/20">
                      BETA
                    </span>
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {user ? 'Auto-saving' : 'Guest Mode'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Open in JohnGPT button - use follow-me handler when in that mode */}
                {messages.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFollowMeMode) {
                        handleExpandToFullPage();
                      } else {
                        handleOpenInJohnGPT();
                      }
                    }}
                    className="p-2 rounded-xl text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500 transition-all duration-200"
                    title={isFollowMeMode ? "Expand to Full Page" : "Open in JohnGPT"}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                {/* Clear Chat button */}
                {messages.length > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleClearChat(); }}
                    className="p-2 rounded-xl text-muted-foreground hover:bg-orange-500/10 hover:text-orange-500 transition-all duration-200"
                    title="Clear Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {!isMobile && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); minimizeChat(); }}
                      className="p-2 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-200"
                      title="Minimize"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                      className="p-2 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-200"
                      title={isExpanded ? "Restore" : "Maximize"}
                    >
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  </>
                )}
                {isMobile && !state.isChatMinimized && (
                  <button
                    onClick={minimizeChat}
                    className="p-2 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-200"
                    title="Minimize"
                  >
                    <ChevronUp className="w-4 h-4 rotate-180" />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenChange(false); }}
                  className="p-2 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages area - scrollContainerRef for autoscroll */}
            <div ref={scrollContainerRef} className="flex-1 flex flex-col overflow-y-auto relative bg-transparent min-h-0">
              {messages.length === 0 ? (
                <div className="flex-1">
                  <EmptyState
                    suggestions={suggestions}
                    onSuggestionClick={(text) => setInput(text)}
                    user={user}
                    isLocked={true}
                  />
                </div>
              ) : (
                <ChatMessages
                  messages={messages}
                  isLoading={isLoading}
                  user={user}
                  onEdit={editMessage}
                  onNavigateBranch={navigateBranch}
                  scrollAnchorRef={scrollAnchorRef}
                />
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex-shrink-0 mx-4 mb-2 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 animate-in slide-in-from-bottom-2 duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex-shrink-0 p-4 bg-background/40 backdrop-blur-xl border-t border-border/40 rounded-b-3xl transition-all duration-300">
              <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-secondary/40 hover:bg-secondary/60 border border-border/40 hover:border-primary/20 rounded-2xl p-2 transition-all duration-300 shadow-sm focus-within:shadow-md focus-within:border-primary/30 focus-within:bg-background/60">
                <button
                  type="button"
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-xl transition-all duration-200"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <TextareaAutosize
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Message JohnGPT..."
                  className="w-full bg-transparent border-none resize-none py-2 px-1 text-sm text-foreground focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60"
                  minRows={1}
                  maxRows={4}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim() && !isLoading) {
                        handleSubmit(e as any);
                      }
                    }
                  }}
                />

                {isLoading ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-foreground text-background rounded-xl hover:opacity-90 transition-all shadow-sm"
                  >
                    <div className="w-2 h-2 bg-current rounded-sm animate-pulse" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-sm disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none transform active:scale-95 duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </form>
              <div className="text-[10px] text-center text-muted-foreground mt-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
                Powered by Gemini Family of models
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
