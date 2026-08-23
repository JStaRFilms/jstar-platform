export const V3_COLORS = {
  chartreuse: '#B5E619',
  toffeeBrown: '#8E592F',
  inkBlack: '#001514',
  white: '#FBFFFE',
  powderBlue: '#AFC2D5',
} as const;

export type LensType = 'film' | 'code' | 'ai' | 'polymath';

export interface LensConfig {
  id: LensType;
  label: string;
  badge: string;
  tagline: string;
  description: string;
  accentColor: string;
  shaderColor: [number, number, number]; // Normalized RGB for WebGL
  shaderSpeed: number;
  highlightMetric: string;
  highlightLabel: string;
}

export const LENSES: Record<LensType, LensConfig> = {
  film: {
    id: 'film',
    label: 'Film Studio',
    badge: '01 / CINEMATIC MEDIA',
    tagline: 'High-Retention Visual Storytelling & Commercial Production',
    description: 'Directing, shooting, and editing cinematic films that captivate audiences, evoke emotion, and build unforgettable brand legacy.',
    accentColor: '#8E592F',
    shaderColor: [0.55, 0.35, 0.18], // Toffee Brown
    shaderSpeed: 0.0008,
    highlightMetric: '280+ Videos',
    highlightLabel: 'Edited & Directed with High Retention',
  },
  code: {
    id: 'code',
    label: 'Software Lab',
    badge: '02 / DIGITAL ARCHITECTURE',
    tagline: 'High-Performance Web Platforms & Interactive Experiences',
    description: 'Engineering resilient, ultra-fast web applications, creative tools, and WebGL digital products with obsessive attention to craft.',
    accentColor: '#AFC2D5',
    shaderColor: [0.68, 0.76, 0.83], // Powder Blue
    shaderSpeed: 0.0012,
    highlightMetric: 'Sub-50ms',
    highlightLabel: 'Realtime Latency & Edge-Ready Architecture',
  },
  ai: {
    id: 'ai',
    label: 'AI Systems',
    badge: '03 / CREATIVE INTELLIGENCE',
    tagline: 'Intelligent Workflows, Local LLMs & Workflow Automation',
    description: 'Building custom RAG architectures, dynamic learning platforms, and automation tools that supercharge human creative output.',
    accentColor: '#B5E619',
    shaderColor: [0.71, 0.9, 0.1], // Chartreuse
    shaderSpeed: 0.0016,
    highlightMetric: '10x Faster',
    highlightLabel: 'Creative Pipeline Throughput with AI',
  },
  polymath: {
    id: 'polymath',
    label: 'Polymath Mind',
    badge: '04 / THE INTERSECTION',
    tagline: 'Where Filmmaking Meets Computer Science & Problem Solving',
    description: 'Combining director psychology, software craftsmanship, national championship speedcubing logic, and musical harmony.',
    accentColor: '#B5E619',
    shaderColor: [0.71, 0.9, 0.1], // Chartreuse
    shaderSpeed: 0.0014,
    highlightMetric: '176K+ Views',
    highlightLabel: 'Organically Reached Across Ecosystems',
  },
};

export const CANONICAL_METRICS = [
  { value: '176K+', label: 'Organic Views Generated', detail: 'Across YouTube, client campaigns & documentaries' },
  { value: '280+', label: 'Videos Directed & Edited', detail: 'High-retention commercial & long-form narratives' },
  { value: '8+', label: 'Verified Flagship Deployments', detail: 'Production web apps & commercial contracts' },
  { value: '6+', label: 'Years of Creative Engineering', detail: 'Bridging cinema, software & applied AI' },
];

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Film' | 'Software' | 'AI Systems' | 'Interactive';
  lens: LensType;
  subtitle: string;
  description: string;
  problem: string;
  solution: string;
  outcome: string;
  tags: string[];
  metrics: string;
  visualHighlight: string;
  featured: boolean;
  accent: string;
}

