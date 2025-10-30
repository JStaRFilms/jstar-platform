
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFeaturedPost } from '../../HomePage/hooks/useBlogData';

/**
 * FeaturedArticle Component
 *
 * Displays the featured blog post on the blog page.
 * Uses unified data source for consistency with HomePage.
 *
 * Features:
 * - Large featured article display
 * - Dark mode support
 * - Unified data with HomePage BlogSection
 * - Accessibility-compliant
 *
 * @returns {JSX.Element} Featured article component
 */
const FeaturedArticle = () => {
  // Use unified blog data source
  const featuredPost = useFeaturedPost();

  return (
    <section className="py-16" aria-labelledby="featured-article-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2
            id="featured-article-heading"
            className="text-2xl font-bold text-foreground mb-6"
          >
            Featured Article
          </h2>
          <article className="blog-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-2/3 relative overflow-hidden">
                <Image
                  className="h-64 md:h-full w-full object-cover transform hover:scale-105 transition-transform duration-700"
                  src={featuredPost.image}
                  alt={featuredPost.imageAlt || featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 67vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredPost.tags.slice(0, 2).map((tag) => (
                      <span
                        key={`${featuredPost.id}-${tag}`}
                        className="px-3 py-1 bg-jstar-blue/20 text-jstar-blue rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base mb-4 max-w-2xl">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center">
                    {featuredPost.authorImage && (
                      <Image
                        className="w-10 h-10 rounded-full mr-3"
                        src={featuredPost.authorImage}
                        alt={featuredPost.author}
                        width={40}
                        height={40}
                      />
                    )}
                    <div>
                      <div className="font-medium text-white">{featuredPost.author}</div>
                      <div className="text-sm text-white/80">
                        <time dateTime={featuredPost.date}>
                          {new Date(featuredPost.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                        {' • '}
                        {featuredPost.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 p-8 flex items-center">
                <div className="w-full">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-jstar-blue/20 text-jstar-blue rounded-full text-sm">
                      {featuredPost.category}
                    </span>
                    {featuredPost.tags.slice(2).map((tag) => (
                      <span
                        key={`${featuredPost.id}-${tag}`}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {featuredPost.authorImage && (
                        <div className="w-10 h-10 bg-gradient-to-r from-jstar-blue to-faith-purple rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {featuredPost.author.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-foreground">
                          {featuredPost.author}
                        </div>
                        <div className="text-sm text-muted">
                          <time dateTime={featuredPost.date}>
                            {new Date(featuredPost.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                          {' • '}
                          {featuredPost.readTime}
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${featuredPost.slug || featuredPost.id}`}
                      className="text-jstar-blue hover:text-faith-purple focus:outline-none focus:ring-2 focus:ring-jstar-blue dark:focus:ring-faith-purple rounded-md"
                      aria-label={`Read featured article: ${featuredPost.title}`}
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticle;
