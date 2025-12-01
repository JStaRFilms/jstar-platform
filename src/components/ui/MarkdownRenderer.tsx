import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from './code-block';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  variant?: 'default' | 'ghost';
}

export function MarkdownRenderer({ content, className, variant = 'default' }: MarkdownRendererProps) {
  return (
    <div className={cn("markdown-content text-foreground leading-relaxed break-words", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            // If inline is explicitly true, it's inline.
            // If inline is undefined/false, check if it's a block.
            // react-markdown passes inline={true} for `code` and inline={false} for ```code```
            const isInline = inline;

            if (isInline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                code={String(children).replace(/\n$/, '')}
                language={match ? match[1] : 'text'}
                className="my-4"
                variant={variant}
              />
            );
          },
          p: ({ children }) => <div className="mb-4 last:mb-0">{children}</div>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground bg-muted/30 py-2 pr-2 rounded-r">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-border">
              <table className="w-full text-sm text-left">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted text-muted-foreground uppercase">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
          tr: ({ children }) => <tr className="bg-background hover:bg-muted/50 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-4 py-3 font-medium">{children}</th>,
          td: ({ children }) => <td className="px-4 py-3">{children}</td>,
          hr: () => <hr className="my-6 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
