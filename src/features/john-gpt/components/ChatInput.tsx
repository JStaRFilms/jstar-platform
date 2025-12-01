import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Send, Paperclip, Terminal, Flame, Zap, Book, Sparkles } from 'lucide-react';
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
  const [showSlashMenu, setShowSlashMenu] = React.useState(false);
  const [slashFilter, setSlashFilter] = React.useState('');

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

  const safeInput = input || '';

  const commands = [
    { cmd: '/code', label: 'Engineering Mode', icon: Terminal, desc: 'Clean code' },
    { cmd: '/roast', label: 'Roast Mode', icon: Flame, desc: 'Ruthless critique' },
    { cmd: '/simplify', label: 'Simplify Mode', icon: Zap, desc: 'ELI5' },
    { cmd: '/bible', label: 'Biblical Mode', icon: Book, desc: 'Scripture' },
  ];

  const filteredCommands = commands.filter(c => c.cmd.toLowerCase().includes(slashFilter.toLowerCase()));

  const handleSlashCommand = (cmd: string) => {
    // Create a synthetic event to update the input
    const event = {
      target: { value: cmd + ' ' }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    handleInputChange(event);
    setShowSlashMenu(false);
  };

  // Detect slash command typing
  React.useEffect(() => {
    if (safeInput.startsWith('/')) {
      setShowSlashMenu(true);
      setSlashFilter(safeInput);
    } else {
      setShowSlashMenu(false);
    }
  }, [safeInput]);

  // Detect mode based on slash command
  const getMode = (text: string) => {
    if (text.startsWith('/code')) return { icon: Terminal, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Code Mode' };
    if (text.startsWith('/roast')) return { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Roast Mode' };
    if (text.startsWith('/simplify')) return { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Simplify Mode' };
    if (text.startsWith('/bible')) return { icon: Book, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Bible Mode' };
    return null; // Default mode
  };

  const mode = getMode(safeInput);

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      {/* Slash Command Autocomplete Menu */}
      {showSlashMenu && filteredCommands.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-background/80 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">
          <div className="p-1">
            {filteredCommands.map((cmd) => (
              <button
                key={cmd.cmd}
                onClick={() => handleSlashCommand(cmd.cmd)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-md bg-secondary/50 flex items-center justify-center group-hover:bg-background group-hover:shadow-sm transition-all">
                  <cmd.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{cmd.cmd}</p>
                  <p className="text-xs text-muted-foreground">{cmd.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative group">
        <div className={cn(
          "relative flex items-end gap-2 bg-secondary/50 hover:bg-secondary/70 border border-transparent focus-within:border-border/50 rounded-[26px] p-2 pl-4 transition-all shadow-sm focus-within:shadow-md focus-within:bg-background",
          mode && "ring-1 ring-border"
        )}>
          {/* Mode Indicator or File Attachment */}
          {mode ? (
            <div className={cn(
              "flex-shrink-0 w-8 h-8 mb-1 flex items-center justify-center rounded-full transition-all",
              mode.bg,
              mode.color
            )} title={mode.label}>
              <mode.icon className="w-5 h-5" />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleFileAttach}
              className="flex-shrink-0 w-8 h-8 mb-1 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-full transition-all"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          )}

          {/* Text input */}
          <TextareaAutosize
            value={safeInput}
            onChange={handleInputChange}
            placeholder={mode ? `Using ${mode.label}...` : "Ask anything..."}
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
