import React, { useState } from 'react';
import { JohnGPTDialog } from './components/JohnGPTDialog';
import { Sparkles } from 'lucide-react';
import type { User as WorkOSUser } from '@workos-inc/node';

/**
 * JohnGPT AI Chat Feature Component
 *
 * Provides a floating action button that opens a chat dialog powered by
 * Google's Gemini AI model. Designed for admin users during Phase 1.
 *
 * @returns JSX element containing the chat feature with trigger button and dialog
 */
export const JohnGPTFeature = ({ user }: { user?: WorkOSUser | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating trigger button - only on desktop, non-admin routes */}
      {/* Hidden when open to avoid clutter */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 hidden md:block ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open JohnGPT Chat"
        >
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Sparkles className="w-6 h-6 animate-pulse" />

          {/* Notification Badge (Mock) */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
      </div>

      <JohnGPTDialog open={isOpen} onOpenChange={setIsOpen} user={user} />
    </>
  );
};

export default JohnGPTFeature;
