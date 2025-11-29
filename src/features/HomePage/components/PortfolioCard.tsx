import React from 'react';
import Image from 'next/image';
import { PortfolioProject } from '../../../content/portfolio';
import { PlayCircleIcon, ArrowRightIcon } from '../../../components/icons/static-icons';

interface PortfolioCardProps {
  project: PortfolioProject;
  onClick: () => void;
  getTagColor: (tag: string, index: number) => string;
  forceHover?: boolean;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, onClick, getTagColor, forceHover = false }) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'video': return 'Video Production';
      case 'web': return 'Web Development';
      case 'branding': return 'Branding';
      default: return category;
    }
  };

  return (
    <div className="portfolio-item group relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div
        className={`aspect-video overflow-hidden cursor-pointer ${project.category === 'video'
            ? 'bg-gradient-to-br from-primary to-accent'
            : project.category === 'web'
              ? 'bg-gradient-to-br from-blue-500 to-cyan-400'
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}
        onClick={onClick}
      >
        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          fill
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${forceHover ? 'scale-110' : ''
            }`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 flex flex-col justify-end p-6 ${forceHover ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
        >
          <div className={`transition-transform duration-300 ${forceHover ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'
            }`}>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((tag, index) => (
                <span key={tag} className={`px-3 py-1 text-xs font-medium rounded-full ${getTagColor(tag, index)}`}>
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-gray-200 text-sm">{project.description}</p>
          </div>
        </div>
        {project.category === 'video' && (
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${forceHover ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <PlayCircleIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>
      <div className="p-6 bg-white dark:bg-gray-800 flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{project.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{getCategoryLabel(project.category)}</p>
          </div>
          <button
            onClick={onClick}
            className="text-primary dark:text-accent hover:opacity-80 transition-opacity ml-4 flex-shrink-0"
            aria-label={`View ${project.title} details`}
          >
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
