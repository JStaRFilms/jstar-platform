
import React from 'react';

const JourneyTimeline = () => {
  return (
    <div id="journey" className="bg-card rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-foreground mb-4">My Journey</h3>
      <div className="space-y-6">
        <div className="timeline-item">
          <h4 className="font-semibold text-foreground">2020</h4>
          <p className="text-muted text-sm">Founded J StaR Films</p>
        </div>
        <div className="timeline-item">
          <h4 className="font-semibold text-foreground">2021</h4>
          <p className="text-muted text-sm">First 50 wedding films completed</p>
        </div>
        <div className="timeline-item">
          <h4 className="font-semibold text-foreground">2022</h4>
          <p className="text-muted text-sm">Began app development journey</p>
        </div>
        <div className="timeline-item">
          <h4 className="font-semibold text-foreground">2023</h4>
          <p className="text-muted text-sm">Launched first AI-powered tools</p>
        </div>
        <div className="timeline-item">
          <h4 className="font-semibold text-foreground">2024</h4>
          <p className="text-muted text-sm">Developing JohnGPT Creator Assistant</p>
        </div>
      </div>
    </div>
  );
};

export default JourneyTimeline;
