export interface ProjectCredit {
  name: string;
  role: string;
  linkedin?: string;
  website?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string; // For YouTube videos
  liveUrl?: string; // For live demos or GitHub repos
  source: 'manual' | 'youtube';
  order?: number; // For manual projects to control display order
  tags: string[];
  category: 'video' | 'web' | 'branding' | 'other';

  // For detailed case studies (can be enabled for YouTube videos too)
  hasDetailedCaseStudy?: boolean;
  challenge?: string;
  solution?: string;
  results?: string;
  credits?: ProjectCredit[];

  // YouTube customization options
  showViews?: boolean; // Default: true, can be overridden to false
  customTitle?: string; // Override YouTube title
  customDescription?: string; // Override YouTube description
  customThumbnailUrl?: string; // Override YouTube thumbnail

  // Metadata
  publishedAt: string; // ISO date string
  duration?: string; // For videos
  views?: number; // For YouTube videos
}

// YouTube video overrides - allows customizing specific videos from the playlist
export const youtubeOverrides: Record<string, Partial<PortfolioProject>> = {
  // Example: Override specific YouTube video by its video ID
  // 'VIDEO_ID_HERE': {
  //   customTitle: 'Custom Title',
  //   customDescription: 'Custom description that replaces YouTube description',
  //   showViews: false, // Hide view count
  //   hasDetailedCaseStudy: true,
  //   challenge: 'Custom challenge description',
  //   solution: 'Custom solution description',
  //   results: 'Custom results description',
  //   credits: [...],
  //   tags: ['Custom', 'Tags'],
  //   category: 'video'
  // }
};

// Manual portfolio projects
export const manualProjects: PortfolioProject[] = [
  {
    id: 'blink',
    title: 'Blink',
    description: 'A cutting-edge web application that revolutionizes user interaction through innovative design and seamless functionality.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
    liveUrl: 'https://github.com/JStaRFilms/Blink',
    source: 'manual',
    order: 1,
    tags: ['React', 'TypeScript', 'Web Development', 'UI/UX'],
    category: 'web',
    challenge: 'Create a modern web application that provides an exceptional user experience while maintaining high performance and accessibility standards.',
    solution: 'Developed a responsive React application using TypeScript, implementing advanced state management and optimized rendering techniques.',
    results: 'Achieved 95% user satisfaction rate with sub-2-second load times and full WCAG 2.1 AA compliance.',
    credits: [
      {
        name: 'John Oke',
        role: 'Lead Developer',
        linkedin: 'https://linkedin.com/in/saxy',
        website: 'https://jstarstudios.com'
      }
    ],
    publishedAt: '2024-01-15T00:00:00Z'
  }
];
