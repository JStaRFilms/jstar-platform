
import React from 'react';
import Link from 'next/link';

// Social Icons
const TwitterIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>;
const InstagramIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.585.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0 2.162c-3.143 0-3.505.012-4.73.068-2.766.126-3.976 1.336-4.102 4.102-.056 1.225-.068 1.586-.068 4.73s.012 3.505.068 4.73c.126 2.766 1.336 3.976 4.102 4.102 1.225.056 1.586.068 4.73.068s3.505-.012 4.73-.068c2.766-.126 3.976-1.336 4.102-4.102.056-1.225.068-1.586.068-4.73s-.012-3.505-.068-4.73c-.126-2.766-1.336-3.976-4.102-4.102-1.225-.056-1.586-.068-4.73-.068zm0 5.831c-1.705 0-3.075 1.37-3.075 3.075s1.37 3.075 3.075 3.075 3.075-1.37 3.075-3.075-1.37-3.075-3.075-3.075zm0 5.162c-1.144 0-2.088-.944-2.088-2.088s.944-2.088 2.088-2.088 2.088.944 2.088 2.088-.944 2.088-2.088 2.088zm4.965-6.412c-.78 0-1.418.638-1.418 1.418s.638 1.418 1.418 1.418 1.418-.638 1.418-1.418-.638-1.418-1.418-1.418z" /></svg>;
const YouTubeIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 7.686a2.483 2.483 0 00-1.752-1.752C18.25 5.5 12 5.5 12 5.5s-6.25 0-7.83.434a2.483 2.483 0 00-1.752 1.752C2 9.25 2 12 2 12s0 2.75.418 4.314a2.483 2.483 0 001.752 1.752C5.75 18.5 12 18.5 12 18.5s6.25 0 7.83-.434a2.483 2.483 0 001.752-1.752C22 14.75 22 12 22 12s0-2.75-.418-4.314zM9.545 14.5v-5l4.5 2.5-4.5 2.5z" /></svg>;
const LinkedInIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
const PaperPlaneIcon = () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold flex items-center mb-4">
              <Link href="/" className="bg-gradient-to-r from-jstar-blue to-faith-purple bg-clip-text text-transparent">J StaR</Link>
            </h3>
            <p className="text-gray-400 mb-6">
              Creating cinematic experiences and digital solutions that inspire and transform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><TwitterIcon /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><YouTubeIcon /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><LinkedInIcon /></a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Video Production</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">App Development</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">AI Tools</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Branding</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe for updates on new services and creative insights.</p>
            <form className="flex">
              <input type="email" placeholder="Your email" className="px-4 py-2 w-full rounded-l-lg focus:outline-none text-gray-900" />
              <button type="submit" className="bg-jstar-blue hover:bg-jstar-blue/90 text-white px-4 rounded-r-lg transition-colors">
                <PaperPlaneIcon />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">&copy; {currentYear} J StaR Films. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
