'use client';

import { useState, useMemo } from 'react';

/**
 * Feature flag data structure
 */
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  tier: string;
  tierClass: string;
  status: 'enabled' | 'disabled' | 'partial';
  rolloutPercentage: number;
  createdDate: string;
  targetUsers: string;
}

/**
 * A/B test data structure
 */
export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'draft';
  statusClass: string;
  variantA: { name: string; metric: string };
  variantB: { name: string; metric: string };
  startedDate: string;
}

/**
 * Change history data structure
 */
export interface ChangeHistory {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
  userInitials: string;
}

/**
 * Custom hook for managing feature flags state
 * Handles search, filtering, and CRUD operations
 */
export const useFeatureFlags = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showCreatePanel, setShowCreatePanel] = useState(false);

  // Mock data - in real app this would come from API
  const [featureFlags] = useState<FeatureFlag[]>([
    {
      id: 'youtube-virality-os',
      name: 'YouTube Virality OS',
      description: 'Full YouTube analytics suite',
      tier: 'Tier 2+',
      tierClass: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      status: 'enabled',
      rolloutPercentage: 100,
      createdDate: 'June 10, 2024',
      targetUsers: 'Tier 2+ users'
    },
    {
      id: 'client-magnet-pro',
      name: 'Client Magnet Pro',
      description: 'Advanced lead generation system',
      tier: 'Tier 3',
      tierClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      status: 'partial',
      rolloutPercentage: 30,
      createdDate: 'June 5, 2024',
      targetUsers: 'Tier 3 users'
    },
    {
      id: 'scripting-studio-canvas',
      name: 'Scripting Studio Canvas',
      description: 'Visual workflow editor for scripts',
      tier: 'All Users',
      tierClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      status: 'disabled',
      rolloutPercentage: 0,
      createdDate: 'May 28, 2024',
      targetUsers: 'All users'
    },
    {
      id: 'ai-voice-cloning',
      name: 'AI Voice Cloning',
      description: 'Beta voice generation feature',
      tier: 'Internal',
      tierClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      status: 'partial',
      rolloutPercentage: 15,
      createdDate: 'June 1, 2024',
      targetUsers: 'Admin users'
    }
  ]);

  const [abTests] = useState<ABTest[]>([
    {
      id: 'johngpt-persona-selector',
      name: 'JohnGPT Persona Selector',
      description: 'Testing two different UI layouts',
      status: 'running',
      statusClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      variantA: { name: 'Card Layout', metric: '+12.4% engagement' },
      variantB: { name: 'Dropdown Layout', metric: 'Baseline' },
      startedDate: 'June 8, 2024'
    },
    {
      id: 'scripting-studio-ui',
      name: 'Scripting Studio UI',
      description: 'Testing canvas vs split-view interface',
      status: 'draft',
      statusClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      variantA: { name: 'Canvas Mode', metric: '' },
      variantB: { name: 'Split View', metric: '' },
      startedDate: 'June 15, 2024'
    }
  ]);

  const [changeHistory] = useState<ChangeHistory[]>([
    {
      id: '1',
      action: 'YouTube Virality OS - Rollout increased',
      details: 'From 75% to 100% of Tier 2+ users',
      timestamp: 'Today, 2:45 PM',
      user: 'John Oluleke-Oke',
      userInitials: 'JO'
    },
    {
      id: '2',
      action: 'Scripting Studio Canvas - Disabled',
      details: 'Rollout set to 0% for all users',
      timestamp: 'June 14, 2024',
      user: 'John Oluleke-Oke',
      userInitials: 'JO'
    },
    {
      id: '3',
      action: 'Client Magnet Pro - Rollout increased',
      details: 'From 15% to 30% of Tier 3 users',
      timestamp: 'June 12, 2024',
      user: 'John Oluleke-Oke',
      userInitials: 'JO'
    }
  ]);

  // Computed values
  const filteredFlags = useMemo(() => {
    return featureFlags.filter(flag => {
      const matchesSearch = flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           flag.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = statusFilter === 'All Statuses' ||
                           (statusFilter === 'Enabled' && flag.status === 'enabled') ||
                           (statusFilter === 'Disabled' && flag.status === 'disabled') ||
                           (statusFilter === 'Partial Rollout' && flag.status === 'partial');

      return matchesSearch && matchesFilter;
    });
  }, [featureFlags, searchTerm, statusFilter]);

  // Stats calculations
  const stats = useMemo(() => {
    const total = featureFlags.length;
    const inDevelopment = featureFlags.filter(f => f.status === 'partial').length;
    const fullyDeployed = featureFlags.filter(f => f.status === 'enabled').length;
    const needsRollback = featureFlags.filter(f => f.status === 'disabled').length;

    return { total, inDevelopment, fullyDeployed, needsRollback };
  }, [featureFlags]);

  // Action handlers
  const handleCreateFeature = () => {
    setShowCreatePanel(true);
  };

  const handleEditFlag = (id: string) => {
    console.log('Edit flag:', id);
    // TODO: Implement edit functionality
  };

  const handleRollbackFlag = (id: string) => {
    console.log('Rollback flag:', id);
    // TODO: Implement rollback functionality
  };

  const handleCloseCreatePanel = () => {
    setShowCreatePanel(false);
  };

  return {
    // State
    searchTerm,
    statusFilter,
    showCreatePanel,
    featureFlags: filteredFlags,
    abTests,
    changeHistory,

    // Stats
    stats,

    // Actions
    setSearchTerm,
    setStatusFilter,
    handleCreateFeature,
    handleEditFlag,
    handleRollbackFlag,
    handleCloseCreatePanel
  };
};
