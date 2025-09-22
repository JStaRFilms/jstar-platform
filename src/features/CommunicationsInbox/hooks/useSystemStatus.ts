'use client';

import { useState, useEffect, useCallback } from 'react';
import { SystemStatusData, SystemMetrics } from '../types';

/**
 * Custom hook for managing system status and real-time monitoring
 * Provides live data for system metrics, precision tracking, and status indicators
 */
export const useSystemStatus = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatusData>({
    contactFormActive: true,
    autoResponderActive: true,
    lastSubmissionTime: '15 min ago',
    systemLoad: 99.743,
    precisionLevel: 85.714,
    totalSubmissions: 1247,
    pendingCount: 23,
    processedCount: 456,
    respondedCount: 678,
    archivedCount: 90,
  });

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    averageResponseTime: '2h 34m',
    responseRate: 87.5,
    autoResponseRate: 92.3,
    manualResponseRate: 78.1,
    peakHours: ['9:00 AM', '2:00 PM', '7:00 PM'],
    commonServices: [
      { service: 'Video Production', count: 345, percentage: 27.7 },
      { service: 'Photography', count: 289, percentage: 23.2 },
      { service: 'Consultation', count: 198, percentage: 15.9 },
      { service: 'Other', count: 415, percentage: 33.2 },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Simulate real-time updates
  const updateSystemStatus = useCallback(() => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const now = new Date();
      const timeDiff = Math.floor(Math.random() * 300) + 60; // 1-6 minutes ago
      const lastSubmission = new Date(now.getTime() - timeDiff * 1000);

      setSystemStatus(prev => ({
        ...prev,
        lastSubmissionTime: `${Math.floor(timeDiff / 60)} min ${timeDiff % 60} sec ago`,
        systemLoad: Math.max(95, Math.min(99.9, prev.systemLoad + (Math.random() - 0.5) * 0.1)),
        precisionLevel: Math.max(80, Math.min(95, prev.precisionLevel + (Math.random() - 0.5) * 0.2)),
        pendingCount: Math.max(0, prev.pendingCount + Math.floor(Math.random() * 6) - 3),
      }));

      setSystemMetrics(prev => ({
        ...prev,
        averageResponseTime: `${Math.floor(Math.random() * 4) + 1}h ${Math.floor(Math.random() * 60)}m`,
        responseRate: Math.max(80, Math.min(95, prev.responseRate + (Math.random() - 0.5) * 2)),
        autoResponseRate: Math.max(85, Math.min(98, prev.autoResponseRate + (Math.random() - 0.5) * 1)),
        manualResponseRate: Math.max(70, Math.min(90, prev.manualResponseRate + (Math.random() - 0.5) * 2)),
      }));

      setLastUpdated(now);
      setIsLoading(false);
    }, 500);
  }, []);

  // Set up real-time updates
  useEffect(() => {
    // Initial update
    updateSystemStatus();

    // Update every 30 seconds
    const interval = setInterval(updateSystemStatus, 30000);

    return () => clearInterval(interval);
  }, [updateSystemStatus]);

  // Manual refresh function
  const refreshStatus = useCallback(() => {
    updateSystemStatus();
  }, [updateSystemStatus]);

  // Calculate system health score
  const getSystemHealthScore = useCallback(() => {
    const { systemLoad, precisionLevel } = systemStatus;
    const { responseRate, autoResponseRate } = systemMetrics;

    // Weighted calculation
    const loadScore = (systemLoad / 100) * 30; // 30% weight
    const precisionScore = (precisionLevel / 100) * 25; // 25% weight
    const responseScore = (responseRate / 100) * 25; // 25% weight
    const autoResponseScore = (autoResponseRate / 100) * 20; // 20% weight

    return Math.round(loadScore + precisionScore + responseScore + autoResponseScore);
  }, [systemStatus, systemMetrics]);

  // Get status indicator color based on health score
  const getStatusColor = useCallback(() => {
    const healthScore = getSystemHealthScore();

    if (healthScore >= 85) return 'status-active'; // Green
    if (healthScore >= 70) return 'status-warning'; // Yellow
    return 'status-critical'; // Red
  }, [getSystemHealthScore]);

  return {
    systemStatus,
    systemMetrics,
    isLoading,
    lastUpdated,
    refreshStatus,
    getSystemHealthScore,
    getStatusColor,
  };
};
