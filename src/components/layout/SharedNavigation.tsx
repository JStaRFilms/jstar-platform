'use client';

import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PlayCircleIcon,
  CheckIcon,
  ShieldCheckIcon,
  VideoCameraIcon,
  CodeIcon,
  CameraIcon,
  FilmIcon,
  MegaphoneIcon,
  DeviceMobileIcon,
  ArrowRightIcon,
  LightBulbIcon,
  PenFancyIcon,
  CommentsIcon,
  RocketIcon,
  CloseIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  GiftIcon
} from '@/components/icons';

/**
 * Navigation System Analysis & Enhancement Task
 * Enhanced Navigation Component with Modern UX Patterns
 */

// Navigation Context for global state management
interface NavigationContextType {
  currentPath: string;
  isMobileMenuOpen: boolean;
  breadcrumbs: BreadcrumbItem[];
  searchQuery: string;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

const NavigationContext = React.createContext<NavigationContextType | undefined>(undefined);

// Navigation Hook
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

// Types
interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: NavigationItem[];
  requiresAuth?: boolean;
  adminOnly?: boolean;
  badge?: string;
  external?: boolean;
}

interface SharedNavigationProps {
  variant?: 'default' | 'admin' | 'compact';
  showSearch?: boolean;
  showBreadcrumbs?: boolean;
  customItems?: NavigationItem[];
  className?: string;
}

// Navigation Provider Component
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  // Generate breadcrumbs based on current path
  useEffect(() => {
    const generateBreadcrumbs = (path: string): BreadcrumbItem[] => {
      const segments = path.split('/').filter(Boolean);
      const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

      let currentPath = '';
      segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
        crumbs.push({ label, href: currentPath });
      });

      return crumbs;
    };

    setBreadcrumbs(generateBreadcrumbs(pathname));
  }, [pathname]);

  const value: NavigationContextType = {
    currentPath: pathname,
    isMobileMenuOpen,
    breadcrumbs,
    searchQuery,
    setMobileMenuOpen,
    setSearchQuery,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// Main Shared Navigation Component
export const SharedNavigation: React.FC<SharedNavigationProps> = ({
  variant = 'default',
  showSearch = true,
  showBreadcrumbs = true,
  customItems = [],
  className = ''
}) => {
  const { currentPath, isMobileMenuOpen, breadcrumbs, searchQuery, setMobileMenuOpen, setSearchQuery } = useNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Default navigation items
  const defaultItems: NavigationItem[] = [
    { id: 'home', label: 'Home', href: '/', icon: PlayCircleIcon },
    { id: 'about', label: 'About', href: '/about', icon: ShieldCheckIcon },
    { id: 'services', label: 'Services', href: '/services', icon: VideoCameraIcon },
    { id: 'portfolio', label: 'Portfolio', href: '/portfolio', icon: CameraIcon },
    { id: 'blog', label: 'Blog', href: '/blog', icon: FilmIcon },
    { id: 'store', label: 'Store', href: '/store', icon: GiftIcon },
    { id: 'contact', label: 'Contact', href: '/contact', icon: EnvelopeIcon },
  ];

  const navigationItems = customItems.length > 0 ? customItems : defaultItems;

  // Theme toggle handler
  const toggleTheme = () => {
    const html = document.documentElement;
    const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.classList.remove(currentTheme);
    html.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global search navigation
      console.log('Searching for:', searchQuery);
      // TODO: Integrate with search API
    }
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
      setIsSearchFocused(false);
    }
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg'
            : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm'
        } ${className}`}
        onKeyDown={handleKeyDown}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
                aria-label="J StaR Films Home"
              >
                J StaR Films
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 group ${
                    currentPath === item.href
                      ? 'text-white bg-gradient-to-r from-jstar-blue to-faith-purple shadow-lg'
                      : 'text-foreground hover:text-jstar-blue hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  aria-current={currentPath === item.href ? 'page' : undefined}
                >
                  <span className="flex items-center">
                    {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </span>

                  {/* Hover effect */}
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-jstar-blue/10 to-faith-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${currentPath === item.href ? 'opacity-100' : ''}`} />
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">

              {/* Search */}
              {showSearch && (
                <div className="relative">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className={`w-48 px-4 py-2 pl-10 rounded-lg border transition-all duration-200 ${
                        isSearchFocused
                          ? 'border-jstar-blue bg-white dark:bg-gray-800 shadow-lg'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                      }`}
                      aria-label="Search navigation"
                    />
                    <FilmIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </form>

                  {/* Search suggestions dropdown */}
                  {isSearchFocused && searchQuery && (
                    <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="p-2">
                        <div className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1">
                          Search results for "{searchQuery}"
                        </div>
                        {/* TODO: Implement search results */}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                aria-label="Toggle theme"
              >
                <LightBulbIcon className="h-5 w-5" />
              </button>

              {/* JohnGPT Button */}
              <button
                onClick={() => console.log('JohnGPT interface would open')}
                className="hidden sm:flex items-center px-4 py-2 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                aria-label="Open JohnGPT assistant"
              >
                <RocketIcon className="h-4 w-4 mr-2" />
                Meet JohnGPT
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <CloseIcon className="h-6 w-6" />
                ) : (
                  <DeviceMobileIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      {showBreadcrumbs && breadcrumbs.length > 1 && (
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && <ChevronRightIcon className="h-4 w-4" />}
                <Link
                  href={crumb.href}
                  className={`hover:text-jstar-blue transition-colors ${
                    index === breadcrumbs.length - 1 ? 'font-semibold text-gray-900 dark:text-white' : ''
                  }`}
                  aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

// Mobile Menu Component (separate for better organization)
export const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: NavigationItem[];
  currentPath: string;
}> = ({ isOpen, onClose, items, currentPath }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-xl z-50 md:hidden transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div className="p-4 space-y-4">

        {/* Mobile Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:border-jstar-blue focus:ring-2 focus:ring-jstar-blue/20"
            aria-label="Mobile search"
          />
          <FilmIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Mobile Navigation Items */}
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                currentPath === item.href
                  ? 'bg-gradient-to-r from-jstar-blue to-faith-purple text-white shadow-lg'
                  : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-current={currentPath === item.href ? 'page' : undefined}
            >
              {item.icon && <item.icon className="h-5 w-5 mr-3" />}
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <button
            onClick={() => console.log('JohnGPT interface would open')}
            className="flex items-center w-full px-4 py-3 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold"
          >
            <RocketIcon className="h-5 w-5 mr-3" />
            Meet JohnGPT
          </button>

          <button
            onClick={() => {
              const html = document.documentElement;
              html.classList.toggle('dark');
            }}
            className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <LightBulbIcon className="h-5 w-5 mr-3" />
            Toggle Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedNavigation;
