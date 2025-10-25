import React, { useState } from 'react';
import { JohnGPTDialog } from './components/JohnGPTDialog';
import { MessageCircle } from 'lucide-react';

/**
 * JohnGPT AI Chat Feature Component
 *
 * Provides a floating action button that opens a chat dialog powered by
 * Google's Gemini AI model. Designed for admin users during Phase 1.
 *
 * @returns JSX element containing the chat feature with trigger button and dialog
 */
export const JohnGPTFeature = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating trigger button - only on desktop, non-admin routes */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 hidden md:flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors group"
        aria-label="Open JohnGPT Chat"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <JohnGPTDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default JohnGPTFeature;
