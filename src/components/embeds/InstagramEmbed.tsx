'use client';

import { useEffect, useRef } from 'react';

interface InstagramEmbedProps {
    postUrl: string;
    className?: string;
}

export function InstagramEmbed({ postUrl, className }: InstagramEmbedProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Determine if we need to load the script
        if ((window as any).instgrm) {
            (window as any).instgrm.Embeds.process(containerRef.current);
        } else {
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            script.onload = () => {
                if ((window as any).instgrm) {
                    (window as any).instgrm.Embeds.process(containerRef.current);
                }
            };
            document.body.appendChild(script);
        }
    }, [postUrl]);

    return (
        <div ref={containerRef} className={`instagram-embed-container ${className || ''}`} style={{ maxWidth: '350px', margin: '0 auto' }}>
            <blockquote
                className="instagram-media"
                data-instgrm-permalink={postUrl}
                data-instgrm-version="14"
                style={{
                    background: '#FFF',
                    border: '0',
                    borderRadius: '3px',
                    boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                    margin: '1px',
                    maxWidth: '540px',
                    minWidth: '326px',
                    padding: '0',
                    width: 'calc(100% - 2px)'
                }}
            />
        </div>
    );
}
