'use client';

import React, { useState, useEffect } from 'react';

/**
 * Quick Stats Component
 * Displays key platform metrics and statistics
 */
export const QuickStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalSlides: 0,
    activeSlides: 0,
    totalUsers: 0,
    totalProjects: 0,
    loading: true
  });

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch hero slides stats
        const slidesResponse = await fetch('/api/admin/hero-slides');
        const slidesData = await slidesResponse.json();

        if (slidesData.status === 'success') {
          const slides = slidesData.data || [];
          const activeSlides = slides.filter((slide: any) => slide.isActive).length;

          setStats({
            totalSlides: slides.length,
            activeSlides,
            totalUsers: 1, // Placeholder for future user system
            totalProjects: 0, // Placeholder for future project system
            loading: false
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      label: 'Total Slides',
      value: stats.loading ? '...' : stats.totalSlides.toString(),
      icon: '🎨',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      description: 'Hero slides in system'
    },
    {
      label: 'Active Slides',
      value: stats.loading ? '...' : stats.activeSlides.toString(),
      icon: '✅',
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      description: 'Currently displayed'
    },
    {
      label: 'Total Users',
      value: stats.loading ? '...' : stats.totalUsers.toString(),
      icon: '👥',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      description: 'Registered users'
    },
    {
      label: 'Projects',
      value: stats.loading ? '...' : stats.totalProjects.toString(),
      icon: '📁',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      description: 'Active projects'
    }
  ];

  return (
    <section className="mb-6 sm:mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <span className="text-lg" role="img" aria-label={item.label}>
                  {item.icon}
                </span>
              </div>
              <div className={`text-2xl sm:text-3xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                {item.label}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
