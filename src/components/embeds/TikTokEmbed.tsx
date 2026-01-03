'use client';

interface TikTokEmbedProps {
    videoId: string;
    className?: string;
}

export function TikTokEmbed({ videoId, className }: TikTokEmbedProps) {
    return (
        <div className={`tiktok-embed-container ${className || ''}`} style={{ maxWidth: '325px', margin: '0 auto' }}>
            <iframe
                src={`https://www.tiktok.com/embed/v2/${videoId}`}
                className="w-full h-[575px]"
                allowFullScreen
                allow="encrypted-media"
                style={{ border: 'none', borderRadius: '12px', background: '#000' }}
                title={`TikTok video ${videoId}`}
            />
        </div>
    );
}
