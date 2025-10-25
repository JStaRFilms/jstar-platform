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
          <div className="flex items-center gap-2 text-lg font-semibold">
            <MessageCircle className="w-5 h-5 text-primary" />
            JohnGPT
          </div>
          <AnimatedCloseIcon
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          />
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
