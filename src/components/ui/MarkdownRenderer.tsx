import { useEffect, useRef } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import Remarkable to work around type issues
    import('remarkable').then((RemarkableModule) => {
      console.log('Remarkable module:', RemarkableModule); // Debug log
      // @ts-ignore
      const md = new (RemarkableModule.default || RemarkableModule.Remarkable || RemarkableModule)();
      const html = md.render(content);

      if (containerRef.current) {
        containerRef.current.innerHTML = html;

        // Add Tailwind classes to generated elements
        const elements = containerRef.current.querySelectorAll('*');
        elements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.classList.add('text-foreground', 'leading-relaxed');
            if (el.tagName === 'PRE') {
              el.classList.add('bg-neutral-900/50', 'dark:bg-black/50', 'rounded-xl', 'p-4', 'overflow-auto', 'border', 'border-border');
            }
            if (el.tagName === 'CODE') {
              el.classList.add('bg-neutral-800', 'dark:bg-neutral-900', 'rounded-md', 'px-2', 'py-1', 'text-foreground');
            }
            if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
              el.classList.add('font-bold', 'mt-6', 'mb-3', 'text-foreground');
            }
            if (el.tagName === 'H4' || el.tagName === 'H5' || el.tagName === 'H6') {
              el.classList.add('font-semibold', 'mt-4', 'mb-2', 'text-foreground');
            }
            if (el.tagName === 'UL' || el.tagName === 'OL') {
              el.classList.add('ml-4', 'mb-4');
            }
            if (el.tagName === 'LI') {
              el.classList.add('mb-1');
            }
            if (el.tagName === 'P') {
              el.classList.add('mb-3', 'text-foreground');
            }
            if (el.tagName === 'BLOCKQUOTE') {
              el.classList.add('border-l-4', 'border-primary', 'pl-4', 'italic', 'text-muted-foreground', 'mb-4');
            }
            if (el.tagName === 'A') {
              el.classList.add('text-primary', 'hover:text-primary/80', 'underline');
            }
          }
        });
      }
    }).catch(err => {
      console.error('Failed to load Remarkable:', err);
      // Fallback to plain text
      if (containerRef.current) {
        containerRef.current.innerHTML = `<p class="text-foreground">${content.replace(/\n/g, '<br>')}</p>`;
      }
    });
  }, [content]);

  return <div ref={containerRef} />;
}
