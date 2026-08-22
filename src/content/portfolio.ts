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
  videoUrl?: string; // Full URL for external links
  videoId?: string; // Clean video ID for embeds (YouTube only)
  liveUrl?: string; // For live demos or GitHub repos
  source: 'manual' | 'youtube' | 'instagram' | 'tiktok';
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
  // --- Project 1: Blink ---
  {
    id: 'blink-ai-sidekick',
    title: 'Blink: Your Instant AI Sidekick',
    description: 'A system-wide Windows utility that brings AI to your workflow with a simple hotkey. Select text, get AI magic, instantly, anywhere.',
    thumbnailUrl: '/portfolio/thumbnails/blink-logo.png',
    liveUrl: 'https://github.com/JStaRFilms/Blink',
    source: 'manual',
    order: 1,
    tags: ['Python', 'AI Utility', 'Desktop App', 'Open Source'],
    category: 'web',
    hasDetailedCaseStudy: true,
    challenge: 'Developers and writers constantly break their workflow by switching to a browser to use AI. The challenge was to create a seamless, system-wide utility that brings the AI to the user, instantly.',
    solution: 'Built a lightweight Windows utility in Python from scratch in under 24 hours. It lives in the system tray and uses a global hotkey to capture selected text, process it via an LLM, and stream the response back into any application.',
    results: 'Shipped a public open-source project on GitHub with a full installer, featuring dual output modes, conversational memory, and adaptive multimodal support for vision models.',
    credits: [
      { name: 'John Oluleke-Oke', role: 'Lead Architect & Developer' }
    ],
    publishedAt: '2024-05-15T00:00:00Z'
  },

  // --- Project 2: Adaptive Study Game ---
  {
    id: 'adaptive-study-game',
    title: 'Adaptive AI Study Game',
    description: 'An intelligent study tool using Google Gemini to transform notes, documents, and videos into interactive, gamified learning quests.',
    thumbnailUrl: '/portfolio/thumbnails/adaptive-study-game.png',
    liveUrl: 'https://github.com/JStaRFilms/Adaptive-Study-Game',
    source: 'manual',
    order: 3,
    tags: ['React', 'TypeScript', 'Google Gemini', 'Local-First'],
    category: 'web',
    hasDetailedCaseStudy: true,
    challenge: 'Traditional studying from static notes is often passive and ineffective. The challenge was to create an active, engaging, and personalized learning experience powered by AI.',
    solution: "Developed a web application that transforms diverse user inputs (PDFs, docs, YouTube URLs) into a suite of study tools, including an interactive 'Visual Reading Canvas' and AI-generated quizzes. The architecture uses 'Parallel Pipelines' to reduce latency.",
    results: 'Shipped a feature-rich, local-first application that runs entirely in the browser, ensuring user privacy and offline access. Key features include a personal AI tutor, spaced repetition mode, and AI exam prediction.',
    credits: [
      { name: 'John Oluleke-Oke', role: 'Lead Architect & Full-Stack Developer' }
    ],
    publishedAt: '2024-04-20T00:00:00Z'
  },

  // --- Project 3: Obsidian Tag Automator ---
  {
    id: 'obsidian-tag-automator',
    title: 'Obsidian Tag Automator',
    description: 'An AI-powered tag management system for Obsidian vaults that automates tagging, suggests aliases, and maintains knowledge base consistency.',
    thumbnailUrl: '/portfolio/thumbnails/obsidian-tag-automator.png',
    liveUrl: 'https://github.com/JStaRFilms/Obsidian-Tag-Automator',
    source: 'manual',
    order: 6,
    tags: ['Python', 'Obsidian', 'AI', 'CLI', 'Flask'],
    category: 'web',
    hasDetailedCaseStudy: true,
    challenge: 'Maintaining a consistent and organized tag system in a large Obsidian vault is a manual and error-prone process. The goal was to automate this using AI.',
    solution: 'Architected a dual-interface Python application with a rich command-line interface (CLI) and a modern web UI built with Flask. The core engine uses the Gemini API to analyze notes and intelligently suggest, rename, and merge tags.',
    results: 'Delivered a complete, installable tool for the Obsidian community with features for batch processing, tag validation, and smart alias generation, significantly improving knowledge management workflows.',
    credits: [
      { name: 'John Oluleke-Oke', role: 'Lead Developer' }
    ],
    publishedAt: '2024-03-10T00:00:00Z'
  },

  // --- Project 4: MindGuard AI ---
  {
    id: 'mindguard-ai',
    title: 'MindGuard AI: Offline Mental Wellness',
    description: 'Privacy-first desktop app for mental wellness tracking featuring local ONNX neural inference for completely offline sentiment analysis.',
    thumbnailUrl: '/portfolio/thumbnails/blink-logo.png',
    liveUrl: 'https://github.com/JStaRFilms/MindGuard-AI',
    source: 'manual',
    order: 4,
    tags: ['Electron', 'React', 'Python', 'ONNX', 'Local AI'],
    category: 'web',
    hasDetailedCaseStudy: true,
    challenge: 'Users are hesitant to journal sensitive emotional thoughts into cloud-based AI systems that monetize their data.',
    solution: 'Designed an offline-first desktop application with an embedded ONNX runtime to run sentiment analysis locally with zero network telemetry.',
    results: 'Shipped a privacy-preserving desktop application that runs 100% offline with zero cloud latency.',
    credits: [
      { name: 'John Oluleke-Oke', role: 'Lead Architect' }
    ],
    publishedAt: '2024-02-15T00:00:00Z'
  },

  // --- Project 5: Winning Worship Way ---
  {
    id: 'winning-worship-way-broadcast',
    title: 'Winning Worship Way: Multi-Camera Broadcast & Media',
    description: 'Directing live multi-camera broadcast production and weekly post-production workflows that elevated audience engagement.',
    thumbnailUrl: '/me/mobile-cam.jpg',
    videoUrl: 'https://youtube.com/@winningworshipway',
    source: 'manual',
    order: 5,
    tags: ['Broadcast', 'Live Streaming', 'DaVinci Resolve', 'Cinematography'],
    category: 'video',
    hasDetailedCaseStudy: true,
    challenge: 'Transforming a weekly live worship broadcast into a cinematic, high-retention video production that reaches an international audience.',
    solution: 'Implemented a streamlined multi-camera switching pipeline, real-time audio mastering, and DaVinci Resolve color grading presets.',
    results: 'Consistent weekly broadcast delivery with measurable growth in online viewer engagement and community retention.',
    credits: [
      { name: 'John Oluleke-Oke', role: 'Media Director & Broadcast Lead' }
    ],
    publishedAt: '2023-11-20T00:00:00Z'
  }
];

