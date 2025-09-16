'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  FileText,
  Bot,
  Settings,
  Users,
  BarChart3,
  MonitorSpeaker,
  ArrowRightLeft,
  Shield,
  Sun,
  Moon
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navigationItems = [
    { href: '/admin', label: 'Dashboard', icon: Home, active: false },
    { href: '/admin/cms', label: 'CMS', icon: FileText, active: false },
    { href: '/admin/johngpt', label: 'JohnGPT', icon: Bot, active: false },
    { href: '/admin/cge', label: 'CGE Tools', icon: Settings, active: false },
    { href: '/admin/users', label: 'User Management', icon: Users, active: false },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, active: false },
  ];

  const systemItems = [
    { href: '/admin/system-diagnostic', label: 'System Diagnostics', icon: MonitorSpeaker, active: true },
    { href: '/admin/migration-center', label: 'Migration Center', icon: ArrowRightLeft, active: false },
    { href: '/admin/security', label: 'Security', icon: Shield, active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300 shadow-lg"
          aria-label="Toggle dark/light theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent flex items-center">
            <MonitorSpeaker className="h-5 w-5 mr-2" />
            J StaR Admin
          </Link>
        </div>

        {/* Navigation */}
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Platform Modules */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Platform Modules
            </h3>
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item flex items-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${
                    item.active ? 'active bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-l-3 border-red-600' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* System Management */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              System Management
            </h3>
            <nav className="space-y-1">
              {systemItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item flex items-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${
                    item.active ? 'active bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-l-3 border-red-600' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold">JO</span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-white">John Oluleke-Oke</p>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Admin Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
