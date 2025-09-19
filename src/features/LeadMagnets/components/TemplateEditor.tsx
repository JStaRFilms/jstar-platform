'use client';

import React from 'react';

/**
 * TemplateEditor Component
 * Rich editor for creating and modifying email/SMS templates with live preview
 */
const TemplateEditor: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Template Editor</h2>
        <div className="flex space-x-2">
          <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option>Welcome Email</option>
            <option>Purchase Confirmation</option>
            <option>Lead Magnet Delivery</option>
            <option>Course Reminder</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="font-medium text-gray-900 dark:text-white mb-2">Template Metadata</div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Name</label>
                <input type="text" defaultValue="Welcome Email"
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-800 dark:text-white">
                  <option>Email</option>
                  <option>SMS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger Event</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-800 dark:text-white">
                  <option>User Registration</option>
                  <option>Purchase Completed</option>
                  <option>Course Enrollment</option>
                  <option>Course Reminder</option>
                  <option>Custom Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Delay</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-800 dark:text-white">
                  <option>Immediately</option>
                  <option>1 hour after event</option>
                  <option>24 hours after event</option>
                  <option>7 days after event</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="font-medium text-gray-900 dark:text-white mb-2">Email Content</div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Line</label>
                <input type="text" defaultValue="Welcome to J StaR Platform, {{first_name}}!"
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preheader Text</label>
                <input type="text" defaultValue="Your journey to creative excellence starts now"
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-admin-red focus:border-transparent dark:bg-gray-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Body</label>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="border-b border-gray-200 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">email-body.html</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Modified: 2h ago</span>
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 font-mono text-sm bg-gray-50 dark:bg-gray-700/50 h-64 overflow-y-auto">
                    <div className="container">
                      <h1>Hello {'{'}first_name{'}'},</h1>
                      <p>Welcome to J StaR Platform! We're excited to have you join our community of content creators.</p>
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
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="font-medium text-gray-900 dark:text-white mb-2">Email Preview</div>
            <div className="preview-email">
              <div className="email-header">
                <div className="font-bold text-white">J StaR Platform</div>
                <div className="text-sm opacity-90">Welcome to J StaR Platform, John!</div>
              </div>
              <div className="email-body">
                <h1 className="text-2xl font-bold mb-4">Hello John,</h1>
                <p className="mb-4">Welcome to J StaR Platform! We're excited to have you join our community of content creators.</p>
                <p className="mb-4">As a <span className="variable-highlight">Tier 1</span> member, you have access to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Premium content templates</li>
                  <li>JohnGPT AI assistant</li>
                  <li>CGE tools for content growth</li>
                </ul>
                <p className="mb-6">Your journey to <strong>Creative Vision and Technical Excellence</strong> starts now!</p>
                <div className="bg-admin-red text-white px-6 py-3 rounded-lg inline-block font-bold">
                  Get Started
                </div>
                <p className="mt-6">Best regards,<br />
                John Oluleke-Oke<br />
                Founder, J StaR Platform</p>
              </div>
              <div className="email-footer">
                <p>You're receiving this email because you signed up for J StaR Platform.</p>
                <p><a href="#" className="text-admin-red hover:underline">Unsubscribe</a> | <a href="#" className="text-admin-red hover:underline">Update preferences</a></p>
                <p>© 2024 J StaR Platform. All rights reserved.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium">
              Test Email
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced">
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
