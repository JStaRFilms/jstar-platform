
import React from 'react';
import { founderData } from '../../../content/about-me';

const MyPhilosophy = () => {
  const colors = [
    'from-jstar-blue to-faith-purple',
    'from-faith-purple to-growth-green'
  ];

  return (
    <div id="philosophy" className="bg-card rounded-2xl p-8 shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">My Philosophy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {founderData.philosophy.map((item, index) => (
          <div key={index} className="border border-border rounded-xl p-6">
            <div className={`w-12 h-12 bg-gradient-to-r ${colors[index % colors.length]} rounded-xl flex items-center justify-center mb-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.iconSvg} />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
            <p className="text-muted">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPhilosophy;
