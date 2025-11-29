import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PortfolioProject } from '../../../content/portfolio';
import { PlayCircleIcon, ArrowRightIcon } from '../../../components/icons/static-icons';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';

interface PortfolioCardProps {
  project: PortfolioProject;
  onClick: (startTime?: number) => void;
  getTagColor: (tag: string, index: number) => string;
  forceHover?: boolean;
  isModalOpen?: boolean;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, onClick, getTagColor, forceHover = false, isModalOpen = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [lastPosition, setLastPosition] = useState(0);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const positionInterval = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  // Determine if we should play the video
  const shouldPlay = (isHovered || forceHover) && project.category === 'video' && !!project.videoId && !isModalOpen;

  // Delay video mounting to avoid flickering on quick hovers
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (shouldPlay) {
      timeout = setTimeout(() => setShowVideo(true), 300);
    } else {
      setShowVideo(false);
      hasInitialized.current = false; // Reset when video unmounts
    }
    return () => clearTimeout(timeout);
  }, [shouldPlay]);

  const { isReady, getCurrentTime, pause, seekTo, mute } = useYouTubePlayer({
    videoId: showVideo ? project.videoId || '' : '',
    elementId: `portfolio-card-player-${project.id}`,
    autoPlay: true,
    // Don't pass startTime here - it causes player to reinitialize every second!
  });

  // Mute the preview video ONLY on initial mount
  useEffect(() => {
    if (isReady && showVideo && !hasInitialized.current) {
      hasInitialized.current = true;
      // Small delay to ensure all player methods are available
      const timer = setTimeout(() => {
        mute();
        // Only seek if we have a saved position > 0
        if (lastPosition > 0) {
          seekTo(lastPosition);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isReady, showVideo, mute, seekTo]); // Removed lastPosition from dependencies

  // Track playback position every second
  useEffect(() => {
    if (showVideo && isReady) {
      positionInterval.current = setInterval(() => {
        const currentPos = getCurrentTime();
        setLastPosition(currentPos);
      }, 1000);
    } else {
      if (positionInterval.current) {
        clearInterval(positionInterval.current);
        positionInterval.current = null;
      }
    }

    return () => {
      if (positionInterval.current) {
        clearInterval(positionInterval.current);
      }
    };
  }, [showVideo, isReady, getCurrentTime]);

  // Stop video when modal opens
  useEffect(() => {
    if (isModalOpen && showVideo && isReady) {
      const currentPos = getCurrentTime();
      setLastPosition(currentPos);
      pause();
    }
  }, [isModalOpen, showVideo, isReady, pause, getCurrentTime]);

  const handleCardClick = () => {
    const currentTime = showVideo && isReady ? getCurrentTime() : lastPosition;
    onClick(currentTime);
  };

  return (
    <div
      className="portfolio-item group relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`aspect-[4/3] overflow-hidden cursor-pointer relative ${project.category === 'video'
          ? 'bg-gradient-to-br from-primary to-accent'
          : project.category === 'web'
            ? 'bg-gradient-to-br from-blue-500 to-cyan-400'
            : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}
        onClick={handleCardClick}
      >
        {/* Video Player Container */}
        {showVideo && (
          <div className="absolute inset-0 z-10 bg-black overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[177.77%] h-full"
            >
              <div id={`portfolio-card-player-${project.id}`} className="w-full h-full" />
            </div>
            {/* Interaction overlay to capture clicks since iframe might block them */}
            <div className="absolute inset-0 z-20 bg-transparent" onClick={handleCardClick} />
          </div>
        )}

        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          fill
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${forceHover ? 'scale-110' : ''
            } ${showVideo && isReady ? 'opacity-0' : 'opacity-100'}`}
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 flex flex-col justify-end p-6 ${forceHover || isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            } z-30 pointer-events-none`}
        >
          <div className={`transition-transform duration-300 ${forceHover || isHovered ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'
            }`}>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((tag, index) => (
                <span key={tag} className={`px-3 py-1 text-xs font-medium rounded-full ${getTagColor(tag, index)}`}>
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-gray-200 text-sm line-clamp-2">{project.description}</p>
          </div>
        </div>
        {project.category === 'video' && !showVideo && (
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${forceHover || isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            } z-30`}>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <PlayCircleIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioCard;
