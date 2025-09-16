
import React from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from './IconComponents';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary dark:text-accent rounded-full text-sm font-medium mb-4">Get In Touch</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Let's Create Something Amazing Together</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Have a project in mind or want to discuss how we can work together? Drop us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Form */}
          <div className="glass rounded-2xl p-8 md:p-10 border border-gray-200/10">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                  <input type="text" id="name" name="name" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input type="email" id="email" name="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input type="text" id="subject" name="subject" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Message</label>
                <textarea id="message" name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full px-6 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Client Quote & Contact Info */}
          <div className="space-y-8">
            {/* Client Quote Card */}
            <div className="glass rounded-2xl p-6 border border-gray-200/10 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic mb-4">"Working with J StaR Films was an absolute game-changer for our brand. Their attention to detail and creative vision brought our story to life in ways we couldn't have imagined. The entire process was smooth, professional, and exceeded our expectations at every turn."</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent flex-shrink-0"></div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white">Sarah Johnson</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Marketing Director, TechNova</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 dark:bg-accent/20 flex items-center justify-center text-primary dark:text-accent">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email us</h3>
                  <p className="text-base text-gray-900 dark:text-white">hello@jstarfilms.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 dark:bg-accent/20 flex items-center justify-center text-primary dark:text-accent">
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Call us</h3>
                  <p className="text-base text-gray-900 dark:text-white">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 dark:bg-accent/20 flex items-center justify-center text-primary dark:text-accent">
                  <MapPinIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Visit us</h3>
                  <p className="text-base text-gray-900 dark:text-white">123 Creative Lane, Suite 100<br/>San Francisco, CA 94107</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 dark:bg-accent/20 flex items-center justify-center text-primary dark:text-accent">
                  <ClockIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Working hours</h3>
                  <p className="text-base text-gray-900 dark:text-white">Monday - Friday: 9am - 6pm<br/>Saturday: 10am - 4pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
