
export const APP_ROUTES = [
    {
        path: '/',
        name: 'Home',
        description: 'The main landing page with hero section, creator statement, and overview.',
    },
    {
        path: '/about',
        name: 'About',
        description: 'Information about John Oluleke-Oke, his biography, skills, and philosophy.',
    },
    {
        path: '/portfolio',
        name: 'Portfolio',
        description: 'Showcase of video projects, app development case studies, and creative work.',
    },
    {
        path: '/services',
        name: 'Services',
        description: 'Details of services offered: Video Production, App Development, Consulting, Live Streaming.',
    },
    {
        path: '/store',
        name: 'Store',
        description: 'Digital products, courses, templates, and bundles for sale.',
    },
    {
        path: '/blog',
        name: 'Blog',
        description: 'Articles and insights on creativity, technology, and faith.',
    },
    {
        path: '/contact',
        name: 'Contact',
        description: 'Contact form and information to get in touch with John.',
    },
    {
        path: '/john-gpt',
        name: 'JohnGPT Dashboard',
        description: 'The full-page interface for the AI assistant.',
    },
    {
        path: '/public-vault',
        name: 'Public Vault',
        description: 'Curated public notes and insights (Obsidian vault).',
    },
];

export const getRoutesDescription = () => {
    return APP_ROUTES.map(r => `- ${r.name} (${r.path}): ${r.description}`).join('\n');
};
