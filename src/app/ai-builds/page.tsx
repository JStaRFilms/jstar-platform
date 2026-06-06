import type { Metadata } from 'next';
import AiBuildWall from '@/features/HomePage/components/AiBuildWall';

export const metadata: Metadata = {
  title: 'AI-Assisted Build Wall',
  description: 'A showcase of shipped AI-assisted websites and products from J StaR Films Studios, including the AI model stacks and creative attributions behind each build.',
};

export default function AiBuildsPage() {
  return <AiBuildWall />;
}
