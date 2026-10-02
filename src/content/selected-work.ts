export type GalleryFilter = 'all' | 'software' | 'film';
export type GalleryMode = 'browse' | 'play' | 'film';

export interface GalleryProject {
  id: string;
  title: string;
  kind: 'software' | 'film';
  label: string;
  description: string;
  color: string;
  presentation:
    | { type: 'study-game' }
    | { type: 'provisional-cover'; note: string }
    | { type: 'static-image'; src: string; alt: string }
    | { type: 'film'; poster: string; previewSrc: string; fullSrc?: string };
  detailsHref?: string;
}

export const selectedWork: readonly GalleryProject[] = [
  {
    id: 'adaptive-study-game', title: 'Adaptive Study Game', kind: 'software',
    label: 'Interactive learning', description: 'Choose a topic. Play a round. Find out what sticks.',
    color: '#001514', presentation: { type: 'study-game' },
    detailsHref: 'https://github.com/JStaRFilms/Adaptive-Study-Game',
  },
  {
    id: 'school-management-system', title: 'School management system', kind: 'software',
    label: 'Business software', description: 'School management software. Product imagery is being selected.',
    color: '#1e3028',
    presentation: { type: 'provisional-cover', note: 'Provisional project cover. Product imagery to follow.' },
  },
  {
    id: 'nifemi', title: 'Nifemi', kind: 'film', label: 'Film',
    description: 'Watch Nifemi. The gallery preview is an excerpt.', color: '#092d3c',
    presentation: { type: 'film', poster: '/redesign/gallery-nifemi.jpg', previewSrc: '/redesign/gallery-nifemi.mp4', fullSrc: '/redesign/nifemi.mp4' },
  },
  {
    id: 'sharon', title: 'Sharon', kind: 'film', label: 'Film excerpt',
    description: 'A preview excerpt from Sharon.', color: '#343c20',
    presentation: { type: 'film', poster: '/redesign/gallery-sharon.jpg', previewSrc: '/redesign/gallery-sharon.mp4' },
  },
];
