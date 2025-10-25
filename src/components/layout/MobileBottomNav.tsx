'use client';

import React, { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import MobileNavItem from './MobileNavItem';
import Tooltip from '@/components/ui/Tooltip'; // Import Tooltip
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface NavItemConfig {
  href?: string; // Optional for action-only items
  label: string;
  iconName: string; // Corresponds to an icon in AnimatedIconsList.md
  isAction?: boolean; // For non-navigation actions like modals
  onClick?: () => void; // Direct click handler for action items
  onLongPress?: () => void; // Long press handler for action items
}

const navigationConfig: NavItemConfig[] = [
  { href: '/', label: 'Home', iconName: 'house' },
  { href: '/about', label: 'About', iconName: 'user-round' },
  { href: '/services', label: 'Services', iconName: 'sparkles' },
  { href: '/portfolio', label: 'Work', iconName: 'blocks' },
  { href: '/contact', label: 'Contact', iconName: 'mail' },
  {
    label: 'JohnGPT',
    iconName: 'brain',
    isAction: true,
    onClick: () => {
      // Tap action - will be handled in MobileNavItem component
      // This prevents any default link behavior
    },
    onLongPress: () => {
      // Long press action - will be handled in MobileNavItem component
      // This prevents any default link behavior
    }
  },
];

// Define section mappings for homepage scroll spy
const homepageSections = [
  { id: 'hero', href: '/' },
  { id: 'about', href: '/about' },
  { id: 'services', href: '/services' },
  { id: 'portfolio', href: '/portfolio' },
  { id: 'contact', href: '/contact' },
];

const MobileBottomNav = () => {
  const [activeTooltip, setActiveTooltip] = useState({ isVisible: false, text: '' });
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  // Use scroll spy only on homepage
  const activeSection = useScrollSpy({
    sections: isHomepage ? homepageSections : [],
    offset: 150, // Offset from top to trigger section change
  });

  // Determine which nav item should be active
  const getActiveItem = useMemo(() => {
    // Special handling for JohnGPT dashboard page
    if (pathname === '/john-gpt') {
      return 'john-gpt'; // Special identifier for JohnGPT
    }

    if (!isHomepage) {
      // On other pages, use pathname-based logic
      return navigationConfig.find(item =>
        item.href && item.href !== '/' && pathname.startsWith(item.href)
      )?.href || '/';
    }

    // On homepage, use scroll spy result
    return activeSection || '/';
  }, [pathname, isHomepage, activeSection]);

  return (
    <>
      {/* Position the tooltip above the nav bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 flex justify-center">
          <Tooltip isVisible={activeTooltip.isVisible} text={activeTooltip.text} />
      </div>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 z-50">
        <div className="max-w-md mx-auto h-full flex justify-around items-center px-2">
          {navigationConfig.map((item) => {
            // Special active state logic for JohnGPT since it's an action item without href
            const isItemActive = item.iconName === 'brain'
              ? getActiveItem === 'john-gpt'
              : getActiveItem === item.href;

            return (
              <MobileNavItem
                key={item.label}
                item={item}
                onTooltipChange={setActiveTooltip}
                isActive={isItemActive}
              />
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
