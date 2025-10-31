
import React from 'react';
import { founderData } from '../../../content/about-me';

const JourneyTimeline = () => {
  return (
    <div id="journey" className="bg-card rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-foreground mb-4">My Journey</h3>
      <div className="space-y-6">
        {founderData.timeline.map((item, index) => (
          <div key={index} className="timeline-item">
            <h4 className="font-semibold text-foreground">{item.year}</h4>
            <p className="text-muted text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyTimeline;
