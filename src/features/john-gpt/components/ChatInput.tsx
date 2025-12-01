import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the ChatInput component
 */
interface ChatInputProps {
  /** The current input value */
  input: string;
  /** Handler for input value changes */
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Handler for form submission */
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Whether the AI is currently loading/generating a response */
  isLoading: boolean;
  /** Function to stop the current generation */
  stop: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
}) => {
  const handleFileAttach = () => {
    // TODO: Implement file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('File selected:', file);
        // TODO: Handle file upload
      }
    };
    input.click();
  };

  // Safe input handling
  const safeInput = input || '';

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-end gap-2 bg-secondary/50 hover:bg-secondary/70 border border-transparent focus-within:border-border/50 rounded-[26px] p-2 pl-4 transition-all shadow-sm focus-within:shadow-md focus-within:bg-background">
          {/* File attachment button */}
          <button
            type="button"
            onClick={handleFileAttach}
            className="flex-shrink-0 w-8 h-8 mb-1 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-full transition-all"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text input */}
          <TextareaAutosize
            value={safeInput}
            onChange={handleInputChange}
            placeholder="Ask anything"
            className="w-full bg-transparent border-none resize-none py-3 px-2 text-base text-foreground focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60"
            disabled={isLoading}
            minRows={1}
            maxRows={5}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (safeInput.trim() && !isLoading) {
                  handleSubmit(e as any);
                }
              }
            }}
          />

          {/* Send / Stop button */}
          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="flex-shrink-0 w-8 h-8 mb-1 flex items-center justify-center bg-foreground text-background rounded-full hover:opacity-90 transition-all shadow-sm"
            >
              <div className="w-2.5 h-2.5 bg-current rounded-sm" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!safeInput.trim()}
              className="flex-shrink-0 w-8 h-8 mb-1 flex items-center justify-center bg-foreground text-background rounded-full hover:opacity-90 transition-all shadow-sm disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
