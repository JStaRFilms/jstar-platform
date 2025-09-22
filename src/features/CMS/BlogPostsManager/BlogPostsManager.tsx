'use client';

import React from 'react';
import { BlogPostsList } from './components/BlogPostsList';

/**
 * BlogPostsManager Component
 * Main component that handles blog posts overview
 */
export const BlogPostsManager: React.FC = () => {
  // Handle navigation between views
  const handleNewPost = () => {
    // TODO: Implement new post creation
    console.log('New post creation not yet implemented');
  };

  const handleEditPost = (id: string) => {
    // TODO: Implement post editing
    console.log('Post editing not yet implemented', id);
  };

  return (
    <BlogPostsList
      onNewPost={handleNewPost}
      onEditPost={handleEditPost}
    />
  );
};
