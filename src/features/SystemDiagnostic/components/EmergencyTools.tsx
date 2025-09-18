'use client';

import React, { useState } from 'react';

const EmergencyTools: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleEmergencyAction = async (action: string) => {
    try {
      setLoading(action);

      switch (action) {
        case 'send-report':
          await sendEmergencyReport();
          break;

        case 'optimize-resources':
          await optimizeForLowResources();
          break;

        case 'restart-ai':
          await restartAI();
          break;

        case 'lite-mode':
          await switchToLiteMode();
          break;

        default:
          console.error('Unknown emergency action:', action);
      }
    } catch (error) {
      console.error(`Emergency action "${action}" failed:`, error);
      // You could show a toast notification here
    } finally {
      setLoading(null);
    }
  };

  const sendEmergencyReport = async () => {
    try {
      const response = await fetch('/api/admin/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'send-report' }),
      });

      if (response.ok) {
        // The API returns a CSV file for download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Get filename from response headers
        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : `emergency-system-report-${new Date().toISOString().split('T')[0]}.csv`;

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        console.log('Emergency report downloaded successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate emergency report');
      }
    } catch (error) {
      console.error('Error sending emergency report:', error);
      throw error;
    }
  };

  const optimizeForLowResources = async () => {
    try {
      const response = await fetch('/api/admin/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'optimize-resources' }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Resource optimization completed:', data);

        // Show success message with results
        const recommendations = data.data.recommendations && data.data.recommendations.length > 0
          ? `\n\nRecommendations:\n${data.data.recommendations.join('\n')}`
          : '';

        alert(`System Resource Optimization Completed!\n\n${data.data.summary}${recommendations}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to optimize system resources');
      }
    } catch (error) {
      console.error('Error optimizing resources:', error);
      alert(`Resource Optimization Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const restartAI = async () => {
    try {
      const response = await fetch('/api/admin/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'restart-ai' }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('AI restart completed:', data);

        // Show success message
        alert(`AI Restart Completed!\n\n${data.data.summary}\n\nPlatform: ${data.data.platform}\nServices Attempted: ${data.data.restartAttempts.length}\nServices Running: ${data.data.healthChecks.filter((h: any) => h.status === 'running').length}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to restart AI services');
      }
    } catch (error) {
      console.error('Error restarting AI:', error);
      alert(`AI Restart Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const switchToLiteMode = async () => {
    try {
      const response = await fetch('/api/admin/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'switch-lite-mode' }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Lite mode activation completed:', data);

        // Show success message with results
        const recommendations = data.data.recommendations && data.data.recommendations.length > 0
          ? `\n\nRecommendations:\n${data.data.recommendations.join('\n')}`
          : '';

        alert(`Lite Mode Activated!\n\n${data.data.summary}${recommendations}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to switch to lite mode');
      }
    } catch (error) {
      console.error('Error switching to lite mode:', error);
      alert(`Lite Mode Activation Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  return (
    <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 shadow-lg border border-red-200 dark:border-red-800">
      <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">Emergency Tools</h2>
      <div className="space-y-3">
        <p className="text-sm text-red-800 dark:text-red-200">
          Critical functions for immediate system recovery and maintenance.
        </p>
        <button
          onClick={() => handleEmergencyAction('optimize-resources')}
          disabled={loading !== null}
          className="w-full px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading === 'optimize-resources' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent"></div>
              Optimizing...
            </>
          ) : (
            'ONE BUTTON: Optimize for Low Resources'
          )}
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEmergencyAction('restart-ai')}
            disabled={loading !== null}
            className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading === 'restart-ai' ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border border-red-500 border-t-transparent"></div>
                Restarting...
              </>
            ) : (
              'Force Restart AI'
            )}
          </button>
          <button
            onClick={() => handleEmergencyAction('lite-mode')}
            disabled={loading !== null}
            className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading === 'lite-mode' ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border border-red-500 border-t-transparent"></div>
                Switching...
              </>
            ) : (
              'Switch to Lite Mode'
            )}
          </button>
        </div>
        <button
          onClick={() => handleEmergencyAction('send-report')}
          disabled={loading !== null}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading === 'send-report' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border border-red-500 border-t-transparent"></div>
              Generating Report...
            </>
          ) : (
            'Send System Report to Dev Friend'
          )}
        </button>
      </div>
    </div>
  );
};

export default EmergencyTools;
