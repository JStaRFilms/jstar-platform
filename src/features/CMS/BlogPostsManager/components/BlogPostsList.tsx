'use client';

import React, { useState } from 'react';

/**
 * Props for BlogPostsList component
 */
interface BlogPostsListProps {
  /** Callback when new post button is clicked */
  onNewPost: () => void;
  /** Callback when edit post is clicked */
  onEditPost: (id: string) => void;
}

/**
 * BlogPostsList Component
 * Displays comprehensive blog management interface with cards, analytics, and detailed post information
 */
export const BlogPostsList: React.FC<BlogPostsListProps> = ({
  onNewPost,
  onEditPost
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPost, setSelectedPost] = useState<string | null>('1');

  // Mock data matching the detailed mockup
  const mockPosts = [
    {
      id: '1',
      title: 'Mastering YouTube Thumbnails: A Nigerian Creator\'s Guide',
      status: 'published',
      author: 'John Oluleke-Oke',
      publishDate: 'Aug 15, 2023',
      views: 1247,
      engagement: 4.7,
      categories: ['YouTube Strategy', 'Content Creation'],
      excerpt: 'In the competitive landscape of YouTube content creation, your thumbnail is often the first impression viewers get of your video. For Nigerian creators, understanding cultural nuances and visual preferences is key to creating compelling thumbnails that drive clicks...',
      lastModified: 'Aug 16, 2023'
    },
    {
      id: '2',
      title: 'How to Create Viral Content with JohnGPT',
      status: 'published',
      author: 'John Oluleke-Oke',
      publishDate: 'Aug 10, 2023',
      views: 2436,
      engagement: 5.2,
      categories: ['JohnGPT', 'AI Tools'],
      excerpt: 'As a Nigerian content creator, standing out in the digital landscape requires both creativity and strategic thinking. JohnGPT, our AI-powered assistant, is designed specifically to help creators like you generate content that resonates with your audience...',
      lastModified: 'Aug 11, 2023'
    },
    {
      id: '3',
      title: 'Q4 Content Strategy for Nigerian YouTubers',
      status: 'scheduled',
      author: 'John Oluleke-Oke',
      publishDate: 'Sep 1, 2023',
      views: 0,
      engagement: 0,
      categories: ['Content Strategy', 'Seasonal'],
      excerpt: 'As we approach the holiday season, it\'s time to plan your Q4 content strategy. This guide will help Nigerian YouTubers create content that resonates with local audiences while maximizing global reach...',
      lastModified: 'Aug 20, 2023'
    },
    {
      id: '4',
      title: 'Monetization Strategies for Small YouTube Channels',
      status: 'draft',
      author: 'John Oluleke-Oke',
      publishDate: null,
      views: 0,
      engagement: 0,
      categories: ['Monetization', 'Beginner'],
      excerpt: 'Many Nigerian creators struggle with monetization when they\'re just starting out. This post explores practical strategies for earning from your YouTube channel even before you hit 1,000 subscribers...',
      lastModified: '2 hours ago'
    },
    {
      id: '5',
      title: 'Nigerian Content Localization: What Works and What Doesn\'t',
      status: 'published',
      author: 'John Oluleke-Oke',
      publishDate: 'Jul 28, 2023',
      views: 3687,
      engagement: 6.1,
      categories: ['Localization', 'Cultural Insights'],
      excerpt: 'Creating content that resonates with Nigerian audiences requires understanding cultural nuances, language preferences, and local trends. In this post, we explore successful localization strategies used by top Nigerian creators...',
      lastModified: 'Jul 29, 2023'
    }
  ];

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' ||
      (activeFilter === 'Published' && post.status === 'published') ||
      (activeFilter === 'Drafts' && post.status === 'draft') ||
      (activeFilter === 'Scheduled' && post.status === 'scheduled');
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200', label: 'Published' },
      draft: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200', label: 'Draft' },
      scheduled: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200', label: 'Scheduled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <span className={`text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded`}>
        Published
      </span>
    );
  };

  const getSelectedPost = () => {
    return mockPosts.find(post => post.id === selectedPost) || mockPosts[0];
  };

  const selectedPostData = getSelectedPost();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-admin-red to-red-500 bg-clip-text text-transparent">
              Blog Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage, analyze, and optimize your blog content
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onNewPost}
              className="px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced"
            >
              <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Post
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">
              <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Bulk Actions
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent"
              />
              <svg className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* System Status */}
      <section className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Blog System Status</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Current blog content management status
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <span className="status-indicator status-active"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blog System Active</span>
              </div>
              <div className="flex items-center">
                <span className="status-indicator status-active"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Analytics Connected</span>
              </div>
              <div className="flex items-center">
                <span className="status-indicator status-active"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Post: 2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-admin-red mb-2">24</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-500 mb-2">18</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-500 mb-2">8.2K</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-red-500 mb-2">4.7%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Engagement</div>
          </div>
        </div>
      </section>

      {/* Main Blog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Blog Posts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Blog Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Blog Posts</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveFilter('All')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${activeFilter === 'All' ? 'bg-admin-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('Published')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${activeFilter === 'Published' ? 'bg-admin-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  Published
                </button>
                <button
                  onClick={() => setActiveFilter('Drafts')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${activeFilter === 'Drafts' ? 'bg-admin-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  Drafts
                </button>
                <button
                  onClick={() => setActiveFilter('Scheduled')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${activeFilter === 'Scheduled' ? 'bg-admin-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  Scheduled
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className={`blog-item ${post.status} p-4 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer transition-all ${
                    selectedPost === post.id ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'
                  }`}
                  onClick={() => setSelectedPost(post.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">{post.title}</div>
                      <div className="blog-content text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {post.excerpt}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.categories.map((category, index) => (
                          <span key={index} className="category-tag px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-xs">
                            {category}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span className={`status-indicator ${post.status === 'published' ? 'status-active' : post.status === 'draft' ? 'status-warning' : 'status-critical'}`}></span>
                        {post.status === 'published' ? 'Published' : post.status === 'draft' ? 'Draft' : 'Scheduled'} • {post.publishDate || 'Not set'} • {post.views} Views
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        post.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                        post.status === 'draft' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      }`}>
                        {post.status === 'published' ? 'Published' : post.status === 'draft' ? 'Draft' : 'Scheduled'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPost(post.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">
                Previous
              </button>
              <button className="px-4 py-2 bg-admin-red text-white rounded-lg hover:bg-red-700 font-medium btn-enhanced">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Post Details */}
        <div className="space-y-6">
          {/* Post Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Post Performance</h2>
            <div className="space-y-5">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="font-medium text-gray-900 dark:text-white mb-3">Post Information</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-sm text-gray-700 dark:text-gray-300">Title</div>
                    <span className="text-sm text-right max-w-32 truncate">{selectedPostData.title}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-sm text-gray-700 dark:text-gray-300">Status</div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      selectedPostData.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                      selectedPostData.status === 'draft' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                    }`}>
                      {selectedPostData.status === 'published' ? 'Published' : selectedPostData.status === 'draft' ? 'Draft' : 'Scheduled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-sm text-gray-700 dark:text-gray-300">Published</div>
                    <span className="text-sm">{selectedPostData.publishDate}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-sm text-gray-700 dark:text-gray-300">Last Updated</div>
                    <span className="text-sm">{selectedPostData.lastModified}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-sm text-gray-700 dark:text-gray-300">Categories</div>
                    <span className="text-sm text-right max-w-32 truncate">{selectedPostData.categories.join(', ')}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="font-medium text-gray-900 dark:text-white mb-3">Performance Metrics</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Views</span>
                      <span className="text-sm">{selectedPostData.views} <span className="trend-up">↑ 12.3%</span></span>
                    </div>
                    <div className="stats-bar mb-2">
                      <div className="stats-fill stats-views" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Engagement Rate</span>
                      <span className="text-sm">{selectedPostData.engagement}% <span className="trend-up">↑ 2.1%</span></span>
                    </div>
                    <div className="stats-bar mb-2">
                      <div className="stats-fill stats-engagement" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Conversion Rate</span>
                      <span className="text-sm">2.3% <span className="trend-down">↓ 0.5%</span></span>
                    </div>
                    <div className="stats-bar mb-2">
                      <div className="stats-fill stats-conversion" style={{width: '45%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Insight:</strong> Nigerian audience engagement peaks between 7-10 PM WAT.
                  Consider scheduling posts during this window for maximum impact.
                </p>
              </div>
            </div>
          </div>

          {/* Post Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Post Actions</h2>
            <div className="space-y-4">
              <div className="flex space-x-3">
                <button
                  onClick={() => onEditPost(selectedPost || '1')}
                  className="flex-1 px-4 py-2 bg-admin-red text-white rounded-lg hover:bg-red-700 font-medium btn-enhanced"
                >
                  <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit Post
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">
                  <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3 3m-3-3l3-3"></path>
                  </svg>
                  Duplicate
                </button>
              </div>
              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">
                  <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Schedule
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">
                  <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
              <div className="flex space-x-3">
                <button className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">
                  <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  View Live
                </button>
              </div>
            </div>
          </div>

          {/* Analytics Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Analytics Timeline</h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="font-medium text-gray-900 dark:text-white mb-2">Last 7 Days</div>
                <div className="h-32 flex items-end space-x-1">
                  <div className="flex-1 bg-blue-500 rounded-t" style={{height: '20%'}}></div>
                  <div className="flex-1 bg-blue-500 rounded-t" style={{height: '45%'}}></div>
                  <div className="flex-1 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
                  <div className="flex-1 bg-blue-500 rounded-t" style={{height: '35%'}}></div>
                  <div className="flex-1 bg-blue-500 rounded-t" style={{height: '75%'}}></div>
                  <div className="flex-1 bg-blue-500 rounded-t" style={{height: '90%'}}></div>
                  <div className="flex-1 bg-blue-500 rounded-t" style={{height: '80%'}}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between mb-2">
                  <div className="font-medium text-gray-900 dark:text-white">Traffic Sources</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Organic Search</span>
                    <span className="text-sm">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '42%'}}></div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Social Media</span>
                    <span className="text-sm">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '35%'}}></div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Direct</span>
                    <span className="text-sm">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '15%'}}></div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Referral</span>
                    <span className="text-sm">8%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '8%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
