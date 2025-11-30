import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | J StaR Films Studios', // Page titles will look like "About Us | J StaR Films Studios"
    default: 'J StaR Films Studios - Creative & Technology Partner', // Default title for the homepage
  },
  description: 'J StaR Films Studios is an integrated creative and technology partner, specializing in crafting holistic brand experiences from cinematic narratives to intelligent AI tools.',
  openGraph: {
    title: 'J StaR Films Studios - Creative & Technology Partner',
    description: 'An integrated creative and technology partner specializing in crafting holistic brand experiences.',
    url: 'https://www.jstarstudios.com/', // Replace with your actual production domain
    siteName: 'J StaR Films Studios',
    images: [
      {
        url: '/og-image.png', // The path to your OG image in the `public` folder
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

import { withAuth } from '@workos-inc/authkit-nextjs';
import { SignInButton } from "@/components/auth/SignInButton";
import { UserButton } from "@/components/auth/UserButton";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await withAuth();
  const authButton = user ? <UserButton user={user} /> : <SignInButton />;

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Momo+Signature&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-background transition-colors duration-300`}>
        <ConditionalLayout authButton={authButton} user={user}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
