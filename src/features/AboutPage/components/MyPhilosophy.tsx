
import React from 'react';

const MyPhilosophy = () => {
  return (
    <div id="philosophy" className="bg-card rounded-2xl p-8 shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">My Philosophy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border rounded-xl p-6">
          <div className="w-12 h-12 bg-gradient-to-r from-jstar-blue to-faith-purple rounded-xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">Faith-Driven Creation</h3>
          <p className="text-muted">
            Every project I work on is infused with purpose and values. I believe that great work comes from a place
            of authenticity and conviction.
          </p>
        </div>
        <div className="border border-border rounded-xl p-6">
          <div className="w-12 h-12 bg-gradient-to-r from-faith-purple to-growth-green rounded-xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">Innovation with Purpose</h3>
          <p className="text-muted">
            Technology should serve humanity, not the other way around. I strive to create tools that empower people
            to do meaningful work.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyPhilosophy;
