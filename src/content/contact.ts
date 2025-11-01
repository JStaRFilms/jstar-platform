export interface BusinessInfo {
  email: string;
  phone: string[]; // Array of phone numbers
  whatsapp: string[]; // Array of WhatsApp numbers
  address: string;
  workingHours: string;
  socialLinks: {
    youtube: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
}

export const businessInfo: BusinessInfo = {
  email: 'hey@jstarstudios.com',
  phone: ['+2348152657887', '+2348106973667'],
  whatsapp: ['+2348152657887', '+2348106973667'],
  address: 'Abuja, Nigeria',
  workingHours: 'Monday - Friday, 8am - 5pm',
  socialLinks: {
    youtube: 'https://www.youtube.com/@JStaRFilms',
    linkedin: 'https://www.linkedin.com/in/saxy/',
    twitter: 'https://x.com/OlulekeJOke',
    instagram: 'https://www.instagram.com/j_star.films/',
  },
};
