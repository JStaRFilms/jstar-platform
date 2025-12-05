import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Check, MousePointer2, Navigation } from 'lucide-react';

// --- Types ---
export interface LoginActionProps {
    requiredTier: string;
    targetUrl: string;
    pageTitle?: string;
    message?: string;
}

export interface NavigationPreviewProps {
    url: string;
    title: string;
    message?: string;
    timestamp?: Date | number;
}

export interface SectionScrollPreviewProps {
    sectionId: string;
    sectionTitle?: string;
    message?: string;
}

export interface NavigateAndScrollPreviewProps {
    url: string;
    pageTitle: string;
    sectionId: string;
    sectionTitle?: string;
    message?: string;
}

// --- Components ---

/**
 * Component shown when a user tries to access a restricted page.
 * Provides a direct login button that redirects back to the target.
 */
export function LoginActionComponent({ requiredTier, targetUrl, pageTitle, message }: LoginActionProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-3 p-4 my-2 bg-accent-purple/10 rounded-xl border border-accent-purple/20">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-accent-purple/20 rounded-full">
                    <Lock className="w-4 h-4 text-accent-purple" />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">Access Restricted</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                        {message || `The ${pageTitle || 'requested'} page requires ${requiredTier} access.`}
                    </p>
                </div>
            </div>

            <Button
                onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(targetUrl)}`)}
                className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white text-xs h-8"
            >
                Log in to Continue
            </Button>
        </div>
    );
}

/**
 * Component shown as a visual indicator for navigation actions.
 * Navigation is now triggered at the hook level (useBranchingChat.onFinish),
 * so this component only displays status - no side effects.
 */
export function NavigationPreview({ url, title, message }: NavigationPreviewProps) {
    const pathname = usePathname();

    // Determine display status based on current location
    const targetPath = url.startsWith('http') ? new URL(url).pathname : url;
    const isCompleted = pathname === targetPath ||
        (targetPath !== '/' && pathname.endsWith(targetPath));

    if (isCompleted) {
        return (
            <div className="flex items-center gap-2 text-sm text-green-500 my-2">
                <Check className="w-4 h-4" />
                <span>Navigated to {title}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-sm text-accent-blue my-2 animate-pulse">
            <ArrowRight className="w-4 h-4" />
            <span>{message || `Navigating to ${title}...`}</span>
        </div>
    );
}

/**
 * Component shown when scrolling to a section on the current page.
 */
export function SectionScrollPreview({ sectionId, sectionTitle, message }: SectionScrollPreviewProps) {
    const displayTitle = sectionTitle || sectionId.replace('-section', '').replace(/-/g, ' ');

    return (
        <div className="flex items-center gap-2 text-sm text-emerald-500 my-2">
            <MousePointer2 className="w-4 h-4" />
            <span>{message || `Scrolling to ${displayTitle}...`}</span>
        </div>
    );
}

/**
 * Component shown when navigating to a page AND scrolling to a section.
 */
export function NavigateAndScrollPreview({ url, pageTitle, sectionId, sectionTitle, message }: NavigateAndScrollPreviewProps) {
    const pathname = usePathname();
    const displaySection = sectionTitle || sectionId.replace('-section', '').replace(/-/g, ' ');

    // Determine display status based on current location
    const targetPath = url.startsWith('http') ? new URL(url).pathname : url;
    const isCompleted = pathname === targetPath ||
        (targetPath !== '/' && pathname.endsWith(targetPath));

    if (isCompleted) {
        return (
            <div className="flex items-center gap-2 text-sm text-green-500 my-2">
                <Check className="w-4 h-4" />
                <span>Showing {displaySection} on {pageTitle}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-sm text-accent-blue my-2 animate-pulse">
            <Navigation className="w-4 h-4" />
            <span>{message || `Taking you to ${displaySection} on ${pageTitle}...`}</span>
        </div>
    );
}

