import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

interface UseYouTubePlayerProps {
    videoId: string;
    elementId: string;
    autoPlay?: boolean;
    onReady?: () => void;
    onStateChange?: (event: any) => void;
}

/**
 * Custom hook to manage a YouTube IFrame Player API instance.
 * Handles loading the API script, initializing the player, and exposing control methods.
 *
 * @param props - Configuration options for the player.
 * @returns An object containing player state and control functions.
 */
export const useYouTubePlayer = ({
    videoId,
    elementId,
    autoPlay = true,
    onReady,
    onStateChange,
}: UseYouTubePlayerProps) => {
    const [player, setPlayer] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef<any>(null);

    // Refs for callbacks to ensure stable dependencies for the effect
    const onReadyRef = useRef(onReady);
    const onStateChangeRef = useRef(onStateChange);

    useEffect(() => {
        onReadyRef.current = onReady;
        onStateChangeRef.current = onStateChange;
    }, [onReady, onStateChange]);

    useEffect(() => {
        // Load YouTube IFrame API if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                initializePlayer();
            };
        } else {
            initializePlayer();
        }

        function initializePlayer() {
            if (playerRef.current) return; // Already initialized

            playerRef.current = new window.YT.Player(elementId, {
                videoId: videoId,
                width: '100%',
                height: '100%',
                playerVars: {
                    autoplay: autoPlay ? 1 : 0,
                    controls: 0, // Hide native controls
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3, // Hide annotations
                    fs: 0, // Disable fullscreen button (we'll handle sizing via CSS)
                    playsinline: 1,
                },
                events: {
                    onReady: (event: any) => {
                        setIsReady(true);
                        setIsMuted(event.target.isMuted());
                        if (autoPlay) {
                            event.target.playVideo();
                        }
                        if (onReadyRef.current) onReadyRef.current();
                    },
                    onStateChange: (event: any) => {
                        // YT.PlayerState.PLAYING = 1, PAUSED = 2
                        setIsPlaying(event.data === 1);
                        if (onStateChangeRef.current) onStateChangeRef.current(event);
                    },
                },
            });
            setPlayer(playerRef.current);
        }

        return () => {
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.error("Error destroying player", e);
                }
                playerRef.current = null;
            }
        };
    }, [videoId, elementId, autoPlay]);

    const play = useCallback(() => {
        player?.playVideo();
    }, [player]);

    const pause = useCallback(() => {
        player?.pauseVideo();
    }, [player]);

    const togglePlay = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    const mute = useCallback(() => {
        player?.mute();
        setIsMuted(true);
    }, [player]);

    const unmute = useCallback(() => {
        player?.unMute();
        setIsMuted(false);
    }, [player]);

    const toggleMute = useCallback(() => {
        if (isMuted) {
            unmute();
        } else {
            mute();
        }
    }, [isMuted, mute, unmute]);

    return {
        player,
        isReady,
        isMuted,
        isPlaying,
        play,
        pause,
        togglePlay,
        mute,
        unmute,
        toggleMute,
    };
};
