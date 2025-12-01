
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon, CloseIcon, SunIcon, MoonIcon, UserIcon, VideoCameraIcon, FilmIcon, PenFancyIcon, GiftIcon, EnvelopeIcon } from '@/components/icons';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';
import Tooltip from '@/components/ui/Tooltip';

/**
 * Navigation item interface for type safety
 */
interface NavigationItem {
  /** Navigation link href */
  href: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon: React.ElementType;
  /** Whether link opens in new tab */
  external?: boolean;
}

/**
 * Theme mode type
 */
type ThemeMode = 'light' | 'dark';

/**
 * Mobile menu state interface
 */
interface MobileMenuState {
  /** Whether mobile menu is open */
  isOpen: boolean;
  /** Animation state for smooth transitions */
  isAnimating: boolean;
}

/**
 * Premium Glassmorphism Header with Cinematic Mobile Menu
 *
 * Features:
 * - Ultra-compact single-line header design
 * - Premium glassmorphism aesthetic
 * - Right-sliding cinematic mobile menu (75-80% width)
 * - JohnGPT button moved to mobile sidebar
 * - Enhanced typography and interactivity
 * - WCAG 2.1 AA compliant accessibility
 */
interface HeaderProps {
  authButton?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ authButton }) => {
  // Theme state with proper typing
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Mobile menu state
  const [mobileMenu, setMobileMenu] = useState<MobileMenuState>({
    isOpen: false,
    isAnimating: false
  });



  // Get current pathname for active link highlighting
  const pathname = usePathname();

  // Navigation items configuration
  const navigationItems: NavigationItem[] = useMemo(() => [
    { href: '/about', label: 'About', icon: UserIcon },
    { href: '/services', label: 'Services', icon: VideoCameraIcon },
    { href: '/portfolio', label: 'Portfolio', icon: FilmIcon },
    { href: '/blog', label: 'Blog', icon: PenFancyIcon },
    { href: '/store', label: 'Store', icon: GiftIcon },
    { href: '/contact', label: 'Contact', icon: EnvelopeIcon }
  ], []);

  /**
   * Initialize theme from localStorage or system preference
   */
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme: ThemeMode = savedTheme || (systemPrefersDark ? 'dark' : 'light');

      setTheme(initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
      setIsThemeLoaded(true);
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
      setIsThemeLoaded(true);
    }
  }, []);

  /**
   * Toggle theme with error handling
   */
  const toggleTheme = useCallback(() => {
    try {
      const newTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    }
  }, [theme]);



  /**
   * Toggle mobile menu with animation state
   */
  const toggleMobileMenu = useCallback(() => {
    setMobileMenu(prev => ({
      isOpen: !prev.isOpen,
      isAnimating: true
    }));

    // Reset animation state after transition
    setTimeout(() => {
      setMobileMenu(prev => ({ ...prev, isAnimating: false }));
    }, 300);
  }, []);

  /**
   * Close mobile menu
   */
  const closeMobileMenu = useCallback(() => {
    setMobileMenu({ isOpen: false, isAnimating: true });
    setTimeout(() => {
      setMobileMenu(prev => ({ ...prev, isAnimating: false }));
    }, 300);
  }, []);

  /**
   * Handle keyboard navigation for mobile menu
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && mobileMenu.isOpen) {
      closeMobileMenu();
    }
  }, [mobileMenu.isOpen, closeMobileMenu]);

  /**
   * Check if navigation link is active
   */
  const isActiveLink = useCallback((href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href) ?? false;
  }, [pathname]);

  // Don't render until theme is loaded to prevent flash
  if (!isThemeLoaded) {
    return (
      <nav className="fixed top-0 w-full z-50 glassmorphism-header border-b border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center">
              <div className="text-xl font-bold bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">
                J StaR Films
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  /**
   * Smart Navigation Link Component with long-press functionality
   */
  const SmartNavLink = ({ item }: { item: NavigationItem }) => {
    const [tooltip, setTooltip] = useState({ isVisible: false, text: '' });
    const { onMouseDown, onMouseUp, onTouchStart, onTouchEnd, onClick } = useSmartNavigation({
      href: item.href,
      onTooltipChange: setTooltip
    });
    const isActive = isActiveLink(item.href);

    // On homepage, don't use Link to prevent navigation - just use a button
    if (pathname === '/') {
      return (
        <>
          <button
            key={item.href}
            type="button"
            aria-label={`Scroll to ${item.href.replace('/', '')}`}
            className={`text-foreground hover:text-jstar-blue transition-colors focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10 rounded-md px-2 py-1 text-sm font-medium ${isActive
              ? 'text-jstar-blue font-semibold'
              : ''
              }`}
            aria-current={isActive ? 'page' : undefined}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={onClick}
          >
            {item.label}
          </button>
          <Tooltip isVisible={tooltip.isVisible} text={tooltip.text} />
        </>
      );
    }

    // On other pages, use normal Link navigation
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`text-foreground hover:text-jstar-blue transition-colors focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10 rounded-md px-2 py-1 text-sm font-medium ${isActive
          ? 'text-jstar-blue font-semibold'
          : ''
          }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Premium Glassmorphism Header - Ultra Compact */}
      <nav
        className="fixed top-0 w-full z-50 glassmorphism-header border-b border-white/20 dark:border-white/10 transition-all duration-300"
        role="navigation"
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Logo - Compact */}
            <div className="flex items-center">
              {pathname === '/' ? (
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-xl font-bold bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10 rounded-md px-2 py-1"
                  aria-label="Scroll to top"
                >
                  J StaR Films
                </button>
              ) : (
                <Link
                  href="/"
                  className="text-xl font-bold bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10 rounded-md px-2 py-1"
                  aria-label="J StaR Films homepage"
                >
                  J StaR Films
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <SmartNavLink key={item.href} item={item} />
              ))}
            </div>

            {/* Action Buttons - Compact Layout */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle - Desktop */}
              <button
                onClick={toggleTheme}
                className="hidden md:flex p-1.5 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm text-foreground hover:bg-white/20 dark:hover:bg-black/20 transition-all focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                aria-pressed={theme === 'dark'}
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-4 w-4" aria-hidden={true} />
                ) : (
                  <MoonIcon className="h-4 w-4" aria-hidden={true} />
                )}
              </button>

              {/* Auth Button */}
              {authButton}

              {/* JohnGPT Button - Desktop Only */}
              <Link
                href="/john-gpt"
                className="hidden md:flex btn-enhanced px-3 py-1.5 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10 items-center justify-center"
                aria-label="Open JohnGPT assistant interface"
              >
                Meet JohnGPT
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-1.5 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm text-foreground hover:bg-white/20 dark:hover:bg-black/20 transition-all focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10"
                aria-label={mobileMenu.isOpen ? 'Close mobile menu' : 'Open mobile menu'}
                aria-expanded={mobileMenu.isOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenu.isOpen ? (
                  <CloseIcon className="h-5 w-5" aria-hidden={true} />
                ) : (
                  <MenuIcon className="h-5 w-5" aria-hidden={true} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cinematic Mobile Menu - Enhanced Slide Animations */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-100 ease-out ${mobileMenu.isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
          }`}
        aria-hidden={!mobileMenu.isOpen}
      >
        {/* Premium Backdrop with Smooth Blur Animation */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-out ${mobileMenu.isOpen
            ? 'bg-black/60 backdrop-blur-md opacity-100'
            : 'bg-black/0 backdrop-blur-none opacity-0'
            }`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* Cinematic Sidebar - Enhanced Slide Animation */}
        <div
          id="mobile-menu"
          className={`absolute top-0 right-0 w-4/5 max-w-sm h-full glassmorphism-sidebar shadow-2xl transform transition-all duration-700 ease-out ${mobileMenu.isOpen
            ? 'translate-x-0 opacity-100 scale-100'
            : 'translate-x-full opacity-95 scale-95'
            }`}
          role="menu"
          aria-label="Mobile navigation menu"
        >
          {/* Animated Header Section */}
          <div className="p-6 border-b border-white/10 dark:border-white/5 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground animate-fade-in-up">
                Menu
              </h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm text-muted-foreground hover:bg-white/20 dark:hover:bg-black/20 transition-all focus:outline-none focus:ring-2 focus:ring-jstar-blue animate-fade-in-up"
                style={{ animationDelay: '100ms' }}
                aria-label="Close menu"
              >
                <CloseIcon className="h-5 w-5" aria-hidden={true} />
              </button>
            </div>

            {/* Animated Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/5 backdrop-blur-sm mt-4 animate-fade-in-up hover:bg-white/10 dark:hover:bg-black/10 transition-all focus:outline-none focus:ring-2 focus:ring-jstar-blue group"
              style={{ animationDelay: '200ms' }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              aria-pressed={theme === 'dark'}
            >
              <span className="text-sm font-medium text-foreground group-hover:text-jstar-blue transition-colors">Theme</span>
              <div className="p-2 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm text-foreground group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-all">
                {theme === 'dark' ? (
                  <SunIcon className="h-4 w-4" aria-hidden={true} />
                ) : (
                  <MoonIcon className="h-4 w-4" aria-hidden={true} />
                )}
              </div>
            </button>
          </div>

          {/* Animated Navigation Links */}
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            <nav className="space-y-3">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-4 py-4 text-base font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10 animate-fade-in-up border-b border-white/5 dark:border-white/5 last:border-0 ${isActiveLink(item.href)
                    ? 'text-jstar-blue bg-gradient-to-r from-jstar-blue/10 to-faith-purple/10 dark:from-jstar-blue/20 dark:to-faith-purple/20 shadow-lg border-transparent'
                    : 'text-foreground hover:text-jstar-blue hover:bg-white/5 dark:hover:bg-black/20 hover:pl-6'
                    }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                  onClick={closeMobileMenu}
                  role="menuitem"
                  tabIndex={0}
                >
                  <item.icon className={`w-5 h-5 mr-4 transition-colors ${isActiveLink(item.href) ? 'text-jstar-blue' : 'text-muted-foreground group-hover:text-jstar-blue'
                    }`} />
                  <span className="flex-1">{item.label}</span>
                  {isActiveLink(item.href) && (
                    <div className="w-2 h-2 rounded-full bg-jstar-blue animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Animated JohnGPT CTA Section */}
          <div className="p-6 border-t border-white/10 dark:border-white/5 animate-fade-in-up">
            <Link
              href="/john-gpt"
              className="w-full btn-enhanced px-6 py-3 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-xl font-semibold text-base hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10 shadow-lg hover:shadow-xl hover:scale-[1.02] animate-fade-in-up flex items-center justify-center"
              aria-label="Open JohnGPT assistant interface"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Meet JohnGPT</span>
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
            </Link>
          </div>
        </div>
      </div>

    </>
  );
};

export default Header;
