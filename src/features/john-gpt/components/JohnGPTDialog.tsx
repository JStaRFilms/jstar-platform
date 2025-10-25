import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useChat } from '@ai-sdk/react';
import { useScrollBlur } from '@/hooks/useScrollBlur';
import { AnimatedCloseIcon } from '@/components/icons/animated-icons';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Props for the JohnGPT dialog component
 */
type JohnGPTDialogProps = {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when the dialog open state changes */
  onOpenChange: (open: boolean) => void;
};

export function JohnGPTDialog({ open, onOpenChange }: JohnGPTDialogProps) {
  const { messages, status, sendMessage, error: chatError } = useChat({
    api: '/api/chat',
    headers: {
      'Authorization': 'Bearer admin-dev-token',
    },
  } as any);

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Handle errors from chat
  React.useEffect(() => {
    if (chatError) {
      setError('Failed to connect to JohnGPT. Please try again.');
    } else {
      setError(null);
    }
  }, [chatError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  const handleRetry = () => {
    const retryText = input.trim() || 'Retry last message';
    sendMessage({ text: retryText });
    setInput('');
    setError(null);
  };

  const isLoading = status === 'streaming' || status === 'submitted';

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

  // Fixed height for consistent sizing on both mobile and desktop
  const fixedModalHeight = isMobile ? 'h-full' : 'h-[500px]';

  const [selectedPersona, setSelectedPersona] = useState('Creative Director');
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);

  // DialogContent is now the main flex container with full background coverage
  const dialogClasses = isMobile
    ? 'fixed inset-0 z-50 w-full h-full border-0 shadow-none rounded-none flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    : `fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl ${fixedModalHeight} border border-border shadow-2xl rounded-lg flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={dialogClasses}
        hideDefaultClose={true}
      >
        {/* Screen reader title for accessibility */}
        <DialogTitle className="sr-only">JohnGPT Chat Assistant</DialogTitle>

        {/* Header - flex-shrink-0 keeps it from shrinking */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
          {isMobile ? (
            /* Mobile Header */
            <div className="flex items-center justify-between w-full">
              {/* Back-to-Content Button */}
              <button
                onClick={() => {
                  onOpenChange(false);
                  // Optional: scroll to top or back to previous content
                }}
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                aria-label="Return to main content"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                {/* Contextual Awareness Badge */}
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                  <span>⚡</span>
                  <span>AI Assistant Mode</span>
                </div>
                <h1 className="font-semibold text-foreground">JohnGPT</h1>
                <p className="text-xs text-muted-foreground">
                  {status === 'streaming' ? 'JOHNGPT is generating...' :
                   status === 'ready' ? 'Ready to help' : 'Processing...'}
                </p>
              </div>
              {/* Keep X for quick close, but Back button is primary */}
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            /* Desktop Header */
            <div className="flex items-center justify-between w-full">
            <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
                  className="flex items-center gap-2 text-foreground bg-background/60 border border-border px-3 py-1.5 rounded-lg hover:bg-background/80 transition-colors"
                >
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-accent-blue to-accent-purple"></div>
                  <span className="font-medium">{selectedPersona}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isPersonaDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Persona dropdown */}
                {isPersonaDropdownOpen && (
                  <div className="absolute top-full mt-1 left-0 bg-background border border-border rounded-lg shadow-lg min-w-[200px] z-10">
                    {['Creative Director', 'Technical Advisor', 'Project Manager'].map((persona) => (
                      <button
                        key={persona}
                        onClick={() => {
                          setSelectedPersona(persona);
                          setIsPersonaDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted first:rounded-t-lg last:rounded-b-lg"
                      >
                        {persona}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Share Chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                </button>

                <AnimatedCloseIcon
                  onClick={() => onOpenChange(false)}
                  className="cursor-pointer text-muted-foreground hover:text-foreground"
                />
              </div>
            </div>
          )}
        </div>

        {/* Messages area - flex-1 makes it expand to fill remaining space */}
        <ChatMessages messages={messages} isLoading={isLoading} />

        {/* Error - flex-shrink-0 keeps it from shrinking */}
        {error && (
          <div className="flex-shrink-0 mx-4 mb-3 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              onClick={handleRetry}
              className="text-xs text-destructive hover:underline focus:outline-none focus:underline"
            >
              Retry last message
            </button>
          </div>
        )}

        {/* Input - flex-shrink-0 keeps it at bottom */}
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
