
'use client';

import React from 'react';

const ContactForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg form-card">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Have a project in mind or want to learn more about my services? Fill out the form below and I'll get back to you within 24 hours.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
          <input type="text" id="name" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-jstar-blue focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="John Doe" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
          <input type="email" id="email" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-jstar-blue focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="john@example.com" />
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Interest</label>
          <select id="service" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-jstar-blue focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option value="">Select a service</option>
            <option value="wedding">Wedding Cinematography</option>
            <option value="corporate">Corporate Videos</option>
            <option value="app">App Development</option>
            <option value="ai">AI Creator Tools</option>
            <option value="consulting">Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Message</label>
          <textarea id="message" rows={5} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-jstar-blue focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Tell me about your project..."></textarea>
        </div>

        <div className="flex items-center">
          <input id="newsletter" type="checkbox" className="w-4 h-4 text-jstar-blue border-gray-300 rounded focus:ring-jstar-blue" />
          <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Subscribe to my newsletter for creator tips and updates
          </label>
        </div>

        <button type="submit" className="w-full px-6 py-4 bg-gradient-to-r from-jstar-blue to-faith-purple text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
