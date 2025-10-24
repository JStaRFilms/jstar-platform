'use client';

import React from 'react';

/**
 * LocalizationManager Component
 * Multi-language template support with translation management
 */
const LocalizationManager: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Localization Manager</h2>
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="font-medium text-gray-900 dark:text-white mb-3">Language Versions</div>
        <div className="language-switcher mb-4">
          <button className="active">English</button>
          <button>Yoruba</button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Line</label>
            <input type="text" defaultValue="Welcome to J StaR Platform, {{first_name}}!"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-800 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Body</label>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <div className="p-4 font-mono text-sm bg-gray-50 dark:bg-gray-700/50 h-48 overflow-y-auto">
                <div className="container">
                  <h1>Hello {'{'}first_name{'}'},</h1>
                  <p>Welcome to J StaR Platform! We&apos;re excited to have you join our community of content creators.</p>
                  <p>As a {'{'}user_tier{'}'} member, you have access to:</p>
                  <ul>
                    <li>Premium content templates</li>
                    <li>JohnGPT AI assistant</li>
                    <li>CGE tools for content growth</li>
                  </ul>
                  <p>Your journey to <strong>Creative Vision and Technical Excellence</strong> starts now!</p>
                  <div className="cta-button">
                    <a href="{'{'}course_url{'}'}">Get Started</a>
                  </div>
                  <p>Best regards,<br />
                  John Oluleke-Oke<br />
                  Founder, J StaR Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium">
            Copy from English
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced">
            Save Localization
          </button>
        </div>
      </div>
    </div>);

};

export default LocalizationManager;