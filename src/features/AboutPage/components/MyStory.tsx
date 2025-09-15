
import React from 'react';

const MyStory = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Story</h2>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          I'm John Oluleke-Oke, a creative technologist based in Nigeria, passionate about merging faith, technology, and storytelling.
          With over 5 years of experience in video production and app development, I've had the privilege of working with
          individuals and organizations to bring their visions to life through cinematic storytelling and cutting-edge digital solutions.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          My journey began in Lagos, where I discovered my passion for visual storytelling through wedding videography.
          What started as a side hustle quickly evolved into a full-fledged production company, J StaR Films, where we've
          captured over 50 love stories and created cinematic experiences that families treasure for generations.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          As technology evolved, so did my interests. I dove deep into app development, creating custom solutions for
          businesses and individuals. My work spans from mobile applications to complex web platforms, always with
          a focus on user experience and performance.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Today, I'm exploring the intersection of artificial intelligence and creativity, building tools that help
          content creators like myself work smarter, not harder. My latest project, JohnGPT, is an AI assistant
          designed specifically for creators who want to grow their impact while staying true to their values.
        </p>
      </div>
    </div>
  );
};

export default MyStory;
