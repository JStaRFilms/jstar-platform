
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from './IconComponents';
import { useBlogData } from '../hooks/useBlogData';

/**
 * BlogSection Component
 *
 * Displays a featured blog post and a grid of recent blog posts on the homepage.
 * Uses unified data source for consistency across HomePage and BlogPage.
 *
 * Features:
 * - Featured article with rich content preview
 * - Responsive grid of recent posts
 * - Dark mode support with custom theme colors
 * - Accessibility-compliant with proper ARIA labels
 * - Mobile-first responsive design
 *
 * @returns {JSX.Element} Blog section component
 */

/**
 * BlogSection Component
 *
 * Displays a featured blog post and a grid of recent blog posts on the homepage.
 * Uses unified data source for consistency across HomePage and BlogPage.
 *
 * Features:
 * - Featured article with rich content preview
 * - Responsive grid of recent posts
 * - Dark mode support with custom theme colors
 * - Accessibility-compliant with proper ARIA labels
 * - Mobile-first responsive design
 *
 * @returns {JSX.Element} Blog section component
 */
const BlogSection = () => {
  // Use unified blog data source
  const { featuredPost, posts } = useBlogData();

  return (
    <section
      id="blog"
      className="py-20 bg-gray-50 dark:bg-gray-900/50"
      aria-labelledby="blog-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-jstar-blue/10 text-jstar-blue dark:bg-faith-purple/20 dark:text-faith-purple rounded-full text-sm font-medium mb-4">
            Latest Insights
          </span>
          <h2
            id="blog-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-jstar-blue to-faith-purple">
              Blog & Articles
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the latest trends, insights, and stories from our creative journey.
          </p>
        </div>

        {/* Featured Blog Post */}
        <div className="mb-16 group">
          <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="md:flex">
              <div className="relative overflow-hidden h-64 md:flex-shrink-0 md:w-1/2 md:h-auto">
                <Image
                  className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  src={featuredPost.image}
                  alt={featuredPost.imageAlt || featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <span className="inline-block px-3 py-1 bg-jstar-blue text-white text-xs font-semibold rounded-full mb-3">
                    {featuredPost.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-200 text-sm flex items-center">
                    <span className="flex items-center">
                      {featuredPost.authorImage && (
                        <Image
                          className="w-6 h-6 rounded-full mr-2"
                          src={featuredPost.authorImage}
                          alt={featuredPost.author}
                          width={24}
                          height={24}
                        />
                      )}
                      {featuredPost.author}
                    </span>
                    <span className="mx-2" aria-hidden="true">•</span>
                    <time dateTime={featuredPost.date}>
                      {new Date(featuredPost.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <span className="mx-2" aria-hidden="true">•</span>
                    <span>{featuredPost.readTime}</span>
                  </p>
                </div>
              </div>
              <div className="p-8 md:w-1/2">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  {featuredPost.content && (
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {featuredPost.content}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {featuredPost.tags.map((tag: string, index: number) => (
                      <span
                        key={`${tag}-${index}`}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug || featuredPost.id}`}
                    className="inline-flex items-center text-jstar-blue dark:text-faith-purple font-medium group-hover:underline focus:outline-none focus:ring-2 focus:ring-jstar-blue dark:focus:ring-faith-purple rounded-md"
                    aria-label={`Read full article: ${featuredPost.title}`}
                  >
                    Read Full Article
                    <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
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
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="mx-2" aria-hidden="true">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-jstar-blue dark:group-hover:text-faith-purple transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug || post.id}`}
                  className="inline-flex items-center text-sm font-medium text-jstar-blue dark:text-faith-purple group-hover:underline focus:outline-none focus:ring-2 focus:ring-jstar-blue dark:focus:ring-faith-purple rounded-md"
                  aria-label={`Read more: ${post.title}`}
                >
                  Read More
                  <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-jstar-blue to-faith-purple hover:from-jstar-blue/90 hover:to-faith-purple/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-jstar-blue dark:focus:ring-faith-purple"
            aria-label="View all blog articles"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
