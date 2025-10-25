import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Send, Paperclip } from 'lucide-react';
import { BrainIcon } from '@/components/ui/BrainIcon';

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
  const [persona, setPersona] = React.useState('Creative Director');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

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

  return (
    <div className="flex-shrink-0 p-4 bg-neutral-900/80 backdrop-blur-lg border-t border-neutral-800/60">
      <div className="w-full max-w-4xl mx-auto">
        {/* Persona selector - mobile only (desktop shown in header) */}
        <div className="md:hidden mb-3">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-center gap-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 hover:bg-neutral-700 transition-colors"
          >
            <span className="text-accent-purple">
              <BrainIcon size={16} className="inline-block mr-1" />
            </span>
            <span className="font-medium text-white">{persona}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 text-neutral-400 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown options */}
          {isDropdownOpen && (
            <div className="mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
              {['Creative Director', 'Technical Advisor', 'Project Manager'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setPersona(option);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-700 first:rounded-t-lg last:rounded-b-lg"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-2">
            {/* File attachment button */}
            <button
              type="button"
              onClick={handleFileAttach}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-neutral-800 text-neutral-400 rounded-full hover:bg-neutral-700 transition-colors"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Text input */}
            <TextareaAutosize
              value={input}
              onChange={handleInputChange}
              placeholder="Message JohnGPT..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl resize-none p-3 pr-12 text-white focus:ring-2 focus:ring-accent-purple focus:outline-none"
              disabled={isLoading}
              minRows={1}
              maxRows={5}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isLoading) {
                    handleSubmit(e as any);
                  }
                }
              }}
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bottom-3 w-8 h-8 flex items-center justify-center bg-accent-purple text-white rounded-full hover:bg-violet-500 transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
