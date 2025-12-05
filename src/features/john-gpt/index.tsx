import React, { useState, useEffect } from 'react';
import { JohnGPTDialog } from './components/JohnGPTDialog';
import { Sparkles, MessageCircle } from 'lucide-react';
import type { User as WorkOSUser } from '@workos-inc/node';
import { useActiveChatOptional } from './context/ActiveChatContext';

/**
 * JohnGPT AI Chat Feature Component
 *
 * Provides a floating action button that opens a chat dialog powered by
 * Google's Gemini AI model. Supports "Follow Me" mode where an active
 * conversation from the full JohnGPT page follows the user as a widget.
 *
 * @returns JSX element containing the chat feature with trigger button and dialog
 */
export const JohnGPTFeature = ({ user }: { user?: WorkOSUser | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeChat = useActiveChatOptional();
  const isFollowMeMode = activeChat?.isFollowMeActive ?? false;

  // Auto-show in follow-me mode (but minimized as pill)
  useEffect(() => {
    if (isFollowMeMode && !isOpen) {
      // Don't auto-open, but the button will pulse to indicate active chat
      console.log('[JohnGPTFeature] Follow-me mode active, conversation:', activeChat?.state.conversationId);
    }
  }, [isFollowMeMode, isOpen, activeChat?.state.conversationId]);

  return (
    <>
      {/* Floating trigger button - only on desktop, non-admin routes */}
      {/* Hidden when open to avoid clutter */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 hidden md:block ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className={`group relative flex items-center justify-center w-14 h-14 text-white rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${isFollowMeMode
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:shadow-emerald-500/25 ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-background'
              : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:shadow-blue-500/25'
            }`}
          aria-label={isFollowMeMode ? "Continue Active Chat" : "Open JohnGPT Chat"}
        >
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

          {isFollowMeMode ? (
            <MessageCircle className="w-6 h-6" />
          ) : (
            <Sparkles className="w-6 h-6 animate-pulse" />
          )}

          {/* Notification Badge - pulsing for follow-me mode */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isFollowMeMode ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isFollowMeMode ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          </span>

          {/* Follow-me mode label */}
          {isFollowMeMode && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-emerald-400 whitespace-nowrap">
              Active Chat
            </span>
          )}
        </button>
      </div>

      <JohnGPTDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        user={user}
        followMeConversationId={isFollowMeMode ? activeChat?.state.conversationId ?? undefined : undefined}
      />
    </>
  );
};

export default JohnGPTFeature;

