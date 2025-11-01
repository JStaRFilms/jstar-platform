export interface ServiceTier {
  id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: 'NGN';
    period: string;
  };
  features: string[];
  deliverables: string[];
  isFeatured?: boolean;
}

export const serviceTiers: ServiceTier[] = [
  {
    id: 'core',
    name: 'Core Partnership',
    description: 'Essential creative services to establish your brand presence and digital foundation.',
    price: {
      amount: 250000,
      currency: 'NGN',
      period: 'project'
    },
    features: [
      'Branding & Identity Design',
      'Professional Photography',
      'Basic Web Development',
      'Social Media Setup'
    ],
    deliverables: [
      'Logo & Brand Guidelines',
      'Product/Portrait Photography (10 images)',
      'Responsive Website (5 pages)',
      'Social Media Brand Kit'
    ]
  },
  {
    id: 'growth',
    name: 'Growth Partnership',
    description: 'Comprehensive creative solutions to accelerate your business growth and market expansion.',
    price: {
      amount: 500000,
      currency: 'NGN',
      period: 'project'
    },
    features: [
      'Video Production & Editing',
      'Advanced Web Development',
      'Content Marketing Strategy',
      'Digital Marketing Setup',
      'Brand Strategy Consulting'
    ],
    deliverables: [
      'Professional Video (2-3 minutes)',
      'E-commerce Website or Advanced CMS',
      'Content Calendar & Strategy',
      'Marketing Campaign Assets',
      'Brand Strategy Report'
    ],
    isFeatured: true
  },
  {
    id: 'full-studio',
    name: 'Full Studio Partnership',
    description: 'Complete creative agency services for enterprises requiring end-to-end brand transformation.',
    price: {
      amount: 1000000,
      currency: 'NGN',
      period: 'project'
    },
    features: [
      'Full Video Production Suite',
      'Custom Web Applications',
      'Motion Graphics & Animation',
      'Audio Production',
      'Multi-channel Marketing',
      'Ongoing Brand Management'
    ],
    deliverables: [
      'Multiple Video Projects',
      'Custom Web Application',
      'Animated Explainers & Graphics',
      'Professional Audio Content',
      'Complete Marketing Campaigns',
      'Monthly Brand Support'
    ]
  }
];
