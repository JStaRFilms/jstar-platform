import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
// NOTE: rehype-raw removed - it was rendering HTML inside code blocks as actual elements
import { remarkAlert } from 'remark-github-blockquote-alert';
import { CodeBlock } from './code-block';
import 'katex/dist/katex.min.css';
import '@/styles/github-alerts.css';

import { cn } from '@/lib/utils';
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  variant?: 'default' | 'ghost';
}

export function MarkdownRenderer({ content, className, variant = 'default' }: MarkdownRendererProps) {
  return (
    <div className={cn("markdown-content text-foreground leading-relaxed break-words", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm, remarkAlert]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // ============================================
          // CODE - Inline vs Block detection
          // ============================================
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const content = String(children).replace(/\n$/, '');

            // If has language class OR contains newlines, it's a code block
            const isBlock = match || content.includes('\n');

            if (!isBlock) {
              // INLINE CODE - subtle Obsidian-style
              return (
                <code
                  className="bg-muted/70 dark:bg-white/10 px-1.5 py-0.5 rounded text-[0.875em] font-mono text-foreground/90 dark:text-white/90"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // CODE BLOCK - full component
            return (
              <CodeBlock
                code={content}
                language={match ? match[1] : 'text'}
                className="my-4"
                variant={variant}
              />
            );
          },

          // ============================================
          // PARAGRAPHS
          // ============================================
          p: ({ children }) => <div className="mb-4 last:mb-0">{children}</div>,

          // ============================================
          // LISTS
          // ============================================
          ul: ({ children, className }) => {
            const isTaskList = React.Children.toArray(children).some((child: any) => {
              return child?.props?.className?.includes('task-list-item');
            });

            return (
              <ul className={cn(
                "pl-6 mb-4 space-y-2",
                isTaskList ? "list-none" : "list-disc marker:text-primary/70",
                className
              )}>
                {children}
              </ul>
            );
          },

          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-primary/70 marker:font-semibold">
              {children}
            </ol>
          ),

          li: ({ children, className, ...props }) => {
            const isTaskItem = className?.includes('task-list-item');
            return (
              <li
                className={cn(
                  "pl-1",
                  isTaskItem && "flex items-start gap-2 list-none"
                )}
                {...props}
              >
                {children}
              </li>
            );
          },

          // ============================================
          // TASK LIST CHECKBOXES
          // ============================================
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-4 h-4 rounded border-2 mr-2 flex-shrink-0 mt-0.5",
                    checked
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-muted-foreground/40 dark:border-muted-foreground/60"
                  )}
                  aria-checked={checked}
                  role="checkbox"
                >
                  {checked && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
              );
            }
            return <input type={type} checked={checked} {...props} />;
          },

          // ============================================
          // HEADINGS
          // ============================================
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2 text-foreground">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-bold mt-4 mb-2 text-foreground">{children}</h4>,
          h5: ({ children }) => <h5 className="text-sm font-bold mt-3 mb-1 text-foreground">{children}</h5>,
          h6: ({ children }) => <h6 className="text-xs font-bold mt-3 mb-1 text-muted-foreground uppercase tracking-wide">{children}</h6>,

          // ============================================
          // BLOCKQUOTES - Nested with depth colors
          // ============================================
          blockquote: ({ children }) => (
            <blockquote className="markdown-blockquote border-l-4 border-primary/60 pl-4 italic my-4 text-foreground/80 dark:text-foreground/70 bg-muted/30 dark:bg-muted/20 py-3 pr-4 rounded-r-lg [&>blockquote]:border-l-blue-400 [&>blockquote]:bg-blue-500/10 [&>blockquote>blockquote]:border-l-purple-400 [&>blockquote>blockquote]:bg-purple-500/10 [&>blockquote>blockquote>blockquote]:border-l-amber-400 [&>blockquote>blockquote>blockquote]:bg-amber-500/10">
              {children}
            </blockquote>
          ),

          // ============================================
          // LINKS
          // ============================================
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline font-medium hover:text-primary/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // ============================================
          // TABLES
          // ============================================
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-border/60 dark:border-border/40 shadow-sm">
              <table className="w-full text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/70 dark:bg-muted/40 text-foreground border-b border-border/60">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/40 dark:divide-border/30">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="bg-background hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children, style }) => (
            <th
              className="px-4 py-3 font-semibold text-foreground text-left first:rounded-tl-xl last:rounded-tr-xl"
              style={style}
            >
              {children}
            </th>
          ),
          td: ({ children, style }) => (
            <td
              className="px-4 py-3 text-foreground/90"
              style={style}
            >
              {children}
            </td>
          ),

          // ============================================
          // HORIZONTAL RULE
          // ============================================
          hr: () => (
            <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-border dark:via-border/60 to-transparent" />
          ),

          // ============================================
          // IMAGES
          // ============================================
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="max-w-full h-auto rounded-lg my-4 border border-border/30"
              loading="lazy"
            />
          ),

          // ============================================
          // EMPHASIS
          // ============================================
          strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
          del: ({ children }) => <del className="line-through text-muted-foreground">{children}</del>,

          // ============================================
          // PRE - wrapper for code blocks
          // ============================================
          pre: ({ children }) => {
            // CodeBlock handles its own wrapper, just pass through
            if (React.isValidElement(children) && (children as any).type === CodeBlock) {
              return children;
            }
            return (
              <pre className="bg-muted/50 dark:bg-muted/30 rounded-lg p-4 overflow-x-auto my-4 border border-border/30">
                {children}
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
