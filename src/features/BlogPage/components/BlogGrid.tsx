
import React from 'react';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: 'Building Your First Mobile App with React Native',
    category: 'App Development',
    tags: ['Tutorial', 'React Native'],
    date: 'Jan 10, 2024',
    readTime: '12 min read',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 2,
    title: 'The Art of Cinematic Wedding Videography',
    category: 'Video Production',
    tags: ['Cinematography', 'Storytelling'],
    date: 'Jan 5, 2024',
    readTime: '10 min read',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 3,
    title: 'How AI is Changing the Game for Content Creators',
    category: 'AI',
    tags: ['AI Tools', 'Productivity'],
    date: 'Jan 2, 2024',
    readTime: '7 min read',
    imageUrl: '/placeholder.svg',
  },
];

const BlogGrid = () => {
  return (
    <section className="pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Articles</h2>
          <Link href="#" className="text-jstar-blue hover:text-faith-purple font-medium">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="blog-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gradient-to-br from-faith-purple to-growth-green flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <p className="text-sm font-medium">{post.category}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs">{tag}</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{post.date} • {post.readTime}</div>
                  <button className="text-jstar-blue hover:text-faith-purple">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;
