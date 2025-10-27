
import React from 'react';

const MySkills = () => {
  return (
    <div id="skills" className="bg-card rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-foreground mb-6">My Skills & Expertise</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Technical Skills */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">Technical Expertise</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted">Video Production</span>
                <span className="text-sm text-muted-foreground">Expert</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-jstar-blue to-faith-purple h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted">App Development</span>
                <span className="text-sm text-muted-foreground">Advanced</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-faith-purple to-growth-green h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted">AI Integration</span>
                <span className="text-sm text-muted-foreground">Intermediate</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-growth-green to-jstar-blue h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Creative Skills */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">Creative Skills</h3>
          <div className="flex flex-wrap gap-2">
            <span className="skill-badge px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm">Cinematography</span>
            <span className="skill-badge px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg text-sm">Storytelling</span>
            <span className="skill-badge px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm">UX Design</span>
            <span className="skill-badge px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm">Brand Strategy</span>
            <span className="skill-badge px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg text-sm">Content Creation</span>
            <span className="skill-badge px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-lg text-sm">Drone Operation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySkills;
