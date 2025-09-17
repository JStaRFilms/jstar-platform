'use client';

import React, { useState } from 'react';
import { HeroSlide } from '../hooks/useHeroSlides';

/**
 * Props for CreateSlideForm component
 */
interface CreateSlideFormProps {
  /** Callback when form is submitted */
  onSubmit: (slideData: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Loading state */
  loading?: boolean;
}

/**
 * CreateSlideForm Component
 * Form for creating new hero slides
 * Mobile-first responsive design with proper validation
 */
const CreateSlideForm: React.FC<CreateSlideFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    titleLine1: '',
    titleLine2: '',
    tagline: '',
    description: '',
    imageUrl: '',
    gradient: 'from-blue-500 to-purple-600',
    buttonGradient: 'from-blue-500 to-purple-600',
    buttonBorder: 'border-blue-500',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-blue-600',
    isActive: true,
    sortOrder: 0,
    altText: '',
    projectTitle: '',
    projectDesc: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titleLine1.trim()) {
      newErrors.titleLine1 = 'Title Line 1 is required';
    }

    if (!formData.titleLine2.trim()) {
      newErrors.titleLine2 = 'Title Line 2 is required';
    }

    if (!formData.tagline.trim()) {
      newErrors.tagline = 'Tagline is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        titleLine1: '',
        titleLine2: '',
        tagline: '',
        description: '',
        imageUrl: '',
        gradient: 'from-blue-500 to-purple-600',
        buttonGradient: 'from-blue-500 to-purple-600',
        buttonBorder: 'border-blue-500',
        buttonText: 'text-white',
        buttonHover: 'hover:bg-blue-600',
        isActive: true,
        sortOrder: 0,
        altText: '',
        projectTitle: '',
        projectDesc: '',
      });
      setErrors({});
    } catch (err) {
      console.error('Failed to create slide:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Basic Information
        </h3>

        {/* Title Fields - Mobile Stack, Desktop Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title Line 1 */}
          <div>
            <label
              htmlFor="titleLine1"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Slide Title (Line 1) *
            </label>
            <input
              id="titleLine1"
              type="text"
              value={formData.titleLine1}
              onChange={(e) => handleInputChange('titleLine1', e.target.value)}
              placeholder="Elevate Your Story"
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                errors.titleLine1 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={loading}
              aria-describedby={errors.titleLine1 ? "titleLine1-error" : undefined}
              aria-invalid={!!errors.titleLine1}
            />
            {errors.titleLine1 && (
              <p id="titleLine1-error" className="text-red-500 text-xs mt-1" role="alert">
                {errors.titleLine1}
              </p>
            )}
          </div>

          {/* Title Line 2 */}
          <div>
            <label
              htmlFor="titleLine2"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Slide Title (Line 2) *
            </label>
            <input
              id="titleLine2"
              type="text"
              value={formData.titleLine2}
              onChange={(e) => handleInputChange('titleLine2', e.target.value)}
              placeholder="With Purpose & Excellence"
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                errors.titleLine2 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={loading}
              aria-describedby={errors.titleLine2 ? "titleLine2-error" : undefined}
              aria-invalid={!!errors.titleLine2}
            />
            {errors.titleLine2 && (
              <p id="titleLine2-error" className="text-red-500 text-xs mt-1" role="alert">
                {errors.titleLine2}
              </p>
            )}
          </div>
        </div>

        {/* Tagline */}
        <div>
          <label
            htmlFor="tagline"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Tagline *
          </label>
          <input
            id="tagline"
            type="text"
            value={formData.tagline}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
            placeholder="Creative Vision, Technical Excellence"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
              errors.tagline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={loading}
            aria-describedby={errors.tagline ? "tagline-error" : undefined}
            aria-invalid={!!errors.tagline}
          />
          {errors.tagline && (
            <p id="tagline-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.tagline}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Transform your ideas into compelling visual stories that resonate with audiences and reflect your values."
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-vertical ${
              errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={loading}
            aria-describedby={errors.description ? "description-error" : undefined}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p id="description-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* Media Section */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Media & Styling
        </h3>

        {/* Image URL */}
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Image URL *
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={`flex-1 px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                errors.imageUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={loading}
              aria-describedby={errors.imageUrl ? "imageUrl-error" : undefined}
              aria-invalid={!!errors.imageUrl}
            />
            <button
              type="button"
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              disabled={loading}
              aria-label="Upload image file"
            >
              <span className="hidden sm:inline">Upload</span>
              <span className="sm:hidden">📁</span>
            </button>
          </div>
          {errors.imageUrl && (
            <p id="imageUrl-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.imageUrl}
            </p>
          )}
        </div>

        {/* Gradient Selection - Mobile Stack, Desktop Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Background Gradient */}
          <div>
            <label
              htmlFor="gradient"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Background Gradient
            </label>
            <select
              id="gradient"
              value={formData.gradient}
              onChange={(e) => handleInputChange('gradient', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              disabled={loading}
              aria-label="Select background gradient"
            >
              <option value="from-blue-500 to-purple-600">Blue to Purple</option>
              <option value="from-purple-500 to-pink-600">Purple to Pink</option>
              <option value="from-blue-500 to-green-600">Blue to Green</option>
              <option value="from-gray-800 to-gray-900">Dark Gray</option>
              <option value="from-red-500 to-yellow-500">Red to Yellow</option>
            </select>
            <div className="mt-2">
              <div
                className={`h-6 rounded border border-gray-200 dark:border-gray-600 ${formData.gradient}`}
                aria-label={`Preview of ${formData.gradient.replace('from-', '').replace('to-', '').replace('-', ' to ')} gradient`}
              />
            </div>
          </div>

          {/* Button Gradient */}
          <div>
            <label
              htmlFor="buttonGradient"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Button Gradient
            </label>
            <select
              id="buttonGradient"
              value={formData.buttonGradient}
              onChange={(e) => handleInputChange('buttonGradient', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              disabled={loading}
              aria-label="Select button gradient"
            >
              <option value="from-blue-500 to-purple-600">Blue to Purple</option>
              <option value="from-purple-500 to-pink-600">Purple to Pink</option>
              <option value="from-blue-500 to-green-600">Blue to Green</option>
              <option value="from-red-500 to-yellow-500">Red to Yellow</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accessibility & Optional Section */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Accessibility & Optional
        </h3>

        {/* Alt Text */}
        <div>
          <label
            htmlFor="altText"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Alt Text (Accessibility)
          </label>
          <input
            id="altText"
            type="text"
            value={formData.altText}
            onChange={(e) => handleInputChange('altText', e.target.value)}
            placeholder="Video Production"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            disabled={loading}
            aria-label="Alternative text for image accessibility"
          />
        </div>

        {/* Project Overlay - Mobile Stack, Desktop Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="projectTitle"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Project Title (Optional)
            </label>
            <input
              id="projectTitle"
              type="text"
              value={formData.projectTitle}
              onChange={(e) => handleInputChange('projectTitle', e.target.value)}
              placeholder="Latest Project"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              disabled={loading}
              aria-label="Optional project title overlay"
            />
          </div>

          <div>
            <label
              htmlFor="projectDesc"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Project Description (Optional)
            </label>
            <input
              id="projectDesc"
              type="text"
              value={formData.projectDesc}
              onChange={(e) => handleInputChange('projectDesc', e.target.value)}
              placeholder="Brand Storytelling for Tech Startup"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              disabled={loading}
              aria-label="Optional project description overlay"
            />
          </div>
        </div>
      </div>

      {/* Form Actions - Mobile Stack, Desktop Side-by-Side */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto sm:flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          disabled={loading}
          aria-label="Cancel slide creation"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto sm:flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          disabled={loading}
          aria-label={loading ? "Creating slide..." : "Create new slide"}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            'Create Slide'
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateSlideForm;
