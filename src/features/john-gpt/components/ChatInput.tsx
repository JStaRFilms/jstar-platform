import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Send } from 'lucide-react';

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
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}) => {
  return (
    <div className="border-t border-border p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <TextareaAutosize
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 min-h-[40px] max-h-[120px] px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          disabled={isLoading}
          minRows={1}
          maxRows={5}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
