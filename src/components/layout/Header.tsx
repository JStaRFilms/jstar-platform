
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDark(!isDark);
  };

  const openJohnGPT = () => {
    alert('JohnGPT interface would open here (FR013)');
  };

  return (
    <nav className="fixed top-0 w-full z-50 navbar-blur border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">
              J StaR Films
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-jstar-blue transition-colors">About</Link>
            <Link href="/portfolio" className="text-gray-700 dark:text-gray-300 hover:text-jstar-blue transition-colors">Portfolio</Link>
            <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-jstar-blue transition-colors">Services</Link>
            <Link href="/store" className="text-gray-700 dark:text-gray-300 hover:text-jstar-blue transition-colors">Store</Link>
            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-jstar-blue transition-colors">Blog</Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-jstar-blue transition-colors">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    aria-label="Toggle theme">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>

            <button onClick={openJohnGPT}
                    className="btn-enhanced px-4 py-2 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold">
              Meet JohnGPT
            </button>

            <button className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
