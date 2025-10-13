'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';
import type { NavItemConfig } from './MobileBottomNav';

// Import the newly installed animated icons
import { HouseIcon, HouseHandle as HouseIconHandle } from '@/components/ui/HouseIcon';
import { UserRoundIcon, UserRoundHandle as UserRoundIconHandle } from '@/components/ui/UserRoundIcon';
import { BlocksIcon, BlocksIconHandle } from '@/components/ui/BlocksIcon';
import { SparklesIcon, SparklesIconHandle } from '@/components/ui/SparklesIcon';
import { MailIcon, MailIconHandle } from '@/components/ui/MailIcon';

// Create a union type for all possible icon handles
type AnimatedIconHandle = HouseIconHandle | UserRoundIconHandle | BlocksIconHandle | SparklesIconHandle | MailIconHandle;

interface MobileNavItemProps {
  item: NavItemConfig;
  onTooltipChange: (tooltip: { isVisible: boolean; text: string }) => void;
  isActive?: boolean; // Allow parent to override active state for scroll spy
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ item, onTooltipChange, isActive: forcedActive }) => {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  // Use forced active state if provided (from scroll spy), otherwise use default logic
  const isActive = forcedActive !== undefined ? forcedActive :
    (pathname === '/' && item.href === '/') || (item.href !== '/' && pathname.startsWith(item.href));

  // 1. Create a ref for the animated icon
  const iconRef = useRef<AnimatedIconHandle>(null);

  const { onMouseDown, onMouseUp, onTouchStart, onTouchEnd, onClick } = useSmartNavigation({
    href: item.href,
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
    // Call the original handler from the smart navigation hook
    if ('touches' in e) {
      onTouchStart(e as React.TouchEvent);
    } else {
      onMouseDown(e as React.MouseEvent);
    }
  };

  // Handle home button click to scroll to top
  const handleHomeClick = (e: React.MouseEvent) => {
    if (item.href === '/' && pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onClick(e);
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
      default: return () => <div className="w-6 h-6" />;
    }
  }, [item.iconName]);

  const content = (
    <>
      <IconComponent
        ref={iconRef} // Assign the ref to the icon
        className={`w-6 h-6 transition-colors duration-200 ${
          isActive ? 'text-jstar-blue' : 'text-gray-600 dark:text-gray-400'
        }`}
      />
      <span className={`transition-colors duration-200 ${
        isActive ? 'text-jstar-blue font-semibold' : 'text-gray-700 dark:text-gray-200'
      }`}>
        {item.label}
      </span>
    </>
  );

  const commonClasses = "flex-1 flex flex-col items-center justify-center gap-1 text-center text-xs font-medium cursor-pointer p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-jstar-blue";

  // We now need to define the event handlers for both the button and the link
  const eventHandlers = {
      onMouseDown: handlePressStart,
      onMouseUp: onMouseUp,
      onTouchStart: handlePressStart,
      onTouchEnd: onTouchEnd,
      onClick: item.href === '/' && pathname === '/' ? handleHomeClick : onClick
  };

  if (isHomepage) {
    return (
      <button className={commonClasses} {...eventHandlers}>
        {content}
      </button>
    );
  }

  return (
    <Link href={item.href} className={commonClasses}>
      {content}
    </Link>
  );
};

export default MobileNavItem;
