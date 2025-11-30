import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useChat } from '@ai-sdk/react';
import { useScrollBlur } from '@/hooks/useScrollBlur';
import { AnimatedCloseIcon } from '@/components/icons/animated-icons';
import { MessageCircle, AlertCircle, Sparkles, Send, Paperclip, X, Maximize2, Minimize2 } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';
import type { User as WorkOSUser } from '@workos-inc/node';

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
};

export function JohnGPTDialog({ open, onOpenChange, user }: JohnGPTDialogProps) {
  // Initialize useChat - works seamlessly with toUIMessageStreamResponse()
  const chatHelpers = useChat();
  const { messages, sendMessage, status, stop, error: chatError } = chatHelpers;

  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    await sendMessage({
      text: userMessage,
    }, {
      body: {
        personaId: selectedPersona,
      }
    });
  };

  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle errors from chat
  React.useEffect(() => {
    if (chatError) {
      setError('Failed to connect to JohnGPT. Please try again.');
    } else {
      setError(null);
    }
  }, [chatError]);

  const isLoading = status === 'submitted' || status === 'streaming';

  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Apply motion blur to background when open
  const { isScrolling, startScrollBlur } = useScrollBlur({
    blurDuration: 600,
    blurIntensity: 0.3
  });

  React.useEffect(() => {
    if (open) {
      startScrollBlur();
    }
  }, [open, startScrollBlur]);

  // Dynamic height based on expansion state
  const modalHeight = isMobile ? 'h-full' : isExpanded ? 'h-[80vh]' : 'h-[600px]';
  const modalWidth = isMobile ? 'w-full' : isExpanded ? 'max-w-4xl' : 'max-w-[450px]';

  const [selectedPersona, setSelectedPersona] = useState('Creative Director');
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);

  // DialogContent is now the main flex container with full background coverage
  const dialogClasses = isMobile
    ? 'fixed inset-x-0 top-0 bottom-16 z-[60] w-full border-0 shadow-none rounded-none flex flex-col bg-background/90 backdrop-blur-2xl'
    : `fixed right-6 bottom-24 ${modalWidth} ${modalHeight} border border-border/40 shadow-2xl rounded-3xl flex flex-col bg-background/60 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-bottom-right z-50 ring-1 ring-white/10`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={dialogClasses}
        hideDefaultClose={true}
        overlayClassName="bg-transparent md:bg-black/20 backdrop-blur-[2px] transition-all duration-500"
        onInteractOutside={(e) => e.preventDefault()} // Prevent closing when clicking outside on desktop to allow multitasking
      >
        {/* Screen reader title for accessibility */}
        <DialogTitle className="sr-only">JohnGPT Chat Assistant</DialogTitle>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border/40 bg-background/40 backdrop-blur-xl rounded-t-3xl transition-all duration-300">
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
              <button
                onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
              >
                {selectedPersona}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-3 w-3 transition-transform duration-300 ${isPersonaDropdownOpen ? 'rotate-180' : ''} group-hover:text-primary`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!isMobile && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-200"
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Persona Dropdown Overlay */}
        {isPersonaDropdownOpen && (
          <div className="absolute top-[70px] left-4 z-20 bg-background/95 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-xl w-56 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-white/10">
            <div className="p-1.5 space-y-0.5">
              {['Creative Director', 'Technical Advisor', 'Project Manager', 'Faith Guide'].map((persona) => (
                <button
                  key={persona}
                  onClick={() => {
                    setSelectedPersona(persona);
                    setIsPersonaDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 text-sm rounded-xl transition-all duration-200",
                    selectedPersona === persona
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-secondary/50"
                  )}
                >
                  {persona}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-transparent min-h-0">
          <ChatMessages messages={messages} isLoading={isLoading} user={user} />
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
              placeholder={`Message ${selectedPersona}...`}
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
      </DialogContent>
    </Dialog>
  );
}
