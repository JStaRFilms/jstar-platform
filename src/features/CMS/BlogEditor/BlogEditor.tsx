'use client';

import React, { useState } from 'react';

/**
 * BlogEditor Component
 * Main component for the blog post editor interface
 */
export const BlogEditor: React.FC = () => {
  // Editor state
  const [activeTab, setActiveTab] = useState('markdown');
  const [postTitle, setPostTitle] = useState('How to Create Viral YouTube Content While Staying True to Your Values');
  const [postContent, setPostContent] = useState(`# How to Create Viral YouTube Content While Staying True to Your Values

In today's digital landscape, content creators face a constant tension between creating content that performs well algorithmically and staying true to their core values. This post explores practical strategies for achieving both.

## The Viral Content Dilemma

Many creators feel pressured to compromise their authenticity in pursuit of views and engagement. However, our research shows that **content aligned with creator values actually performs better long-term**.

### Key Statistics:
- 73% of viewers prefer authentic content over highly polished but inauthentic videos
- Channels maintaining consistent values see 2.3x higher subscriber retention
- Values-driven content generates 41% more meaningful engagement

## Practical Framework

Here's a step-by-step approach to creating viral content without compromising your values:

1. **Identify Your Core Values**
   - What principles guide your work?
   - Which values are non-negotiable?
   - How do these translate to content creation?

2. **Develop Your Unique Angle**
   - Find the intersection between what's trending and what matters to you
   - Example: If you value authenticity, create content about "imperfect" success stories

3. **Optimize Within Your Boundaries**
   - Use proven viral techniques that align with your values
   - Avoid clickbait if it contradicts your authenticity values
   - Focus on genuine hooks that reflect your message

## Case Study: Faith-Based Content

[[Faith Integration Guide]] provides a perfect example of how to integrate values into viral content. One creator we worked with saw their channel grow from 5k to 50k subscribers in 6 months by:

- Creating content around "faith in everyday work"
- Using viral storytelling techniques while maintaining spiritual integrity
- Building community around shared values rather than just views

> "When I stopped chasing trends and started creating content aligned with my values, my engagement skyrocketed." - Sarah J., Content Creator

## Conclusion

Creating viral content doesn't require compromising your values. In fact, the most successful creators find ways to **leverage their values as their unique competitive advantage**.

By staying true to what matters most, you'll attract an audience that genuinely connects with your message and sticks around for the long haul.`);

  // Form state
  const [urlSlug, setUrlSlug] = useState('how-to-create-viral-youtube-content-while-staying-true-to-your-values');
  const [metaDescription, setMetaDescription] = useState('Discover how to create viral YouTube content while staying true to your core values. Practical strategies for authentic content that performs well.');
  const [selectedCategories, setSelectedCategories] = useState(['Content Creation', 'YouTube Strategy', 'Faith Integration']);
  const [tags, setTags] = useState(['YouTube', 'Viral Content', 'Authenticity']);
  const [newTag, setNewTag] = useState('');
  const [publishDate, setPublishDate] = useState('2024-06-20T10:00');
  const [enableComments, setEnableComments] = useState(true);
  const [showAuthorInfo, setShowAuthorInfo] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Draft saved successfully!');
    }, 1500);
  };

  const handlePublish = async () => {
    if (confirm('Are you sure you want to publish this post?')) {
      setIsPublishing(true);
      // Simulate API call
      setTimeout(() => {
        setIsPublishing(false);
        alert('Post published successfully!');
        // In a real app, this would redirect to the blog posts list
      }, 2000);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-admin-red to-red-500 bg-clip-text text-transparent">
              Blog Post Editor
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create and edit blog content for the J StaR Platform
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2 inline text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                  Save Draft
                </>
              )}
            </button>
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-admin-red text-admin-red rounded-lg font-medium">
              <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Preview
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2 inline text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* System Status */}
      <section className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Blog Editor Status</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Current blog post configuration and version status
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <span className="status-indicator status-warning"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Draft Version</span>
              </div>
              <div className="flex items-center">
                <span className="status-indicator status-active"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API Connected</span>
              </div>
              <div className="flex items-center">
                <span className="status-indicator status-active"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">All Synced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Blog Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Blog Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Title */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Post Title</h2>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full px-4 py-3 text-2xl border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter post title..."
            />
          </div>

          {/* Post Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="editor-tabs">
              <div
                className={`editor-tab ${activeTab === 'markdown' ? 'active' : ''}`}
                onClick={() => setActiveTab('markdown')}
              >
                Markdown
              </div>
              <div
                className={`editor-tab ${activeTab === 'wysiwyg' ? 'active' : ''}`}
                onClick={() => setActiveTab('wysiwyg')}
              >
                Visual Editor
              </div>
              <div
                className={`editor-tab ${activeTab === 'obsidian' ? 'active' : ''}`}
                onClick={() => setActiveTab('obsidian')}
              >
                Obsidian Preview
              </div>
            </div>

            <div className="editor-controls">
              <div className="flex space-x-1">
                <div className="editor-control" title="Bold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-4M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="editor-control" title="Italic">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l5-7-5-7" />
                  </svg>
                </div>
                <div className="editor-control" title="Heading 1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v6M3 10h10a8 8 0 018 8v6m0 0v-3m0 3h3m-3 0h-3" />
                  </svg>
                </div>
                <div className="editor-control" title="Heading 2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v6M3 10h10a8 8 0 018 8v6m0 0v-3m0 3h3m-3 0h-3" />
                  </svg>
                </div>
                <div className="editor-control" title="Bullet List">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-4M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="editor-control" title="Numbered List">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-4M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="editor-control" title="Blockquote">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-4M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="editor-control" title="Link">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="editor-control" title="Image">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="editor-control" title="JohnGPT Assistant">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Markdown Editor */}
            <div className="markdown-editor p-4">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full h-96 bg-transparent border-none outline-none resize-none"
                placeholder="Write your blog post content here..."
              />
            </div>
          </div>

          {/* Blog Post Stats */}
          <div className="blog-post-stats">
            <div className="stat-item">
              <span className="stat-value">1,247</span>
              <span className="stat-label">Words</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">8 min</span>
              <span className="stat-label">Read Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">42</span>
              <span className="stat-label">Reading Score</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">B+</span>
              <span className="stat-label">Grade Level</span>
            </div>
          </div>

          {/* JohnGPT Assistant */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">JohnGPT Assistant</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Content Optimization</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Improve your post for better engagement</p>
                  </div>
                  <button className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium">
                    Optimize
                  </button>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">SEO Analysis</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Check SEO readiness and suggestions</p>
                  </div>
                  <button className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium">
                    Analyze
                  </button>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Faith Integration</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add spiritual alignment to your content</p>
                  </div>
                  <button className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium">
                    Enhance
                  </button>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Viral Formula Check</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Verify against proven viral structures</p>
                  </div>
                  <button className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium">
                    Check
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Blog History */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Change History</h2>
            <div className="space-y-4">
              <div className="blog-section p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Added case study section</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Expanded with faith-based example</div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Today, 10:45 AM</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-admin-red to-red-500 flex items-center justify-center text-white text-xs mr-2">
                      JO
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">John Oluleke-Oke</span>
                  </div>
                  <button className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium">
                    View Changes
                  </button>
                </div>
              </div>
              <div className="blog-section p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Updated statistics</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Added latest engagement metrics</div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">June 18, 2024</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-admin-red to-red-500 flex items-center justify-center text-white text-xs mr-2">
                      JO
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">John Oluleke-Oke</span>
                  </div>
                  <button className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium">
                    View Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Blog Configuration */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Featured Image</h2>
            <div className="featured-image">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                alt="Content creation workspace"
              />
              <p className="text-gray-600 dark:text-gray-400 text-sm">Click to upload or select from media library</p>
            </div>
            <div className="mt-3 flex justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Current image</span>
                <span className="ml-2 text-sm font-medium">content-creation.jpg</span>
              </div>
              <button className="text-sm text-admin-red hover:text-red-700 dark:hover:text-red-400 font-medium">
                Replace
              </button>
            </div>
          </div>

          {/* Post Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Post Settings</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={urlSlug}
                  onChange={(e) => setUrlSlug(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter a brief description for SEO..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SEO Preview</label>
                <div className="seo-preview">
                  <div className="seo-title">{postTitle}</div>
                  <div className="seo-url">jstarfilms.com/blog/{urlSlug}</div>
                  <div className="seo-description">{metaDescription}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categories</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCategories.map((category, index) => (
                    <span key={index} className="category">{category}</span>
                  ))}
                </div>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option>Select category</option>
                  <option>Content Creation</option>
                  <option>YouTube Strategy</option>
                  <option>Video Production</option>
                  <option>Faith Integration</option>
                  <option>Business Growth</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <svg
                        className="tag-remove"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        onClick={() => removeTag(tag)}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-r-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publish Settings</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publish Date</label>
                    <input
                      type="datetime-local"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={enableComments}
                        onChange={(e) => setEnableComments(e.target.checked)}
                        className="h-4 w-4 text-admin-red focus:ring-admin-red border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable comments</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showAuthorInfo}
                        onChange={(e) => setShowAuthorInfo(e.target.checked)}
                        className="h-4 w-4 text-admin-red focus:ring-admin-red border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Show author info</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="h-4 w-4 text-admin-red focus:ring-admin-red border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured post</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Post Analytics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Post Analytics</h2>
            <div className="space-y-5">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Views</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">1,247</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Engagement Rate</span>
                  <span className="text-sm font-medium text-green-600">3.2%</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Avg. Time on Page</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">2m 14s</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</span>
                  <span className="text-sm font-medium text-green-600">1.8%</span>
                </div>
              </div>

              <div className="h-48 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="text-center h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Analytics chart would appear here
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Panel */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 shadow-lg border border-red-200 dark:border-red-800">
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">Emergency Tools</h2>
            <div className="space-y-3">
              <p className="text-sm text-red-800 dark:text-red-200">
                Critical functions for immediate blog management and recovery.
              </p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced">
                ONE BUTTON: Revert to Last Working Version
              </button>
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium">
                  Disable Comments
                </button>
                <button className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium">
                  Enable Safe Mode
                </button>
              </div>
              <button className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium">
                Send SOS Email to Dev Friend
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
