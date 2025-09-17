import { useState, useEffect } from 'react';

/**
 * TypeScript interface for Hero Slide data
 */
export interface HeroSlide {
  id: string;
  titleLine1: string;
  titleLine2: string;
  tagline: string;
  description: string;
  imageUrl: string;
  gradient: string;
  buttonGradient: string;
  buttonBorder: string;
  buttonText: string;
  buttonHover: string;
  isActive: boolean;
  sortOrder: number;
  altText?: string;
  projectTitle?: string;
  projectDesc?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Custom hook for managing hero slides data
 * Handles fetching, caching, and state management for hero slides
 */
export const useHeroSlides = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch slides from the API
   */
  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/hero-slides');

      if (!response.ok) {
        throw new Error(`Failed to fetch slides: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setSlides(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch slides');
      }
    } catch (err) {
      console.error('Error fetching hero slides:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');

      // Fallback to default slides if API fails
      setSlides([
        {
          id: 'default-1',
          titleLine1: 'Elevate Your Story',
          titleLine2: 'With Purpose & Excellence',
          tagline: 'Creative Vision, Technical Excellence',
          description: 'Transform your ideas into compelling visual stories that resonate with audiences and reflect your values.',
          imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
          gradient: 'from-blue-500 to-purple-600',
          buttonGradient: 'from-blue-500 to-purple-600',
          buttonBorder: 'border-blue-500',
          buttonText: 'text-white',
          buttonHover: 'hover:bg-blue-600',
          isActive: true,
          sortOrder: 1,
          altText: 'Video Production',
          projectTitle: 'Latest Project',
          projectDesc: 'Brand Storytelling for Tech Startup',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'default-2',
          titleLine1: 'Where Faith Meets',
          titleLine2: 'Creative Excellence',
          tagline: 'Faith-based filmmaking',
          description: 'Creating impactful content that inspires and connects communities through authentic storytelling.',
          imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
          gradient: 'from-purple-500 to-pink-600',
          buttonGradient: 'from-purple-500 to-pink-600',
          buttonBorder: 'border-purple-500',
          buttonText: 'text-white',
          buttonHover: 'hover:bg-purple-600',
          isActive: true,
          sortOrder: 2,
          altText: 'Faith-based Content Creation',
          projectTitle: 'Community Project',
          projectDesc: 'Documentary series for local church',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new slide
   */
  const createSlide = async (slideData: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create slide: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Refresh slides list
        await fetchSlides();
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create slide');
      }
    } catch (err) {
      console.error('Error creating slide:', err);
      throw err;
    }
  };

  /**
   * Update an existing slide
   */
  const updateSlide = async (id: string, slideData: Partial<HeroSlide>) => {
    try {
      const response = await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update slide: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Refresh slides list
        await fetchSlides();
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update slide');
      }
    } catch (err) {
      console.error('Error updating slide:', err);
      throw err;
    }
  };

  /**
   * Delete a slide (soft delete)
   */
  const deleteSlide = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete slide: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Refresh slides list
        await fetchSlides();
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete slide');
      }
    } catch (err) {
      console.error('Error deleting slide:', err);
      throw err;
    }
  };

  // Fetch slides on mount
  useEffect(() => {
    fetchSlides();
  }, []);

  return {
    slides,
    loading,
    error,
    refetch: fetchSlides,
    createSlide,
    updateSlide,
    deleteSlide,
  };
};
