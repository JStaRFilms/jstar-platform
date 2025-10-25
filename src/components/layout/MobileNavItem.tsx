'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';
import { useLongPress } from '@/hooks/useLongPress';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { JohnGPTDialog } from '@/features/john-gpt/components/JohnGPTDialog';
import type { NavItemConfig } from './MobileBottomNav';

// Import the newly installed animated icons
import { HouseIcon, HouseHandle as HouseIconHandle } from '@/components/ui/HouseIcon';
import { UserRoundIcon, UserRoundHandle as UserRoundIconHandle } from '@/components/ui/UserRoundIcon';
import { BlocksIcon, BlocksIconHandle } from '@/components/ui/BlocksIcon';
import { SparklesIcon, SparklesIconHandle } from '@/components/ui/SparklesIcon';
import { MailIcon, MailIconHandle } from '@/components/ui/MailIcon';
import { BrainIcon, BrainHandle } from '@/components/ui/BrainIcon';

// Create a union type for all possible icon handles
type AnimatedIconHandle = HouseIconHandle | UserRoundIconHandle | BlocksIconHandle | SparklesIconHandle | MailIconHandle | BrainHandle;

interface MobileNavItemProps {
  item: NavItemConfig;
  onTooltipChange: (tooltip: { isVisible: boolean; text: string }) => void;
  isActive?: boolean; // Allow parent to override active state for scroll spy
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ item, onTooltipChange, isActive: forcedActive }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomepage = pathname === '/';

  // Use forced active state if provided (from scroll spy), otherwise use default logic
  // Special handling for JohnGPT - it's active if we're on john-gpt page or the page might be considered "active"
  const isActive = forcedActive !== undefined ? forcedActive :
    item.iconName === 'brain' ? pathname === '/john-gpt' :
    item.href ? (pathname === '/' && item.href === '/') || (item.href !== '/' && pathname.startsWith(item.href)) : false;

  // Check screen size for responsive behavior
  const isLargeScreen = useMediaQuery('(min-width: 414px)');

  // JohnGPT modal state
  const [isJohnGPTModalOpen, setIsJohnGPTModalOpen] = useState(false);

  // Special handling for JohnGPT long-press (nav to page) vs tap (open modal)
  const { isLongPressActive: isJohnGPTLongPressActive, ...longPressHandlers } = useLongPress({
    onLongPress: () => {
      // Long-press: navigate to JohnGPT dashboard page
      router.push('/john-gpt');
    },
    onTap: () => {
      // Tap: open JohnGPT modal
      setIsJohnGPTModalOpen(true);
    },
    delay: 500,
  });

  // For action items with callbacks, handle them with preventDefault/stopPropagation
  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.onClick) item.onClick();
  };

  const handleActionLongPress = () => {
    if (item.onLongPress) item.onLongPress();
  };

  // 1. Create a ref for the animated icon
  const iconRef = useRef<AnimatedIconHandle>(null);

  // Only use smart navigation for navigation items, not action items
  const smartNavHandlers = item.isAction ? {
    onMouseDown: () => {},
    onMouseUp: () => {},
    onTouchStart: () => {},
    onTouchEnd: () => {},
    onClick: () => {}
  } : useSmartNavigation({
    href: item.href || '#', // Use # as fallback for action items
    onTooltipChange: onTooltipChange,
    onScrollStart: () => {
      // Trigger motion blur when navigation starts scrolling
      if ((window as any).startScrollBlur) {
        (window as any).startScrollBlur();
      }
    },
  });

  // 2. Create a combined press handler to trigger animation
  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    iconRef.current?.startAnimation();
    // Call the smart navigation handler only for navigation items
    if (!item.href || item.isAction) return;
    if ('touches' in e) {
      smartNavHandlers.onTouchStart(e as React.TouchEvent);
    } else {
      smartNavHandlers.onMouseDown(e as React.MouseEvent);
    }
  };

  // Handle home button click to scroll to top
  const handleHomeClick = (e: React.MouseEvent) => {
    if (item.href === '/' && pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    smartNavHandlers.onClick(e);
  };

  // 3. Use useEffect to trigger animation when the item becomes active
  useEffect(() => {
    if (isActive) {
      // Use a small delay to ensure the animation is visible on page load/navigation
      const timer = setTimeout(() => {
        iconRef.current?.startAnimation();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const IconComponent = useMemo(() => {
    switch (item.iconName) {
      case 'house': return HouseIcon;
      case 'user-round': return UserRoundIcon;
      case 'blocks': return BlocksIcon;
      case 'sparkles': return SparklesIcon;
      case 'mail': return MailIcon;
      case 'brain': return BrainIcon;
      default: return () => <div className="w-6 h-6" />;
    }
  }, [item.iconName]);

  const content = (
    <>
      <IconComponent
        ref={iconRef} // Assign the ref to the icon
        className={`${isLargeScreen ? 'w-6 h-6' : 'w-5 h-5'} transition-colors duration-200 ${
          isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
        }`}
      />
      <span className={`transition-colors duration-200 ${isLargeScreen ? 'text-xs' : 'text-[0.65rem]'} ${
        isActive ? 'text-primary font-semibold' : 'text-gray-700 dark:text-gray-200'
      }`}>
        {item.label}
      </span>
    </>
  );

  const commonClasses = `flex-1 flex flex-col items-center justify-center gap-1 text-center font-medium cursor-pointer ${isLargeScreen ? 'p-1' : 'p-0.5'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isActive ? 'bg-primary/10' : ''}`;

  // Special handling for JohnGPT action button
  if (item.isAction) {
    return (
      <>
        <button
          className={commonClasses}
          {...longPressHandlers}
          onMouseDown={handlePressStart}
          onTouchStart={handlePressStart}
          aria-label={`${item.label} - Tap for chat, long press for dashboard`}
        >
          {content}
        </button>
        <JohnGPTDialog open={isJohnGPTModalOpen} onOpenChange={setIsJohnGPTModalOpen} />
      </>
    );
  }

  // We need to define the event handlers for both the button and the link
  const eventHandlers = {
      onMouseDown: handlePressStart,
      onMouseUp: smartNavHandlers.onMouseUp,
      onTouchStart: handlePressStart,
      onTouchEnd: smartNavHandlers.onTouchEnd,
      onClick: item.href === '/' && pathname === '/' ? handleHomeClick : smartNavHandlers.onClick
  };

  if (isHomepage) {
    return (
      <button className={commonClasses} {...eventHandlers}>
        {content}
      </button>
    );
  }

  return (
    <Link href={item.href!} className={commonClasses}>
      {content}
    </Link>
  );
};

export default MobileNavItem;
