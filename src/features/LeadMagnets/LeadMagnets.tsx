'use client';

import React, { useState } from 'react';
import LeadMagnetsHeader from './components/LeadMagnetsHeader';
import SystemStatus from './components/SystemStatus';
import QuickStats from './components/QuickStats';
import TemplateSelection from './components/TemplateSelection';
import DynamicVariables from './components/DynamicVariables';
import TemplateEditor from './components/TemplateEditor';
import SpamScoreAnalysis from './components/SpamScoreAnalysis';
import LocalizationManager from './components/LocalizationManager';
import TemplateAnalytics from './components/TemplateAnalytics';
import EmergencyPanel from './components/EmergencyPanel';

/**
 * LeadMagnets Component
 * Main component for the Lead Magnets management interface
 * Provides comprehensive email/SMS template management with analytics and localization
 */
const LeadMagnets: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('welcome-email');
  const [searchQuery, setSearchQuery] = useState('');

  // Event handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSave = () => {
    console.log('Saving template...');
    // In a real implementation, this would save the template
  };

  const handleVariableClick = (variable: string) => {
    console.log('Inserting variable:', variable);
    // In a real implementation, this would insert the variable into the editor
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <LeadMagnetsHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSave={handleSave}
      />

      {/* System Status */}
      <SystemStatus />

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Template Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Template Management */}
        <div className="space-y-6">
          <TemplateSelection />
          <DynamicVariables onVariableClick={handleVariableClick} />
          <TemplateAnalytics />
        </div>

        {/* Middle Column - Template Editor */}
        <div className="lg:col-span-2 space-y-6">
          <TemplateEditor />

          {/* Spam Score & Localization */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpamScoreAnalysis />
              <LocalizationManager />
            </div>
          </div>
        </div>

        {/* Right Column - Emergency Tools */}
        <div className="space-y-6">
          <EmergencyPanel />
        </div>
      </div>
    </div>
  );
};

export default LeadMagnets;
