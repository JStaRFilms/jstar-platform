'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConversationSidebar } from './ConversationSidebar';
import type { User as WorkOSUser } from '@workos-inc/node';
import { X } from 'lucide-react';

type MobileSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    user: WorkOSUser;
    isDriveConnected: boolean;
    activeConversationId?: string;
};

export function MobileSidebar({ isOpen, onClose, user, isDriveConnected, activeConversationId }: MobileSidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />

                    {/* Sidebar Container */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-xs bg-background shadow-2xl md:hidden flex flex-col"
                    >
                        <div className="absolute top-4 right-4 z-50">
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-background/80 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border border-border/50 backdrop-blur-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <ConversationSidebar
                            user={user}
                            isDriveConnected={isDriveConnected}
                            activeConversationId={activeConversationId}
                            className="w-full h-full border-r-0"
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
