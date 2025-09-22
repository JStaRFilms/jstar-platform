'use client';

import React from 'react';
import { BlogPostsManager } from '@/features/CMS/BlogPostsManager/BlogPostsManager';

/**
 * Blog Posts Management Page
 * Handles both overview/list view and editor view for blog posts
 */
export default function BlogPostsPage() {
  return <BlogPostsManager />;
}
