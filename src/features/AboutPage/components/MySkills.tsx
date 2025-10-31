
import React from 'react';
import { founderData } from '../../../content/about-me';

const MySkills = () => {
  const skillColors = [
    'from-jstar-blue to-faith-purple',
    'from-faith-purple to-growth-green',
    'from-growth-green to-jstar-blue'
  ];

  const creativeSkillColors = [
    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
  ];

  return (
    <div id="skills" className="bg-card rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-foreground mb-6">My Skills & Expertise</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Technical Skills */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">Technical Expertise</h3>
          <div className="space-y-4">
            {founderData.technicalSkills.map((skill, index) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-muted">{skill.name}</span>
                  <span className="text-sm text-muted-foreground">{skill.level}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className={`bg-gradient-to-r ${skillColors[index % skillColors.length]} h-2 rounded-full`} style={{ width: `${skill.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creative Skills */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">Creative Skills</h3>
          <div className="flex flex-wrap gap-2">
            {founderData.creativeSkills.map((skill, index) => (
              <span key={skill} className={`skill-badge px-3 py-2 ${creativeSkillColors[index % creativeSkillColors.length]} rounded-lg text-sm`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySkills;
