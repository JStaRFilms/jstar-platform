
import React from 'react';
import { founderData } from '../../../content/about-me';

const MyStory = () => {
  return (
    <div className="bg-card rounded-2xl p-8 shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">My Story</h2>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {founderData.story.map((paragraph, index) => (
          <p key={index} className={`text-gray-700 dark:text-gray-300 ${index < founderData.story.length - 1 ? 'mb-4' : ''}`}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>);

};

export default MyStory;
