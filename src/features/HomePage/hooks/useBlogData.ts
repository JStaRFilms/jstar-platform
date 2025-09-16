/**
 * Blog Data Service Hook
 *
 * This hook provides a unified data source for blog content across the application.
 * It's designed with future database migration in mind (SQLite → Supabase via Prisma).
 *
 * Architecture:
 * - Local data storage for development
 * - Abstraction layer for easy database integration
 * - Type-safe interfaces for all blog content
 * - Support for both featured and regular blog posts
 */

export interface BlogPost {
  /** Unique identifier for the blog post */
  id: string;
  /** Main title of the blog post */
  title: string;
  /** URL-friendly slug for the post */
  slug?: string;
  /** Brief excerpt or summary */
  excerpt: string;
  /** Full content of the blog post */
  content?: string;
  /** Featured image URL */
  image: string;
  /** Alternative text for the image */
  imageAlt?: string;
  /** Category or topic of the post */
  category: string;
  /** Array of tags for filtering and organization */
  tags: string[];
  /** Author name */
  author: string;
  /** Author avatar/profile image URL */
  authorImage?: string;
  /** Publication date in ISO format */
  date: string;
  /** Estimated reading time in minutes */
  readTime: string;
  /** Whether this post is featured/highlighted */
  featured?: boolean;
  /** Publication status */
  status?: 'draft' | 'published' | 'archived';
  /** SEO metadata */
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogData {
  /** Featured blog post for homepage hero section */
  featuredPost: BlogPost;
  /** Array of regular blog posts for grid display */
  posts: BlogPost[];
  /** Loading state for async operations */
  isLoading?: boolean;
  /** Error state for data fetching */
  error?: string;
}

/**
 * Default blog data - will be replaced by database queries in production
 * This structure follows the PRD requirements for easy migration to Prisma/Supabase
 */
const defaultBlogData: BlogData = {
  featuredPost: {
    id: 'future-of-storytelling',
    title: 'The Future of Storytelling in Digital Media',
    slug: 'future-of-storytelling-digital-media',
    excerpt: 'In today\'s fast-paced digital landscape, storytelling has evolved beyond traditional media. Brands and creators are leveraging immersive technologies to create more engaging and memorable experiences for their audiences.',
    content: 'From 360° videos to interactive narratives, the possibilities are endless. In this article, we explore the latest trends in digital storytelling and how they\'re reshaping the way we consume content.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Digital storytelling and immersive media concepts',
    category: 'Video Production',
    tags: ['Storytelling', 'DigitalMedia', 'Trends2023'],
    author: 'John Oluleke-Oke',
    authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: '2023-05-15T10:00:00Z',
    readTime: '8 min read',
    featured: true,
    status: 'published',
    seoTitle: 'The Future of Storytelling in Digital Media | J StaR Films',
    seoDescription: 'Explore how digital storytelling is evolving with immersive technologies and interactive narratives.'
  },
  posts: [
    {
      id: 'mastering-natural-light',
      title: 'Mastering Natural Light Photography',
      slug: 'mastering-natural-light-photography',
      excerpt: 'Discover how to harness the power of natural light to create stunning photographs that capture the essence of your subject.',
      image: 'https://images.unsplash.com/photo-1551817958-9d85771ac8b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Natural light photography techniques and examples',
      category: 'Photography',
      tags: ['Photography', 'NaturalLight', 'Tutorial'],
      author: 'John Oluleke-Oke',
      date: '2023-06-02T10:00:00Z',
      readTime: '5 min read',
      featured: false,
      status: 'published'
    },
    {
      id: 'psychology-color-web-design',
      title: 'The Psychology of Color in Web Design',
      slug: 'psychology-color-web-design',
      excerpt: 'Learn how different colors affect user behavior and how to strategically use them in your website design to achieve your business goals.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Color psychology in web design and user experience',
      category: 'Web Design',
      tags: ['WebDesign', 'ColorPsychology', 'UX'],
      author: 'John Oluleke-Oke',
      date: '2023-05-24T10:00:00Z',
      readTime: '7 min read',
      featured: false,
      status: 'published'
    },
    {
      id: 'social-media-strategies',
      title: 'Social Media Strategies for Small Businesses in 2023',
      slug: 'social-media-strategies-small-businesses-2023',
      excerpt: 'Effective social media strategies that small businesses can implement to increase engagement and drive sales in the current digital landscape.',
      image: 'https://images.unsplash.com/photo-1542744095-291d1f67e221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Social media marketing strategies for small businesses',
      category: 'Marketing',
      tags: ['SocialMedia', 'Marketing', 'SmallBusiness'],
      author: 'John Oluleke-Oke',
      date: '2023-05-10T10:00:00Z',
      readTime: '6 min read',
      featured: false,
      status: 'published'
    }
  ]
};

/**
 * Blog Data Service Hook
 *
 * Provides unified access to blog data across the application.
 * Designed for easy migration to database-backed storage.
 *
 * @returns {BlogData} Unified blog data object
 */
export const useBlogData = (): BlogData => {
  // TODO: Replace with actual database queries when implementing Prisma/Supabase
  // This abstraction allows for seamless migration:
  // 1. Local SQLite with Prisma
  // 2. Cloud Supabase with minimal code changes

  return {
    ...defaultBlogData,
    isLoading: false,
    error: undefined
  };
};

/**
 * Get all blog posts (featured + regular)
 * Useful for blog listing pages
 */
export const useAllBlogPosts = () => {
  const { featuredPost, posts } = useBlogData();
  return [featuredPost, ...posts];
};

/**
 * Get blog posts by category
 * @param category - Category to filter by
 */
export const useBlogPostsByCategory = (category: string) => {
  const allPosts = useAllBlogPosts();
  return allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
};

/**
 * Get featured blog post
 * Used for homepage hero sections
 */
export const useFeaturedPost = () => {
  const { featuredPost } = useBlogData();
  return featuredPost;
};

/**
 * Get regular blog posts (excluding featured)
 * Used for blog grids and listings
 */
export const useRegularPosts = () => {
  const { posts } = useBlogData();
  return posts;
};

/**
 * Future database integration point
 * This interface defines the contract for database operations
 */
export interface BlogDataService {
  getAllPosts(): Promise<BlogPost[]>;
  getFeaturedPost(): Promise<BlogPost | null>;
  getPostsByCategory(category: string): Promise<BlogPost[]>;
  getPostById(id: string): Promise<BlogPost | null>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  createPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost>;
  updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost>;
  deletePost(id: string): Promise<void>;
}

// TODO: Implement Prisma-based service when moving to database
// export class PrismaBlogDataService implements BlogDataService { ... }
