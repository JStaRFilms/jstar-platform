import type { Metadata } from 'next';
import Hero from './redesign/Hero';
import './redesign/project-rise.css';
import './redesign/work-handoff.css';
import './redesign/studio-handoff.css';

const description = 'A creative and technology studio making films, websites, and software for businesses.';

export const metadata: Metadata = {
  title: { absolute: 'J StaR Films Studios | Films, Websites & Software' },
  description,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'J StaR Films Studios | Films, Websites & Software',
    description,
    url: '/',
    siteName: 'J StaR Films Studios',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return <Hero />;
}
