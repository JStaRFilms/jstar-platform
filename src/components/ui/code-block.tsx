import React from 'react';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

/**
 * CodeBlock Component - Syntax-highlighted code with copy functionality
 * Matches mockup style: dark bg-black/50 with accent header and copy button
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  showLineNumbers = false,
  className = '',
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

  // Split code into lines for potential line numbering
  const codeLines = code.split('\n');

  return (
    <div className={`bg-black/50 rounded-xl overflow-hidden border border-neutral-700/80 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center bg-neutral-900/80 px-3 py-1.5 border-b border-neutral-700/50">
        <span className="text-xs font-semibold text-neutral-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors p-1 rounded hover:bg-neutral-700/50"
          aria-label="Copy code"
        >
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
        </button>
      </div>

      {/* Code content */}
      <pre className="p-3 text-xs font-mono overflow-x-auto">
        {/* TODO: Integrate syntax highlighting (Prism.js) */}
        <code className={`language-${language} text-white`}>
          {showLineNumbers ? (
            codeLines.map((line, index) => (
              <div key={index} className="flex">
                {showLineNumbers && (
                  <span className="text-neutral-500 mr-4 select-none min-w-[2rem]">
                    {index + 1}
                  </span>
                )}
                <span className="text-white">{line}</span>
              </div>
            ))
          ) : (
            <span className="text-white">{code}</span>
          )}
        </code>
      </pre>

      {/* Copy success feedback */}
      {copied && (
        <div className="absolute top-2 right-2 bg-accent-purple text-white text-xs px-2 py-1 rounded shadow-lg animate-in fade-in">
          Copied!
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