export const SHOWCASE_PROJECTS: ProjectItem[] = [
  {
    id: 'blink',
    title: 'Blink AI',
    category: 'AI Systems',
    lens: 'ai',
    subtitle: 'Autonomous Desktop Creative Companion',
    description: 'An ultra-lightweight desktop automation utility that accelerates high-frequency creative and developer tasks using contextual intelligence.',
    problem: 'Creators lose hours every week manually switching between context windows, copying asset metadata, and managing files.',
    solution: 'Engineered an instant overlay companion running optimized small-model inference for rapid multimodal execution.',
    outcome: 'Eliminated 70% of repetitive micro-friction in high-velocity editing workflows.',
    tags: ['Desktop Application', 'Applied AI', 'Workflow Automation', 'TypeScript'],
    metrics: '70% Faster Workflow Loop',
    visualHighlight: 'Neural command palette with dynamic latency tracking',
    featured: true,
    accent: '#B5E619',
  },
  {
    id: 'adaptive-study-game',
    title: 'Adaptive AI Study Game',
    category: 'Software',
    lens: 'code',
    subtitle: 'Gamified Neural Learning Engine',
    description: 'An interactive learning platform that dynamically adjusts quiz complexity and visual mechanics based on real-time learner cognitive retention.',
    problem: 'Traditional flashcards and static study modules fail to engage active recall or adapt to individual knowledge decay.',
    solution: 'Designed an adaptive spaced-repetition game engine powered by dynamic evaluation and real-time interactive game mechanics.',
    outcome: 'Achieved 4x higher retention rate and sustained daily engagement across pilot test groups.',
    tags: ['Next.js', 'Dynamic Evaluation', 'Gamification', 'Tailwind CSS'],
    metrics: '4x Higher Knowledge Retention',
    visualHighlight: 'Interactive game board with live difficulty modulation',
    featured: true,
    accent: '#AFC2D5',
  },
  {
    id: 'obsidian-tag-automator',
    title: 'Obsidian Tag Automator',
    category: 'AI Systems',
    lens: 'ai',
    subtitle: 'Semantic Knowledge Graph Categorizer',
    description: 'An intelligent plugin for personal knowledge graphs that analyzes semantic structure and automatically organizes bi-directional note links.',
    problem: 'Second-brain knowledge graphs quickly become disorganized as note volumes surpass hundreds of entries without strict taxonomy.',
    solution: 'Created an embedding-powered background indexer that semantically maps relationships without manual tagging.',
    outcome: 'Organized thousands of interlinked concepts seamlessly with zero cognitive overhead.',
    tags: ['Knowledge Management', 'Embeddings', 'Graph Systems', 'Python / TS'],
    metrics: '100% Automated Semantic Linking',
    visualHighlight: 'Dynamic 3D node graph cluster mapping',
    featured: true,
    accent: '#B5E619',
  },
  {
    id: 'samsung-galaxy',
    title: 'Samsung Galaxy Visuals',
    category: 'Film',
    lens: 'film',
    subtitle: 'High-Fidelity Mobile Cinematography',
    description: 'A cinematic commercial showcase testing the dynamic range, color grading latitude, and motion texture of mobile cinema rigs in low-light environments.',
    problem: 'Proving that mobile sensor limitations can be completely transcended with world-class lighting, color science, and editing rhythm.',
    solution: 'Shot, directed, and mastered a high-octane visual showcase with custom LUTs and frame-accurate pacing.',
    outcome: 'Demonstrated broadcast-tier visual fidelity, garnering viral attention and client commissions.',
    tags: ['Cinematography', 'Color Grading', 'Sound Design', 'Commercial Direction'],
    metrics: 'Broadcast-Tier 4K Color Grade',
    visualHighlight: 'High dynamic range low-light cinematic grading',
    featured: true,
    accent: '#8E592F',
  },
  {
    id: 'elizade-university',
    title: 'Elizade University Documentary',
    category: 'Film',
    lens: 'film',
    subtitle: 'Institutional Storytelling & Campus Narrative',
    description: 'A cinematic documentary narrative capturing academic excellence, campus culture, and architectural majesty across multiple production days.',
    problem: 'Standard academic promotional videos feel sterile, corporate, and fail to evoke genuine emotional resonance.',
    solution: 'Structured a human-first documentary arc highlighting individual student journeys alongside drone cinematography and symphonic scoring.',
    outcome: 'Delivered the flagship visual centerpiece for the institution with widespread stakeholder praise.',
    tags: ['Documentary', 'Aerial Cinematography', 'Audio Mastering', 'Story Arc'],
    metrics: 'Flagship Institutional Showcase',
    visualHighlight: 'Golden hour anamorphic drone sweeps and human interviews',
    featured: true,
    accent: '#8E592F',
  },
];

export const CAPABILITIES = [
  {
    id: 'film',
    number: '01',
    title: 'J StaR Films',
    headline: 'Cinematic Media & Visual Storytelling',
    description: 'We direct, shoot, edit, and master visual media designed to command attention and never feel generic.',
    items: [
      'Commercial Direction & Brand Films',
      'High-Retention YouTube & Social Content',
      'Documentary & Narrative Storytelling',
      'Custom LUT Development & 4K Color Grading',
      'Spatial Sound Design & Audio Mastering',
    ],
    accent: '#8E592F',
  },
  {
    id: 'labs',
    number: '02',
    title: 'J StaR Labs',
    headline: 'Digital Products & Modern Web Platforms',
    description: 'We architect and build full-stack web platforms, interactive 3D digital experiences, and bespoke software.',
    items: [
      'Next.js 15 & React Full-Stack Platforms',
      'WebGL, GLSL Shaders & Interactive 3D',
      'Design Systems & High-Fidelity UI/UX',
      'Custom Creative Tool Development',
      'Sub-50ms API & Edge Architectures',
    ],
    accent: '#AFC2D5',
  },
  {
    id: 'ai',
    number: '03',
    title: 'J StaR AI',
    headline: 'Applied Intelligence & Workflow Systems',
    description: 'We develop intelligent tools and automated pipelines that give creators and organizations supercharged leverage.',
    items: [
      'Custom Multi-Model AI Systems & RAG',
      'Creator Workflow Automation Engines',
      'Semantic Knowledge Graphs & Indexers',
      'Context-Aware AI Assistants & Personas',
      'Dynamic Gamified Evaluation Systems',
    ],
    accent: '#B5E619',
  },
];
