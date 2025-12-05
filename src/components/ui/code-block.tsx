'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Prism from 'prismjs';

// Import Prism languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup'; // HTML

// Import custom theme
import '@/styles/prism-theme.css';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  variant?: 'default' | 'ghost';
}

/**
 * Mermaid Diagram Component
 */
const MermaidDiagram: React.FC<{ code: string }> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#7c3aed',
            primaryTextColor: '#fff',
            primaryBorderColor: '#9f7aea',
            lineColor: '#6b7280',
            secondaryColor: '#374151',
            tertiaryColor: '#1f2937',
            background: '#0d1117',
            mainBkg: '#1e1e1e',
            nodeBorder: '#6b7280',
            clusterBkg: '#1f2937',
            titleColor: '#fff',
            edgeLabelBackground: '#1f2937',
          },
        });

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError('Failed to render diagram');
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
        {error}
        <pre className="mt-2 text-xs text-white/60 overflow-x-auto">{code}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading diagram...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-diagram overflow-x-auto bg-[#1e1e1e] rounded-lg p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

/**
 * CodeBlock Component - Obsidian-inspired syntax-highlighted code with copy functionality
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  showLineNumbers = false,
  className = '',
  variant = 'default',
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  // Check if this is a Mermaid diagram
  const isMermaid = language.toLowerCase() === 'mermaid';

  // Apply Prism syntax highlighting
  useEffect(() => {
    if (codeRef.current && language !== 'text' && !isMermaid) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language, isMermaid]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Render Mermaid diagram
  if (isMermaid) {
    return (
      <div className={cn("relative group/code rounded-lg overflow-hidden my-4 w-full", className)}>
        <div className="flex justify-between items-center px-3 py-1.5 bg-white/5 border-b border-white/5">
          <span className="text-[10px] font-medium font-mono text-white/40 uppercase tracking-wider">
            Mermaid Diagram
          </span>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-all duration-200 px-2 py-1 rounded",
              "text-white/40 hover:text-white/80 hover:bg-white/10",
              "opacity-0 group-hover/code:opacity-100",
              copied && "!opacity-100 !text-emerald-400"
            )}
            aria-label="Copy code"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <MermaidDiagram code={code} />
      </div>
    );
  }

  // Language display name mapping
  const languageNames: Record<string, string> = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    tsx: 'TypeScript React',
    jsx: 'React JSX',
    py: 'Python',
    python: 'Python',
    css: 'CSS',
    scss: 'SCSS',
    html: 'HTML',
    markup: 'HTML',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    bash: 'Bash',
    sh: 'Shell',
    sql: 'SQL',
    rust: 'Rust',
    go: 'Go',
    diff: 'Diff',
    md: 'Markdown',
    markdown: 'Markdown',
    powershell: 'PowerShell',
    toml: 'TOML',
  };

  // Map language aliases to Prism language names
  const prismLanguage: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    yml: 'yaml',
    sh: 'bash',
    md: 'markdown',
    html: 'markup',
  };

  const actualLanguage = prismLanguage[language.toLowerCase()] || language.toLowerCase();
  const showLanguageLabel = language !== 'text' && language !== '';
  const displayLanguage = languageNames[language.toLowerCase()] || language.toUpperCase();

  return (
    <div className={cn(
      "relative group/code rounded-lg overflow-hidden my-4 w-full",
      "bg-[#1e1e1e] dark:bg-[#0d1117]",
      className
    )}>
      {/* Header - Obsidian style (only show if there's a language) */}
      {showLanguageLabel && (
        <div className="flex justify-between items-center px-3 py-1.5 bg-white/5 border-b border-white/5">
          <span className="text-[10px] font-medium font-mono text-white/40 uppercase tracking-wider">
            {displayLanguage}
          </span>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-all duration-200 px-2 py-1 rounded",
              "text-white/40 hover:text-white/80",
              "hover:bg-white/10",
              "opacity-0 group-hover/code:opacity-100",
              copied && "!opacity-100 !text-emerald-400"
            )}
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
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
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Floating copy button when no header */}
      {!showLanguageLabel && (
        <button
          onClick={handleCopy}
          className={cn(
            "absolute top-2 right-2 flex items-center gap-1.5 text-xs transition-all duration-200 px-2 py-1 rounded z-10",
            "text-white/40 hover:text-white/80",
            "hover:bg-white/10",
            "opacity-0 group-hover/code:opacity-100",
            copied && "!opacity-100 !text-emerald-400"
          )}
          aria-label="Copy code"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      )}

      {/* Code content - horizontal scroll preserved */}
      <div className="overflow-x-auto">
        <pre className="p-3 text-sm font-mono leading-relaxed m-0">
          <code
            ref={codeRef}
            className={`language-${actualLanguage}`}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
