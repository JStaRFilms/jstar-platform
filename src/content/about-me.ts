export interface Skill {
  name: string;
  level: string;
  percentage: number;
}

export interface CoreIdentity {
  title: string;
  description: string;
}

export interface FounderSkill {
  name: string;
  type: string;
  level: string;
}

export interface TimelineItem {
  year: string;
  description: string;
}

export interface PhilosophyCard {
  title: string;
  description: string;
  iconSvg: string;
}

export interface FounderData {
  coreIdentities: CoreIdentity[];
  skills: FounderSkill[];
  name: string;
  title: string;
  bio: string;
  tags: string[];
  contact: {
    phone: string;
    email: string;
    location: string;
  };
  technicalSkills: Skill[];
  creativeSkills: string[];
  timeline: TimelineItem[];
  story: string[];
  philosophy: PhilosophyCard[];
}

export const founderData: FounderData = {
  coreIdentities: [
    {
      title: 'AI & Software Architect',
      description: "Architecting and shipping intuitive, intelligent applications. Proven experience with projects like the 'Adaptive Study Game' and Blink, a system-wide AI utility for Windows built from scratch in under 24 hours. Demonstrates full-stack expertise from Python-based desktop tools to Next.js web applications, all with a focus on local-first architecture and seamless user experience."
    }
  ],

  skills: [
    { name: 'Desktop App Development', type: 'Technical', level: 'Advanced' },
    { name: 'AI Utility Architecture', type: 'Technical', level: 'Advanced' }
  ],

  name: 'John Oluleke-Oke',
  title: 'Filmmaker & Developer',
  bio: 'Filmmaker, app developer, and AI creator building faith-inspired content and tools that empower creators worldwide.',
  tags: ['Filmmaker', 'Developer', 'AI Creator', 'Faith-Driven'],

  contact: {
    phone: '+234 801 234 5678',
    email: 'john@jstarfilms.com',
    location: 'Lagos, Nigeria'
  },

  technicalSkills: [
    { name: 'Video Production', level: 'Expert', percentage: 95 },
    { name: 'App Development', level: 'Advanced', percentage: 85 },
    { name: 'AI Integration', level: 'Intermediate', percentage: 75 }
  ],

  creativeSkills: [
    'Cinematography',
    'Storytelling',
    'UX Design',
    'Brand Strategy',
    'Content Creation',
    'Drone Operation'
  ],

  timeline: [
    { year: '2020', description: 'Founded J StaR Films' },
    { year: '2021', description: 'First 50 wedding films completed' },
    { year: '2022', description: 'Began app development journey' },
    { year: '2023', description: 'Launched first AI-powered tools' },
    { year: '2024', description: 'Developing JohnGPT Creator Assistant' }
  ],

  story: [
    "I'm John Oluleke-Oke, a creative technologist based in Nigeria, passionate about merging faith, technology, and storytelling. With over 5 years of experience in video production and app development, I've had the privilege of working with individuals and organizations to bring their visions to life through cinematic storytelling and cutting-edge digital solutions.",
    "My journey began in Lagos, where I discovered my passion for visual storytelling through wedding videography. What started as a side hustle quickly evolved into a full-fledged production company, J StaR Films, where we've captured over 50 love stories and created cinematic experiences that families treasure for generations.",
    "As technology evolved, so did my interests. I dove deep into app development, creating custom solutions for businesses and individuals. My work spans from mobile applications to complex web platforms, always with a focus on user experience and performance.",
    "Today, I'm exploring the intersection of artificial intelligence and creativity, building tools that help content creators like myself work smarter, not harder. My latest project, JohnGPT, is an AI assistant designed specifically for creators who want to grow their impact while staying true to their values."
  ],

  philosophy: [
    {
      title: 'Faith-Driven Creation',
      description: 'Every project I work on is infused with purpose and values. I believe that great work comes from a place of authenticity and conviction.',
      iconSvg: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    },
    {
      title: 'Innovation with Purpose',
      description: 'Technology should serve humanity, not the other way around. I strive to create tools that empower people to do meaningful work.',
      iconSvg: 'M13 10V3L4 14h7v7l9-11h-7z'
    }
  ]
};
