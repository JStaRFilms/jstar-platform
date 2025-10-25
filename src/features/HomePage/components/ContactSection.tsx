'use client';

import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon, CheckCircleIcon, ArrowRightIcon } from '../../../components/icons/static-icons';
import AnimatedIcon from '../../../components/ui/AnimatedIcon';

// TypeScript interfaces for contact system
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  service: string;
  message: string;
  newsletter: boolean;
}

interface ContactSubmission extends ContactFormData {
  id?: string;
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  status: 'pending' | 'processed' | 'responded';
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  service?: string;
  message?: string;
  general?: string;
}

interface FormState {
  data: ContactFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
  submitCount: number;
}

const ContactSection: React.FC = () => {
  // Form state management
  const [formState, setFormState] = useState<FormState>({
    data: {
      name: '',
      email: '',
      subject: '',
      service: '',
      message: '',
      newsletter: false
    },
    errors: {},
    isSubmitting: false,
    isSuccess: false,
    submitCount: 0
  });

  // Service options (matching ContactPage)
  const serviceOptions = [
  { value: '', label: 'Select a service' },
  { value: 'wedding', label: 'Wedding Cinematography' },
  { value: 'corporate', label: 'Corporate Videos' },
  { value: 'app', label: 'App Development' },
  { value: 'ai', label: 'AI Creator Tools' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other' }];


  // Validation function
  const validateForm = (data: ContactFormData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.name.trim()) {
      errors.name = 'Name is required';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!data.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!data.service) {
      errors.service = 'Please select a service';
    }

    if (!data.message.trim()) {
      errors.message = 'Message is required';
    } else if (data.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    return errors;
  };

  // Handle input changes
  const handleInputChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      errors: { ...prev.errors, [field]: undefined, general: undefined },
      isSuccess: false
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm(formState.data);
    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({ ...prev, errors }));
      return;
    }

    // Set submitting state
    setFormState((prev) => ({ ...prev, isSubmitting: true, errors: {} }));

    try {
      // Make API call to contact endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState.data)
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle different error types
        if (response.status === 429) {
          // Rate limited
          setFormState((prev) => ({
            ...prev,
            isSubmitting: false,
            errors: {
              general: `Too many requests. Please wait ${result.retryAfter} seconds before trying again.`
            }
          }));
          return;
        }

        if (response.status === 400 && result.errors) {
          // Validation errors from server
          const serverErrors: FormErrors = {};
          result.errors.forEach((error: string) => {
            if (error.toLowerCase().includes('name')) serverErrors.name = error;else
            if (error.toLowerCase().includes('email')) serverErrors.email = error;else
            if (error.toLowerCase().includes('subject')) serverErrors.subject = error;else
            if (error.toLowerCase().includes('service')) serverErrors.service = error;else
            if (error.toLowerCase().includes('message')) serverErrors.message = error;else
            serverErrors.general = error;
          });
          setFormState((prev) => ({
            ...prev,
            isSubmitting: false,
            errors: serverErrors
          }));
          return;
        }

        // Generic error
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          errors: { general: result.message || 'Failed to send message. Please try again.' }
        }));
        return;
      }

      // Success state
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true,
        submitCount: prev.submitCount + 1,
        data: {
          name: '',
          email: '',
          subject: '',
          service: '',
          message: '',
          newsletter: false
        }
      }));

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormState((prev) => ({ ...prev, isSuccess: false }));
      }, 5000);

    } catch (error) {
      // Network or other errors
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: { general: 'Network error. Please check your connection and try again.' }
      }));
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-jstar-blue/10 text-jstar-blue dark:text-jstar-blue rounded-full text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Let&apos;s Create Something Amazing Together
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Have a project in mind or want to discuss how we can work together? Drop us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Form */}
          <div className="glass rounded-2xl p-8 md:p-10 border border-gray-200/10">
            {formState.isSuccess ?
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AnimatedIcon
                  animation="bounce"
                  trigger="load"
                  duration={600}
                  delay={200}
                  className="text-green-600 dark:text-green-400"
                  aria-label="Success checkmark">
                  
                    <CheckCircleIcon className="w-8 h-8" />
                  </AnimatedIcon>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thank you for reaching out. I&apos;ve received your message and will get back to you within 24 hours.
                  {formState.data.newsletter && " You'll also receive our weekly creator tips and updates."}
                </p>
                <button
                onClick={() => setFormState((prev) => ({ ...prev, isSuccess: false }))}
                className="px-6 py-2 bg-jstar-blue text-white rounded-lg hover:bg-jstar-blue/90 transition-colors">
                
                  Send Another Message
                </button>
              </div> :

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Name *
                    </label>
                    <div className="relative">
                      <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.data.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                      formState.errors.name ?
                      'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' :
                      'border-gray-300 dark:border-gray-600 focus:ring-jstar-blue/50 focus:border-jstar-blue'} bg-white dark:bg-gray-800 focus:ring-2 outline-none transition`
                      }
                      placeholder="John Doe"
                      disabled={formState.isSubmitting} />
                    
                      {formState.errors.name &&
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-pulse">
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                    }
                    </div>
                    {formState.errors.name &&
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formState.errors.name}</p>
                  }
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.data.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                      formState.errors.email ?
                      'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' :
                      'border-gray-300 dark:border-gray-600 focus:ring-jstar-blue/50 focus:border-jstar-blue'} bg-white dark:bg-gray-800 focus:ring-2 outline-none transition`
                      }
                      placeholder="john@example.com"
                      disabled={formState.isSubmitting} />
                    
                      {formState.errors.email &&
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-pulse">
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                    }
                    </div>
                    {formState.errors.email &&
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formState.errors.email}</p>
                  }
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Service Interest *
                  </label>
                  <div className="relative">
                    <select
                    id="service"
                    name="service"
                    value={formState.data.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                    formState.errors.service ?
                    'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' :
                    'border-gray-300 dark:border-gray-600 focus:ring-jstar-blue/50 focus:border-jstar-blue'} bg-white dark:bg-gray-800 focus:ring-2 outline-none transition`
                    }
                    disabled={formState.isSubmitting}>
                    
                      {serviceOptions.map((option) =>
                    <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                    )}
                    </select>
                    {formState.errors.service &&
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-pulse">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                  }
                  </div>
                  {formState.errors.service &&
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formState.errors.service}</p>
                }
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject *
                  </label>
                  <div className="relative">
                    <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.data.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                    formState.errors.subject ?
                    'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' :
                    'border-gray-300 dark:border-gray-600 focus:ring-jstar-blue/50 focus:border-jstar-blue'} bg-white dark:bg-gray-800 focus:ring-2 outline-none transition`
                    }
                    placeholder="Project inquiry"
                    disabled={formState.isSubmitting} />
                  
                    {formState.errors.subject &&
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-pulse">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                  }
                  </div>
                  {formState.errors.subject &&
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formState.errors.subject}</p>
                }
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Message *
                  </label>
                  <div className="relative">
                    <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formState.data.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                    formState.errors.message ?
                    'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' :
                    'border-gray-300 dark:border-gray-600 focus:ring-jstar-blue/50 focus:border-jstar-blue'} bg-white dark:bg-gray-800 focus:ring-2 outline-none transition`
                    }
                    placeholder="Tell me about your project..."
                    disabled={formState.isSubmitting} />
                  
                    {formState.errors.message &&
                  <div className="absolute right-3 top-4 animate-pulse">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                  }
                  </div>
                  {formState.errors.message &&
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formState.errors.message}</p>
                }
                </div>

                <div className="flex items-center">
                  <input
                  id="newsletter"
                  name="newsletter"
                  type="checkbox"
                  checked={formState.data.newsletter}
                  onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                  className="w-4 h-4 text-jstar-blue border-gray-300 rounded focus:ring-jstar-blue"
                  disabled={formState.isSubmitting} />
                
                  <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Subscribe to my newsletter for creator tips and updates
                  </label>
                </div>

                {formState.errors.general &&
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{formState.errors.general}</p>
                  </div>
              }

                <div>
                  <button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-jstar-blue to-faith-purple text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none">
                  
                    {formState.isSubmitting ?
                  <div className="flex items-center justify-center">
                        <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Sending Message...
                      </div> :

                  'Send Message'
                  }
                  </button>
                </div>
              </form>
            }
          </div>

          {/* Client Quote & Contact Info */}
          <div className="space-y-8">
            {/* Client Quote Card */}
            <div className="glass rounded-2xl p-6 border border-gray-200/10 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-jstar-blue to-faith-purple flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic mb-4">"Working with J StaR Films was an absolute game-changer for our brand. Their attention to detail and creative vision brought our story to life in ways we couldn&apos;t have imagined. The entire process was smooth, professional, and exceeded our expectations at every turn."</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-jstar-blue to-faith-purple flex-shrink-0"></div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 dark:text-white">Sarah Johnson</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Marketing Director, TechNova</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-jstar-blue/10 dark:bg-jstar-blue/20 flex items-center justify-center text-jstar-blue dark:text-jstar-blue">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email us</h3>
                  <p className="text-base text-gray-900 dark:text-white">hello@jstarfilms.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-faith-purple/10 dark:bg-faith-purple/20 flex items-center justify-center text-faith-purple dark:text-faith-purple">
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Call us</h3>
                  <p className="text-base text-gray-900 dark:text-white">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-growth-green/10 dark:bg-growth-green/20 flex items-center justify-center text-growth-green dark:text-growth-green">
                  <MapPinIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Visit us</h3>
                  <p className="text-base text-gray-900 dark:text-white">123 Creative Lane, Suite 100<br />San Francisco, CA 94107</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-sacred-gold/10 dark:bg-sacred-gold/20 flex items-center justify-center text-sacred-gold dark:text-sacred-gold">
                  <ClockIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Working hours</h3>
                  <p className="text-base text-gray-900 dark:text-white">Monday - Friday: 9am - 6pm<br />Saturday: 10am - 4pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default ContactSection;