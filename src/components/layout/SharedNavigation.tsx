'use client';

import React, { createContext, useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// --- Types ---

export interface NavigationItem {
    id: string;
    label: string;
    href: string;
    icon?: React.ElementType;
    badge?: string;
    children?: NavigationItem[];
}

interface SharedNavigationProps {
    variant?: 'default' | 'admin';
    items?: NavigationItem[];
    customItems?: NavigationItem[];
    showBreadcrumbs?: boolean;
    className?: string;
}

// --- Context ---

interface NavigationContextType {
    isMobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType>({
    isMobileMenuOpen: false,
    setMobileMenuOpen: () => { },
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <NavigationContext.Provider value={{ isMobileMenuOpen, setMobileMenuOpen }}>
            {children}
        </NavigationContext.Provider>
    );
};

// --- Component ---

export const SharedNavigation = ({
    variant = 'default',
    customItems = [],
    showBreadcrumbs: _showBreadcrumbs = false,
    className
}: SharedNavigationProps) => {
    const pathname = usePathname();
    const { isMobileMenuOpen, setMobileMenuOpen } = useNavigation();

    return (
        <nav className={cn("w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800", className)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo / Brand */}
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {variant === 'admin' ? 'J StaR Admin' : 'J StaR Films'}
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {customItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={cn(
                                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                                        pathname?.startsWith(item.href)
                                            ? "border-blue-500 text-gray-900 dark:text-white"
                                            : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                                    )}
                                >
                                    {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                                    {item.label}
                                    {item.badge && (
                                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Icon placeholder */}
                            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                                <span className={cn("block w-full h-0.5 bg-current transition-transform", isMobileMenuOpen && "rotate-45 translate-y-2")} />
                                <span className={cn("block w-full h-0.5 bg-current transition-opacity", isMobileMenuOpen && "opacity-0")} />
                                <span className={cn("block w-full h-0.5 bg-current transition-transform", isMobileMenuOpen && "-rotate-45 -translate-y-2")} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {customItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                                    pathname?.startsWith(item.href)
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-200"
                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="flex items-center">
                                    {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                                    {item.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};
