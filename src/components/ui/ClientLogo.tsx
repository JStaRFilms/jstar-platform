import React from 'react';
import Image from 'next/image';
import { ClientProfile } from '../../content/about-company';

/**
 * ClientLogo - A component that displays either an image logo or a text-based logotype
 * for clients based on whether they have a logoUrl or not.
 */
interface ClientLogoProps {
  /** The client profile object containing name and optional logoUrl */
  client: ClientProfile;
  /** Custom CSS classes */
  className?: string;
}

const ClientLogo = ({ client, className = "" }: ClientLogoProps) => {
  // If logoUrl exists, render the Next.js Image component
  if (client.logoUrl) {
    return (
      <div className={`flex items-center justify-center h-20 w-50 ${className}`}>
        <Image
          src={client.logoUrl}
          alt={`${client.name} logo`}
          width={200}
          height={80}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  // If no logoUrl, render a text-based logotype
  const defaultStyle = {
    fontFamily: 'font-inter',
    fontSize: 'text-lg',
    fontWeight: 'font-semibold',
    color: 'text-gray-700 dark:text-gray-300',
    textTransform: '',
    letterSpacing: 'tracking-wide'
  };

  const customStyle = client.textLogoStyle || {};
  const combinedStyle = { ...defaultStyle, ...customStyle };

  // Handle custom font families that aren't standard Tailwind classes
  const getFontFamilyClass = (fontFamily: string) => {
    if (fontFamily === 'font-cursive' || fontFamily.includes('Momo')) {
      return 'font-cursive';
    }
    return fontFamily;
  };

  return (
    <div className={`flex items-center justify-center h-20 w-50 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
      <div
        className={`text-center px-4 py-2 ${combinedStyle.fontSize} ${combinedStyle.fontWeight} ${combinedStyle.color} ${combinedStyle.textTransform} ${combinedStyle.letterSpacing}`}
        style={{
          fontFamily: combinedStyle.fontFamily === 'font-cursive' ? "'Momo Signature', cursive" : undefined
        }}
      >
        {client.name}
      </div>
    </div>
  );
};

export default ClientLogo;
