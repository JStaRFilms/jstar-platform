import { PersonaData } from '../types';

export const engineerData: PersonaData = {
  mode: 'ENGINEER',
  hero: {
    headline: 'Product-Minded Software Engineer',
    subheadline: 'Architecting intelligent, full-stack AI applications with a focus on user experience.',
    bgStyle: 'from-blue-900/20 to-slate-900',
  },
  bio: {
    title: 'Building the Future with Code',
    paragraphs: [
      'I am a Software Engineer with a passion for building intuitive, intelligent user experiences. Specializing in React, Next.js, and Python, I have a deep understanding of system design using modern AI tools like Google Gemini and ONNX.',
      'Currently finishing my B.Sc. in Computer Science at Elizade University (Aug 2025), I combine academic rigor with practical shipping experience. I don\'t just write code; I build products that solve real problems.'
    ],
  },
  stats: [
    { label: 'Projects Shipped', value: '10+', icon: 'Ship' },
    { label: 'Stack Depth', value: 'Full-Stack', icon: 'Layers' },
    { label: 'Degree', value: 'B.Sc. CS', icon: 'GraduationCap' },
  ],
  skills: [
    {
      category: 'Frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    },
    {
      category: 'Backend',
      skills: ['Node.js', 'Python', 'PostgreSQL', 'Prisma', 'Supabase'],
    },
    {
      category: 'AI / ML',
      skills: ['Google Gemini API', 'ONNX Runtime', 'Scikit-learn', 'RAG Pipelines'],
    },
  ],
  projects: [
    {
      id: 'adaptive-study',
      title: 'Adaptive Study Game',
      description: 'A multimodal AI study app that transforms notes and videos into interactive quizzes. Uses Parallel Pipelines for low latency.',
      techStack: ['React', 'Gemini API', 'IndexedDB'],
      link: 'https://github.com/JStaRFilms/',
      stats: [{ label: 'Performance', value: 'Real-time' }],
    },
    {
      id: 'storyboard-studio',
      title: 'AI Storyboard Studio',
      description: 'Generates visual storyboards from scripts using a hybrid Next.js + Python/Flask architecture.',
      techStack: ['Next.js', 'Python', 'Flask', 'Supabase'],
      link: 'https://github.com/JStaRFilms/',
    },
    {
      id: 'mindguard',
      title: 'MindGuard-AI',
      description: 'Privacy-first desktop app for mental wellness tracking with local ONNX inference.',
      techStack: ['Electron', 'React', 'ONNX', 'SQLite'],
      link: 'https://github.com/JStaRFilms/',
    },
  ],
  testimonials: [
    {
      id: 'tedx',
      clientName: 'TEDxElizadeUniversity',
      role: 'Organizer',
      quote: 'Selected to deliver a talk on "What if reality is editable?", demonstrating exceptional communication and public speaking skills.',
    },
    // Adding generic ones as placeholders if no specific engineering clients are listed in docs
  ],
  cta: {
    text: 'Ready to build something incredible?',
    buttonLabel: 'View GitHub',
    link: 'https://github.com/JStaRFilms/',
  },
};

export const creatorData: PersonaData = {
  mode: 'CREATOR',
  hero: {
    headline: 'Creative Soul & Video Producer',
    subheadline: 'Telling stories that matter through cinematic visuals and engaging narratives.',
    bgStyle: 'from-amber-900/20 to-stone-900',
  },
  bio: {
    title: 'Visual Storytelling Redefined',
    paragraphs: [
      'I am a creative Video Producer and Content Creator with over 5 years of experience. I specialize in DaVinci Resolve, cinematic color grading, and educational content for filmmakers.',
      'Through my channel "J StaR Films" and collaborations with various clients, I help bring visions to life, managing the entire production lifecycle from storyboarding to final delivery.'
    ],
  },
  stats: [
    { label: 'Total Views', value: '176K+', icon: 'Eye' },
    { label: 'Videos Created', value: '280+', icon: 'Video' },
    { label: 'Experience', value: '5+ Years', icon: 'Clock' },
  ],
  skills: [
    {
      category: 'Post-Production',
      skills: ['DaVinci Resolve', 'Premiere Pro', 'After Effects', 'Color Grading'],
    },
    {
      category: 'Production',
      skills: ['Cinematography', 'Lighting', 'Sound Design', 'Storyboarding'],
    },
    {
      category: 'Strategy',
      skills: ['YouTube Growth', 'Content Strategy', 'Brand Identity'],
    },
  ],
  projects: [
    {
      id: 'teal-orange',
      title: 'Cinematic Teal & Orange',
      description: 'Educational tutorial simplifying complex color grading techniques.',
      techStack: ['DaVinci Resolve', 'Color Grading'],
      link: 'https://youtube.com/@jstarfilms',
      stats: [{ label: 'Views', value: '2.3K+' }],
    },
    {
      id: 's10-hit',
      title: 'Shot on NOT iPhone',
      description: 'Showcasing mobile filmmaking potential with advanced editing tricks.',
      techStack: ['Mobile Cinematography', 'Editing'],
      link: 'https://youtube.com/@jstarfilms',
    },
    {
      id: 'church-media',
      title: 'Winning Worship Way',
      description: 'Managed live streams and weekly service edits for over 4 years.',
      techStack: ['Live Production', 'Social Media'],
      link: '#',
    },
  ],
  testimonials: [
    {
      id: 'pearl-sharon',
      clientName: "Sharon's Chronicles",
      role: 'Content Creator',
      quote: "I love how he brings my vision to life in the best way possible. He's collaborative, attentive and open to correction. Love the end results always.",
    },
    {
      id: 'wwwcc',
      clientName: 'Winning Worship Way',
      role: 'Client',
      quote: "Huge thanks to Goodness for helping elevate our church’s YouTube channel! Their editing skills are fantastic... we've started seeing some improvements in engagement.",
    },
    {
      id: '13-cubes',
      clientName: '13 Cubes',
      role: 'Client',
      quote: "Goodness is a fantastic editor! He took my raw footage and transformed it into a truly engaging video... Their creativity and attention to detail really shined through.",
    },
  ],
  cta: {
    text: 'Need a creative director for your next project?',
    buttonLabel: 'Visit YouTube',
    link: 'https://youtube.com/@jstarfilms',
  },
};

import { usePersonaMode } from '../context/PersonaContext';

export const usePersonaData = (): PersonaData => {
  const { mode } = usePersonaMode();
  return mode === 'ENGINEER' ? engineerData : creatorData;
};
