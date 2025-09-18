'use client';

import React from 'react';
import { MigrationHeader } from '@/features/MigrationCenter/components/MigrationHeader';
import { DatabaseStatus } from '@/features/MigrationCenter/components/DatabaseStatus';
import { QuickStats } from '@/features/MigrationCenter/components/QuickStats';
import { MigrationWorkflow } from '@/features/MigrationCenter/components/MigrationWorkflow';
import { SchemaComparison } from '@/features/MigrationCenter/components/SchemaComparison';
import { MigrationHistory } from '@/features/MigrationCenter/components/MigrationHistory';
import { CurrentConfiguration } from '@/features/MigrationCenter/components/CurrentConfiguration';
import { TargetConfiguration } from '@/features/MigrationCenter/components/TargetConfiguration';
import { HybridModeConfig } from '@/features/MigrationCenter/components/HybridModeConfig';
import { EmergencyPanel } from '@/features/MigrationCenter/components/EmergencyPanel';

/**
 * Migration Center Page
 * Comprehensive database migration management interface
 * Allows running Prisma commands, switching databases, and managing migrations
 * Now integrated with the new navigation pattern
 */
export default function MigrationCenterPage() {
  return (
    <>
      {/* Database Status */}
      <DatabaseStatus />

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Migration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Migration Workflow */}
        <div className="lg:col-span-2 space-y-6">
          {/* Migration Workflow */}
          <MigrationWorkflow />

          {/* Schema Comparison */}
          <SchemaComparison />

          {/* Migration History */}
          <MigrationHistory />
        </div>

        {/* Right Column - Configuration Panels */}
        <div className="space-y-6">
          {/* Current Configuration */}
          <CurrentConfiguration />

          {/* Target Configuration */}
          <TargetConfiguration />

          {/* Hybrid Mode Configuration */}
          <HybridModeConfig />

          {/* Emergency Panel */}
          <EmergencyPanel />
        </div>
      </div>
    </>
  );
}
