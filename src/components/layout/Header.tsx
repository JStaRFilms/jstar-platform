
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon, CloseIcon, SunIcon, MoonIcon } from '@/components/icons';

/**
 * Navigation item interface for type safety
 */
interface NavigationItem {
  /** Navigation link href */
  href: string;
  /** Display label */
  label: string;
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
const Header: React.FC = () => {
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
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' },
    { href: '/store', label: 'Store' },
    { href: '/contact', label: 'Contact' }
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
   * Handle JohnGPT button click with error handling
   */
  const handleJohnGPTClick = useCallback(() => {
    try {
      // TODO: Replace with actual JohnGPT interface opening logic
      alert('JohnGPT interface would open here (FR013)');
    } catch (error) {
      console.error('Failed to open JohnGPT:', error);
    }
  }, []);

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
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10 rounded-md px-2 py-1"
                aria-label="J StaR Films homepage"
              >
                J StaR Films
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-gray-700 dark:text-gray-300 hover:text-jstar-blue transition-colors focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10 rounded-md px-2 py-1 text-sm font-medium ${
                    isActiveLink(item.href)
                      ? 'text-jstar-blue font-semibold'
                      : ''
                  }`}
                  aria-current={isActiveLink(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Action Buttons - Compact Layout */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle - Desktop */}
              <button
                onClick={toggleTheme}
                className="hidden md:flex p-1.5 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20 transition-all focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                aria-pressed={theme === 'dark'}
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-4 w-4" aria-hidden={true} />
                ) : (
                  <MoonIcon className="h-4 w-4" aria-hidden={true} />
                )}
              </button>

              {/* JohnGPT Button - Desktop Only */}
              <button
                onClick={handleJohnGPTClick}
                className="hidden md:flex btn-enhanced px-3 py-1.5 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10"
                aria-label="Open JohnGPT assistant interface"
              >
                Meet JohnGPT
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-1.5 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20 transition-all focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10"
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
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-100 ease-out ${
          mobileMenu.isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenu.isOpen}
      >
        {/* Premium Backdrop with Smooth Blur Animation */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-out ${
            mobileMenu.isOpen
              ? 'bg-black/60 backdrop-blur-md opacity-100'
              : 'bg-black/0 backdrop-blur-none opacity-0'
          }`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* Cinematic Sidebar - Enhanced Slide Animation */}
        <div
          id="mobile-menu"
          className={`absolute top-0 right-0 w-4/5 max-w-sm h-full glassmorphism-sidebar shadow-2xl transform transition-all duration-700 ease-out ${
            mobileMenu.isOpen
              ? 'translate-x-0 opacity-100 scale-100'
              : 'translate-x-full opacity-95 scale-95'
          }`}
          role="menu"
          aria-label="Mobile navigation menu"
        >
            {/* Animated Header Section */}
            <div className="p-6 border-b border-white/10 dark:border-white/5 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 animate-fade-in-up">
                  Menu
                </h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-black/20 transition-all focus:outline-none focus:ring-2 focus:ring-jstar-blue animate-fade-in-up"
                  style={{ animationDelay: '100ms' }}
                  aria-label="Close menu"
                >
                  <CloseIcon className="h-5 w-5" aria-hidden={true} />
                </button>
              </div>

              {/* Animated Mobile Theme Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/5 backdrop-blur-sm mt-4 animate-fade-in-up">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20 transition-all focus:outline-none focus:ring-2 focus:ring-jstar-blue animate-fade-in-up"
                  style={{ animationDelay: '200ms' }}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                  aria-pressed={theme === 'dark'}
                >
                  {theme === 'dark' ? (
                    <SunIcon className="h-4 w-4" aria-hidden={true} />
                  ) : (
                    <MoonIcon className="h-4 w-4" aria-hidden={true} />
                  )}
                </button>
              </div>
            </div>

            {/* Animated Navigation Links */}
            <div className="flex-1 px-6 py-6">
              <nav className="space-y-2">
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10 animate-fade-in-up ${
                      isActiveLink(item.href)
                        ? 'text-jstar-blue bg-gradient-to-r from-jstar-blue/10 to-faith-purple/10 dark:from-jstar-blue/20 dark:to-faith-purple/20 shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:text-jstar-blue hover:bg-white/10 dark:hover:bg-black/10 hover:shadow-md hover:scale-[1.02]'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                    onClick={closeMobileMenu}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <span className="flex-1">{item.label}</span>
                    {isActiveLink(item.href) && (
                      <div className="w-2 h-2 rounded-full bg-jstar-blue animate-pulse" />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Animated JohnGPT CTA Section */}
            <div className="p-6 border-t border-white/10 dark:border-white/5 animate-fade-in-up">
              <button
                onClick={handleJohnGPTClick}
                className="w-full btn-enhanced px-6 py-3 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-xl font-semibold text-base hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-jstar-blue focus:ring-offset-2 focus:ring-offset-white/10 dark:focus:ring-offset-black/10 shadow-lg hover:shadow-xl hover:scale-[1.02] animate-fade-in-up"
                aria-label="Open JohnGPT assistant interface"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Meet JohnGPT</span>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </span>
              </button>
            </div>
          </div>
      </div>
    </>
  );
};

export default Header;
