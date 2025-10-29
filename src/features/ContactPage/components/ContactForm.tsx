
'use client';

import React, { useState, useCallback, useEffect } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  service: string;
  message: string;
  newsletter: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  service?: string;
  message?: string;
  newsletter?: string;
  general?: string;
}

interface FormState {
  data: ContactFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
  submitCount: number;
}

const ContactForm = () => {
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

  // Validation rules from documentation
  const validateField = useCallback((name: keyof ContactFormData, value: string | boolean): string | undefined => {
    switch (name) {
      case 'name':
        if (!value || typeof value === 'string' && value.trim().length < 2) {
          return 'Name is required and must be at least 2 characters.';
        }
        break;
      case 'email':
        if (!value) {
          return 'Email address is required.';
        }
        if (typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Please enter a valid email address.';
          }
        }
        break;
      case 'subject':
        if (!value || typeof value === 'string' && !value.trim()) {
          return 'Subject is required.';
        }
        break;
      case 'service':
        if (!value || typeof value === 'string' && !value) {
          return 'Please select a service.';
        }
        break;
      case 'message':
        if (!value || typeof value === 'string' && value.trim().length < 10) {
          return 'Message is required and must be at least 10 characters.';
        }
        break;
    }
    return undefined;
  }, []);

  // Real-time validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Only validate fields that can have validation errors (exclude newsletter)
    const fieldsToValidate: (keyof ContactFormData)[] = ['name', 'email', 'subject', 'service', 'message'];

    fieldsToValidate.forEach((fieldName) => {
      const error = validateField(fieldName, formState.data[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setFormState((prev) => ({
      ...prev,
      errors: newErrors
    }));

    return isValid;
  }, [formState.data, validateField]);

  // Handle input changes with real-time validation
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const fieldName = name as keyof ContactFormData;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormState((prev) => {
      const newErrors = { ...prev.errors };

      // Only clear errors for fields that can have validation errors
      if (fieldName !== 'newsletter') {
        newErrors[fieldName as keyof FormErrors] = undefined;
      }

      return {
        ...prev,
        data: {
          ...prev.data,
          [fieldName]: fieldValue
        },
        errors: newErrors,
        isSuccess: false // Clear success state when user starts typing
      };
    });

    // Real-time validation for specific fields
    if (fieldName === 'email' || fieldName === 'name' || fieldName === 'message') {
      const error = validateField(fieldName, fieldValue);
      if (error) {
        setFormState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [fieldName]: error
          }
        }));
      }
    }
  }, [validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      errors: { ...prev.errors, general: undefined },
      submitCount: prev.submitCount + 1
    }));

    try {
      // Submit to API as per documentation
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState.data)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error types from documentation
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait before trying again.');
        } else if (response.status === 400) {
          // Handle validation errors from server
          const serverErrors = data.errors || [];
          const errorMessages = serverErrors.join(' ');
          throw new Error(errorMessages || data.message || 'Validation failed. Please check your input.');
        } else {
          throw new Error(data.message || 'Failed to send message. Please try again.');
        }
      }

      // Success - matches documentation response format
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true,
        errors: {},
        data: {
          name: '',
          email: '',
          subject: '',
          service: '',
          message: '',
          newsletter: false
        }
      }));

      // Auto-dismiss success message after 5 seconds
      setTimeout(() => {
        setFormState((prev) => ({
          ...prev,
          isSuccess: false
        }));
      }, 5000);

    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: {
          ...prev.errors,
          general: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
        }
      }));
    }
  }, [formState.data, validateForm]);

  return (
    <div className="bg-card rounded-2xl p-8 shadow-lg form-card">
      <h2 className="text-3xl font-bold text-foreground mb-6">Send a Message</h2>
      <p className="text-muted-foreground mb-8">
        Have a project in mind or want to learn more about my services? Fill out the form below and I&apos;ll get back to you within 24 hours.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formState.data.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-jstar-blue focus:border-transparent dark:bg-gray-700 dark:text-white ${
            formState.errors.name ?
            'border-red-500 dark:border-red-400' :
            'border-gray-300 dark:border-gray-600'}`
            }
            placeholder="John Doe"
            aria-describedby={formState.errors.name ? "name-error" : undefined}
            aria-invalid={!!formState.errors.name}
            required />

          {formState.errors.name &&
          <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {formState.errors.name}
            </p>
          }
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.data.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-jstar-blue focus:border-transparent dark:bg-gray-700 dark:text-white ${
            formState.errors.email ?
            'border-red-500 dark:border-red-400' :
            'border-gray-300 dark:border-gray-600'}`
            }
            placeholder="john@example.com"
            aria-describedby={formState.errors.email ? "email-error" : undefined}
            aria-invalid={!!formState.errors.email}
            required />

          {formState.errors.email &&
          <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {formState.errors.email}
            </p>
          }
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
            Subject <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formState.data.subject}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-jstar-blue focus:border-transparent dark:bg-gray-700 dark:text-white ${
            formState.errors.subject ?
            'border-red-500 dark:border-red-400' :
            'border-gray-300 dark:border-gray-600'}`
            }
            placeholder="Brief description of your inquiry"
            aria-describedby={formState.errors.subject ? "subject-error" : undefined}
            aria-invalid={!!formState.errors.subject}
            required />

          {formState.errors.subject &&
          <p id="subject-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {formState.errors.subject}
            </p>
          }
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-foreground mb-2">
            Service Interest <span className="text-destructive">*</span>
          </label>
          <select
            id="service"
            name="service"
            value={formState.data.service}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-jstar-blue focus:border-transparent dark:bg-gray-700 dark:text-white ${
            formState.errors.service ?
            'border-red-500 dark:border-red-400' :
            'border-gray-300 dark:border-gray-600'}`
            }
            aria-describedby={formState.errors.service ? "service-error" : undefined}
            aria-invalid={!!formState.errors.service}
            required>

            <option value="">Select a service</option>
            <option value="wedding">Wedding Cinematography</option>
            <option value="corporate">Corporate Videos</option>
            <option value="app">App Development</option>
            <option value="ai">AI Creator Tools</option>
            <option value="consulting">Consulting</option>
            <option value="other">Other</option>
          </select>
          {formState.errors.service &&
          <p id="service-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {formState.errors.service}
            </p>
          }
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
            Your Message <span className="text-destructive">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formState.data.message}
            onChange={handleInputChange}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-jstar-blue focus:border-transparent dark:bg-gray-700 dark:text-white ${
            formState.errors.message ?
            'border-red-500 dark:border-red-400' :
            'border-gray-300 dark:border-gray-600'}`
            }
            placeholder="Tell me about your project..."
            aria-describedby={formState.errors.message ? "message-error" : undefined}
            aria-invalid={!!formState.errors.message}
            required />

          {formState.errors.message &&
          <p id="message-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {formState.errors.message}
            </p>
          }
        </div>

        <div className="flex items-center">
          <input
            id="newsletter"
            name="newsletter"
            type="checkbox"
            checked={formState.data.newsletter}
            onChange={handleInputChange}
            className="w-4 h-4 text-jstar-blue border-gray-300 rounded focus:ring-jstar-blue" />

          <label htmlFor="newsletter" className="ml-2 block text-sm text-foreground">
            Subscribe to my newsletter for creator tips and updates
          </label>
        </div>

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full px-6 py-4 bg-gradient-to-r from-jstar-blue to-faith-purple text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-describedby={formState.errors.general ? "general-error" : undefined}>

          {formState.isSubmitting ?
          <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" aria-hidden="true"></div>
              Sending...
            </> :

          'Send Message'
          }
        </button>
      </form>

      {/* Success Message */}
      {formState.isSuccess &&
      <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="text-sm text-green-800 dark:text-green-200" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Thank you for your message! I will get back to you within 24 hours.
              {formState.data.newsletter &&
            <span className="block mt-1 text-xs">
                  You&apos;ll also receive a confirmation email about your newsletter subscription.
                </span>
            }
            </div>
          </div>
        </div>
      }

      {/* General Error Message */}
      {formState.errors.general &&
      <div className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="text-sm text-red-800 dark:text-red-200" role="alert" id="general-error">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {formState.errors.general}
            </div>
          </div>
        </div>
      }
    </div>);

};

export default ContactForm;
