export interface TeamMember {
  employeeId: string;
  name: string;
  role: string;
  imageUrl: string;
}

export interface ClientProfile {
  name: string;
  logoUrl?: string;
  textLogoStyle?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    textTransform?: string;
    letterSpacing?: string;
  };
}

export interface CompanyData {
  mission: string;
  teamMembers: TeamMember[];
  clients: ClientProfile[];
}

export const companyData: CompanyData = {
  mission: "J StaR Films Studios is an integrated creative and technology partner, specializing in crafting holistic brand experiences. Our multidisciplinary team—spanning strategy, filmmaking, software development, and design—collaborates to build not just content, but ecosystems. From cinematic narratives to intelligent AI tools, we bring visionary ideas to life.",

  teamMembers: [
    { employeeId: 'JS001', name: 'John Oluleke-Oke', role: 'CEO / Chief Creative Director', imageUrl: '/team/john-oluleke-oke.jpg' },
    { employeeId: 'JS002', name: 'Monjola Aminu', role: 'Chief Brand & Communications Officer', imageUrl: '/team/monjola-aminu.jpg' },
    { employeeId: 'JS003', name: 'Sharon Alalibo', role: 'Chief Operating Officer & Head of Human Resources', imageUrl: '/team/sharon-alalibo.jpg' },
    { employeeId: 'JS004', name: 'Justina Ominisan', role: 'Head of Software & AI Development', imageUrl: '/team/justina-ominisan.jpg' },
    { employeeId: 'JS005', name: 'Ifechukwu Odigwe', role: 'AI Tools Engineer & Data Scientist', imageUrl: '/team/Ifechukwude-odigwe.jpg' },
    { employeeId: 'JS006', name: 'Nengimote Inala', role: 'Head of Photography', imageUrl: '/team/nengimote-inala.jpg' },
    { employeeId: 'JS007', name: 'Michael Osondu', role: 'Lead Graphics Designer', imageUrl: '/team/michael-osondu.jpg' },
    { employeeId: 'JS008', name: 'Olamide Wunmi-Olajide', role: 'Legal & Compliance Advisor', imageUrl: '/team/olamide-wunmi-olajide.jpg' }
  ],

  clients: [
    {
      name: 'Winning Worship Way',
      logoUrl: '/logos/winning-worship-way-logo.png',
    },
    {
      name: 'Monjola Aminu',
      // No logoUrl - this will be a generated logotype
      textLogoStyle: {
        fontFamily: 'font-cursive', // Momo Signature cursive font
        fontSize: 'text-xl',
        fontWeight: 'font-normal',
        color: 'text-blue-700 dark:text-blue-300',
        textTransform: '',
        letterSpacing: 'tracking-normal'
      }
    },
    {
      name: 'Success Light Music',
      textLogoStyle: {
        fontFamily: 'font-cursive', // Momo Signature cursive font
        fontSize: 'text-2xl',
        fontWeight: 'font-normal',
        // color: 'text-pink-700 dark:text-pink-300',
        textTransform: '',
        letterSpacing: 'tracking-normal'
      },
    },
    {
      name: 'Sharon\'s Chronicles',
      logoUrl: '/logos/sharons-chronicles.png'
      // No logoUrl - this will be a generated logotype
    },
  ]
};
