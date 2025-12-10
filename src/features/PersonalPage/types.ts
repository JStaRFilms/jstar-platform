export type PersonaMode = 'ENGINEER' | 'CREATOR';

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[]; // or tools used
  link?: string;
  image?: string; // placeholder or url
  stats?: { label: string; value: string }[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  role?: string; // e.g. "YouTuber, 350k subs"
  quote: string;
  avatar?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface PersonaData {
  mode: PersonaMode;
  hero: {
    headline: string;
    subheadline: string;
    bgStyle: string; // Tailwind class for gradient/bg
  };
  bio: {
    title: string;
    paragraphs: string[];
  };
  stats: {
    label: string;
    value: string;
    icon: string; // Lucide icon name or generic identifier
  }[];
  skills: SkillCategory[];
  projects: Project[];
  testimonials: Testimonial[];
  cta: {
    text: string;
    buttonLabel: string;
    link: string;
  };
}
