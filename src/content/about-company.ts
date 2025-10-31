export interface TeamMember {
  employeeId: string;
  name: string;
  role: string;
  imageUrl: string;
}

export interface Client {
  name: string;
  logo?: string;
  alt: string;
}

export interface CompanyData {
  mission: string;
  teamMembers: TeamMember[];
  clients: Client[];
}

export const companyData: CompanyData = {
  mission: "J StaR Films Studios is an integrated creative and technology partner, specializing in crafting holistic brand experiences. Our multidisciplinary team—spanning strategy, filmmaking, software development, and design—collaborates to build not just content, but ecosystems. From cinematic narratives to intelligent AI tools, we bring visionary ideas to life.",

  teamMembers: [
    { employeeId: 'JS001', name: 'John Oluleke-Oke', role: 'CEO / Chief Creative Director', imageUrl: '/team/john-oluleke-oke.jpg' },
    { employeeId: 'JS002', name: 'Monjola Aminu', role: 'Director of Brand & Communications', imageUrl: '/team/monjola-aminu.jpg' },
    { employeeId: 'JS003', name: 'Sharon Alalibo', role: 'Chief Operating Officer & Head of Human Resources', imageUrl: '/team/sharon-alalibo.jpg' },
    { employeeId: 'JS004', name: 'Justina Ominisan', role: 'Head of Software & AI Development', imageUrl: '/team/justina-ominisan.jpg' },
    { employeeId: 'JS005', name: 'Ifechukwu Odigwe', role: 'AI Tools Engineer & Data Scientist', imageUrl: '/team/Ifechukwude-odigwe.jpg' },
    { employeeId: 'JS006', name: 'Nengi Inala', role: 'Head of Photography', imageUrl: '/team/nengi-inala.jpg' },
    { employeeId: 'JS007', name: 'Michael Osondu', role: 'Lead Graphics Designer', imageUrl: '/team/michael-osondu.jpg' },
    { employeeId: 'JS008', name: 'Olamide Wunmi-Olajide', role: 'Legal & Compliance Advisor', imageUrl: '/team/olamide-Wunmi-Olajide.jpg' }
  ],

  clients: [
    { name: 'TechCorp', logo: '/logos/techcorp.png', alt: 'TechCorp logo' },
    { name: 'DesignStudio', logo: '/logos/designstudio.svg', alt: 'Design Studio logo' },
    { name: 'MediaGroup', logo: undefined, alt: 'Media Group logo' },
    { name: 'CreativeAgency', logo: '/logos/creativeagency.jpg', alt: 'Creative Agency logo' }
  ]
};
