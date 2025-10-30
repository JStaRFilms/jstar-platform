
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAllBlogPosts } from '../../HomePage/hooks/useBlogData';

/**
 * BlogGrid Component
 *
 * Displays a grid of blog posts on the blog page.
 * Uses unified data source for consistency with HomePage.
 *
 * Features:
 * - Responsive grid layout
 * - Dark mode support
 * - Unified data with HomePage BlogSection
 * - Accessibility-compliant
 *
 * @returns {JSX.Element} Blog grid component
 */
const BlogGrid = () => {
  // Use unified blog data source
  const allPosts = useAllBlogPosts();

  return (
    <section className="pb-16" aria-labelledby="blog-grid-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2
            id="blog-grid-heading"
            className="text-2xl font-bold text-foreground"
          >
            Latest Articles
          </h2>
          <Link
            href="#"
            className="text-jstar-blue hover:text-faith-purple font-medium focus:outline-none focus:ring-2 focus:ring-jstar-blue dark:focus:ring-faith-purple rounded-md"
            aria-label="View all articles"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <article
              key={post.id}
              className="blog-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden h-48">
                <Image
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <span className="absolute top-4 right-4 px-2 py-1 bg-jstar-blue text-white text-xs font-medium rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={`${post.id}-${tag}`}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-jstar-blue dark:group-hover:text-faith-purple transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    {' • '}
                    {post.readTime}
                  </div>
                  <Link
                    href={`/blog/${post.slug || post.id}`}
                    className="text-jstar-blue hover:text-faith-purple focus:outline-none focus:ring-2 focus:ring-jstar-blue dark:focus:ring-faith-purple rounded-md"
                    aria-label={`Read article: ${post.title}`}
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;
