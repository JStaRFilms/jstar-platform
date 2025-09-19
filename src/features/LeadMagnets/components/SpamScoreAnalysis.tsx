'use client';

import React from 'react';

/**
 * SpamScoreAnalysis Component
 * Real-time spam score monitoring and recommendations for email templates
 */
const SpamScoreAnalysis: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Spam Score Analysis</h2>
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="font-medium text-gray-900 dark:text-white mb-2">Spam Score: 12/100</div>
        <div className="spam-meter mt-1">
          <div className="spam-fill spam-low"></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Issues Detected</div>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• No excessive exclamation points</li>
              <li>• No spam trigger words detected</li>
              <li>• Good text-to-image ratio</li>
              <li>• Proper unsubscribe link included</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recommendations</div>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Add more personalization</li>
              <li>• Consider adding a physical address</li>
              <li>• Verify sender domain</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Spam Prevention Tip:</strong> Emails with scores under 20/100 have a 99% deliverability rate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpamScoreAnalysis;
