'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BlogPostsList } from './components/BlogPostsList';
import { BlogEditor } from '../BlogEditor/BlogEditor';

/**
 * BlogPostsManager Component
 * Main component that handles both blog posts overview and editor views
 */
export const BlogPostsManager: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Determine current view mode from URL params
  const action = searchParams.get('action');
  const postId = searchParams.get('id');
  const isEditing = action === 'new' || postId !== null;

  // Handle navigation between views
  const handleNewPost = () => {
    router.push('/admin/cms/blog-posts?action=new');
  };

  const handleEditPost = (id: string) => {
    router.push(`/admin/cms/blog-posts?id=${id}`);
  };

  const handleBackToList = () => {
    router.push('/admin/cms/blog-posts');
  };

  if (isEditing) {
    return (
      <div className="relative">
        {/* Back to List Button */}
        <div className="mb-6">
          <button
            onClick={handleBackToList}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Posts
          </button>
        </div>

        {/* Editor */}
        <BlogEditor />
      </div>
    );
  }

  return (
    <BlogPostsList
      onNewPost={handleNewPost}
      onEditPost={handleEditPost}
    />
  );
};
