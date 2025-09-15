
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p>&copy; {currentYear} J StaR Films. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
