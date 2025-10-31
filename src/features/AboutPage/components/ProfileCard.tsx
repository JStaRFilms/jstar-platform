
import React from 'react';
import { founderData } from '../../../content/about-me';

const ProfileCard = () => {
  const initials = founderData.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg mb-8 sticky top-24">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-jstar-blue to-faith-purple rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{initials}</span>
        </div>
        <h3 className="text-xl font-bold text-foreground">{founderData.name}</h3>
        <p className="text-muted">{founderData.title}</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center text-muted">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-jstar-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{founderData.contact.phone}</span>
        </div>
        <div className="flex items-center text-muted">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-faith-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{founderData.contact.email}</span>
        </div>
        <div className="flex items-center text-muted">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-growth-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{founderData.contact.location}</span>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <a href="#contact" className="w-full block text-center px-4 py-3 bg-gradient-to-r from-jstar-blue to-faith-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Get in Touch
        </a>
      </div>
    </div>
  );
};

export default ProfileCard;
