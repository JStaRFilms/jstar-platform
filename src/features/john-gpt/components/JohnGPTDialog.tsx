import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useChat } from '@ai-sdk/react';
import { useScrollBlur } from '@/hooks/useScrollBlur';
import { AnimatedCloseIcon } from '@/components/icons/animated-icons';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border shadow-2xl ${isScrolling ? 'ring-1 ring-ring/20' : ''} w-full h-full md:max-w-2xl md:h-auto md:rounded-lg`}>
        <DialogHeader className="flex flex-row items-center justify-between p-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <MessageCircle className="w-5 h-5 text-primary" />
            JohnGPT
          </DialogTitle>
          <AnimatedCloseIcon
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          />
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden max-h-[calc(100vh-200px)] md:max-h-[500px]">
          <ChatMessages messages={messages} isLoading={isLoading} />

          {error && (
            <div className="mx-4 mb-3 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
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

          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
