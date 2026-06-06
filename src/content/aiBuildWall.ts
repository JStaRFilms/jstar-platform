export interface AiAssistedBuildProject {
  name: string;
  url: string;
  description: string;
  stack: string[];
  bannerAttribution: string;
  logoAttribution?: string;
  proofLine: string;
  accent: string;
}

export const aiAssistedBuildProjects: AiAssistedBuildProject[] = [
  {
    name: 'J StaR Studios',
    url: 'https://jstarstudios.com',
    description: 'Flagship creative studio website for presenting John’s production, strategy, and technology work.',
    stack: ['Gemini 3.0 Pro', 'Claude Opus 4.5'],
    bannerAttribution: 'Banner by Gemini 3 Pro',
    proofLine: 'Shows how AI can accelerate a premium studio presence without flattening the brand voice.',
    accent: 'from-jstar-blue to-faith-purple',
  },
  {
    name: 'For Your Business',
    url: 'https://fyb.jstarstudios.com',
    description: 'Business-facing web experience built to translate creative capability into clearer client action.',
    stack: ['Gemini 3.0 Pro', 'Claude 4.5'],
    bannerAttribution: 'Pure SVG banner by Gemini 3.0 Pro',
    logoAttribution: 'Logo by Nano Banana',
    proofLine: 'Proves fast iteration can still produce custom SVG craft and polished conversion framing.',
    accent: 'from-growth-green to-jstar-blue',
  },
  {
    name: 'KageOS',
    url: 'https://kageos.jstarstudios.com',
    description: 'A high-concept product site for an OS-style creative and technical experience.',
    stack: ['Gemini 3.0 Pro', 'Kimi K2.5'],
    bannerAttribution: 'Banner by Claude Opus 4.6 SVG and Nano Banana Pro',
    proofLine: 'Shows multi-model art direction: one stack for structure, another for cinematic visual language.',
    accent: 'from-faith-purple to-red-500',
  },
  {
    name: 'KOE Voice',
    url: 'https://www.koevoice.xyz',
    description: 'Voice-oriented product website with a character-led identity and advanced AI-assisted build process.',
    stack: ['GPT 5.3 Codex', 'GPT 5.4', 'Gemini 3.1 Pro', 'Claude Opus 4.6', 'GPT 5.5'],
    bannerAttribution: 'Banner by GPT 5.5 High',
    logoAttribution: 'Logo uses a real character',
    proofLine: 'Demonstrates orchestration across frontier coding, copy, and visual-direction models.',
    accent: 'from-cyan-400 to-faith-purple',
  },
  {
    name: 'Melo School',
    url: 'https://meloschool.com',
    description: 'Education-focused website for music learning with a friendly product and enrollment feel.',
    stack: ['GPT 5.4', 'Gemini 3.1 Flash', 'GPT 5.5 Low'],
    bannerAttribution: 'Banner by GPT 5.5 High and GPT Image 2',
    proofLine: 'Shows a lighter AI stack can ship a warm, accessible education brand quickly.',
    accent: 'from-amber-400 to-growth-green',
  },
  {
    name: 'Olive Vine Dental',
    url: 'https://www.olivevinedental.com/',
    description: 'Dental practice website with clear service positioning and search-friendly content support.',
    stack: ['Gemini 3.5 Flash'],
    bannerAttribution: 'Banner not done yet',
    logoAttribution: 'SEO support by GPT 5.5',
    proofLine: 'Proves a constrained, practical model stack can still move a real client site forward.',
    accent: 'from-emerald-400 to-jstar-blue',
  },
];

export const aiBuildWallStats = [
  { label: 'Live projects', value: '6' },
  { label: 'AI stacks documented', value: '6' },
  { label: 'Fake metrics', value: '0' },
];
