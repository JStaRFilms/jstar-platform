'use client';

import { useState, useEffect } from 'react';

/**
 * Interface for hero slide data from the database
 */
interface DatabaseHeroSlide {
  id: string;
  titleLine1: string;
  titleLine2: string;
  tagline: string;
  description: string;
  image?: string; // For compatibility with component interface
  imageUrl: string;
  gradient: string;
  buttonGradient: string;
  buttonBorder: string;
  buttonText: string;
  buttonHover: string;
  isActive: boolean;
  altText?: string;
  projectTitle?: string;
  projectDesc?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for the API response
 */
interface HeroSlidesResponse {
  status: 'success' | 'error';
  data?: DatabaseHeroSlide[];
  message?: string;
}

/**
 * Custom hook for fetching and managing hero slides
 * Falls back to default slides if API fails
 */
export const useHeroSlides = () => {
  const [slides, setSlides] = useState<DatabaseHeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default fallback slides
  const defaultSlides: DatabaseHeroSlide[] = [
    {
      id: 'default-0',
      titleLine1: 'Elevate Your Story',
      titleLine2: 'With Purpose & Excellence',
      tagline: 'Creative Vision, Technical Excellence',
      description: 'Transform your ideas into stunning visual experiences with professional video production, custom app development, and AI-powered creator tools.',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      gradient: 'from-primary to-accent',
      buttonGradient: 'from-primary to-accent',
      buttonBorder: 'border-primary dark:border-accent',
      buttonText: 'text-primary dark:text-accent',
      buttonHover: 'hover:bg-primary/10 dark:hover:bg-accent/10',
      isActive: true,
      altText: 'Video Production',
      projectTitle: 'Latest Project',
      projectDesc: 'Brand Storytelling for Tech Startup',
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'default-1',
      titleLine1: 'Where Faith Meets',
      titleLine2: 'Innovation & Creativity',
      tagline: 'Faith-Driven Creative Solutions',
      description: 'Empowering creators and businesses with purpose-driven content and technology solutions that make a lasting impact.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      gradient: 'from-jstar-blue to-faith-purple',
      buttonGradient: 'from-jstar-blue to-faith-purple',
      buttonBorder: 'border-jstar-blue dark:border-faith-purple',
      buttonText: 'text-jstar-blue dark:text-faith-purple',
      buttonHover: 'hover:bg-jstar-blue/10 dark:hover:bg-faith-purple/10',
      isActive: true,
      altText: 'Creative Solutions',
      projectTitle: 'Faith-Driven Content',
      projectDesc: 'Purposeful Storytelling',
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/hero-slides');
        const result: HeroSlidesResponse = await response.json();

        if (result.status === 'success' && result.data && result.data.length > 0) {
          setSlides(result.data);
        } else {
          // Use default slides if no data or API fails
          console.warn('Using default hero slides:', result.message || 'No slides found');
          setSlides(defaultSlides);
        }
      } catch (err) {
        console.error('Error fetching hero slides:', err);
        setError('Failed to load hero slides');
        // Use default slides as fallback
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  return {
    slides,
    loading,
    error,
    refetch: () => {
      // Re-fetch slides (could be called after admin updates)
      window.location.reload();
    },
  };
};
