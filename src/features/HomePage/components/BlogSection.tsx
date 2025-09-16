
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from './IconComponents';

const featuredPost = {
  title: 'The Future of Storytelling in Digital Media',
  image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  category: 'Video Production',
  author: 'John Doe',
  authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  date: 'May 15, 2023',
  readTime: '8 min read',
  excerpt: 'In today\'s fast-paced digital landscape, storytelling has evolved beyond traditional media. Brands and creators are leveraging immersive technologies to create more engaging and memorable experiences for their audiences.',
  content: 'From 360° videos to interactive narratives, the possibilities are endless. In this article, we explore the latest trends in digital storytelling and how they\'re reshaping the way we consume content.',
  tags: ['Storytelling', 'DigitalMedia', 'Trends2023']
};

const blogPosts = [
  {
    title: 'Mastering Natural Light Photography',
    image: 'https://images.unsplash.com/photo-1551817958-9d85771ac8b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Photography',
    date: 'June 2, 2023',
    readTime: '5 min read',
    excerpt: 'Discover how to harness the power of natural light to create stunning photographs that capture the essence of your subject.'
  },
  {
    title: 'The Psychology of Color in Web Design',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Web Design',
    date: 'May 24, 2023',
    readTime: '7 min read',
    excerpt: 'Learn how different colors affect user behavior and how to strategically use them in your website design to achieve your business goals.'
  },
  {
    title: 'Social Media Strategies for Small Businesses in 2023',
    image: 'https://images.unsplash.com/photo-1542744095-291d1f67e221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Marketing',
    date: 'May 10, 2023',
    readTime: '6 min read',
    excerpt: 'Effective social media strategies that small businesses can implement to increase engagement and drive sales in the current digital landscape.'
  },
];

const BlogSection = () => {
  return (
    <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-jstar-blue/10 text-jstar-blue dark:bg-faith-purple/20 dark:text-faith-purple rounded-full text-sm font-medium mb-4">
            Latest Insights
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-jstar-blue to-faith-purple">Blog & Articles</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the latest trends, insights, and stories from our creative journey.
          </p>
        </div>

        {/* Featured Blog Post */}
        <div className="mb-16 group">
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/2 relative overflow-hidden">
                <Image className="h-full w-full object-cover md:w-full md:h-full transform group-hover:scale-105 transition-transform duration-700" src={featuredPost.image} alt={featuredPost.title} fill />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <span className="inline-block px-3 py-1 bg-jstar-blue text-white text-xs font-semibold rounded-full mb-3">
                    {featuredPost.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{featuredPost.title}</h3>
                  <p className="text-gray-200 text-sm flex items-center">
                    <span className="flex items-center">
                      <Image className="w-6 h-6 rounded-full mr-2" src={featuredPost.authorImage} alt={featuredPost.author} width={24} height={24} />
                      {featuredPost.author}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{featuredPost.date}</span>
                    <span className="mx-2">•</span>
                    <span>{featuredPost.readTime}</span>
                  </p>
                </div>
              </div>
              <div className="p-8 md:w-1/2">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {featuredPost.content}
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {featuredPost.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link href="#" className="inline-flex items-center text-jstar-blue dark:text-faith-purple font-medium group-hover:underline">
                    Read Full Article
                    <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative overflow-hidden h-48">
                <Image className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" src={post.image} alt={post.title} fill />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <span className="absolute top-4 right-4 px-2 py-1 bg-jstar-blue text-white text-xs font-medium rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-jstar-blue dark:group-hover:text-faith-purple transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <Link href="#" className="inline-flex items-center text-sm font-medium text-jstar-blue dark:text-faith-purple group-hover:underline">
                  Read More
                  <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/blog" className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-jstar-blue to-faith-purple hover:from-jstar-blue/90 hover:to-faith-purple/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
