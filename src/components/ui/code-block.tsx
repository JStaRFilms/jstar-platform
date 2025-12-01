import React from 'react';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  variant?: 'default' | 'ghost';
}

/**
 * CodeBlock Component - Syntax-highlighted code with copy functionality
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  showLineNumbers = false,
  className = '',
  variant = 'default',
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Styles based on variant
  const containerStyles = variant === 'ghost'
    ? 'border-white/10 bg-black/20 backdrop-blur-sm'
    : 'border-border bg-muted/50 backdrop-blur-md';

  const headerStyles = variant === 'ghost'
    ? 'bg-white/5 border-white/10'
    : 'bg-muted/80 border-border';

  const textStyles = variant === 'ghost'
    ? 'text-white/70'
    : 'text-muted-foreground';

  const buttonStyles = variant === 'ghost'
    ? 'text-white/60 hover:text-white hover:bg-white/10'
    : 'text-muted-foreground hover:text-foreground hover:bg-background/50';

  const codeBgStyles = variant === 'ghost'
    ? 'bg-black/30 text-white/90 scrollbar-thumb-white/20'
    : 'bg-background/50 text-foreground scrollbar-thumb-muted-foreground/20';

  // Split code into lines for potential line numbering
  const codeLines = code.split('\n');

  return (
    <div className={`relative group/code rounded-lg overflow-hidden border ${containerStyles} ${className}`}>
      {/* Header */}
      <div className={`flex justify-between items-center px-3 py-2 border-b ${headerStyles}`}>
        <span className={`text-xs font-medium font-mono ${textStyles}`}>
          {language}
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-xs transition-colors p-1 rounded ${buttonStyles}`}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span className="hidden sm:inline">Copied</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className={`p-4 text-xs font-mono overflow-x-auto scrollbar-thin scrollbar-track-transparent ${codeBgStyles}`}>
        <code className={`language-${language}`}>
          {showLineNumbers ? (
            codeLines.map((line, index) => (
              <div key={index} className="flex">
                {showLineNumbers && (
                  <span className={`${variant === 'ghost' ? 'text-white/30' : 'text-muted-foreground'} mr-4 select-none min-w-[2rem] text-right`}>
                    {index + 1}
                  </span>
                )}
                <span>{line}</span>
              </div>
            ))
          ) : (
            <span>{code}</span>
          )}
        </code >
      </pre >
    </div >
  );
};

export default CodeBlock;
