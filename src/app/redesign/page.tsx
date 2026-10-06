import type { Metadata } from 'next';
import Hero from './Hero';
import './project-rise.css';
import './work-handoff.css';
import './studio-handoff.css';

export const metadata: Metadata = {
  title: { absolute: 'J StaR Films Studios | Hero review' },
  description: 'A creative and technology studio making films, websites, and software for businesses.',
  robots: { index: false, follow: false },
};

export default function RedesignPage() {
  return <Hero />;
}
