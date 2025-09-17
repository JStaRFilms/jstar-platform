import React, { useState } from 'react';
import { HeroSlide } from '../hooks/useHeroSlides';

/**
 * Props for CreateSlideForm component
 */
interface CreateSlideFormProps {
  onSubmit: (slideData: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * CreateSlideForm Component
 * Form for creating new hero slides
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Create New Slide</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Line 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Slide Title (Line 1) *
          </label>
          <input
            type="text"
            value={formData.titleLine1}
            onChange={(e) => handleInputChange('titleLine1', e.target.value)}
            placeholder="Elevate Your Story"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.titleLine1 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={loading}
          />
          {errors.titleLine1 && (
            <p className="text-red-500 text-sm mt-1">{errors.titleLine1}</p>
          )}
        </div>

        {/* Title Line 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Slide Title (Line 2) *
          </label>
          <input
            type="text"
            value={formData.titleLine2}
            onChange={(e) => handleInputChange('titleLine2', e.target.value)}
            placeholder="With Purpose & Excellence"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.titleLine2 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={loading}
          />
          {errors.titleLine2 && (
            <p className="text-red-500 text-sm mt-1">{errors.titleLine2}</p>
          )}
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tagline *
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
            placeholder="Creative Vision, Technical Excellence"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.tagline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={loading}
          />
          {errors.tagline && (
            <p className="text-red-500 text-sm mt-1">{errors.tagline}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Transform your ideas into compelling visual stories that resonate with audiences and reflect your values."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL *
          </label>
          <div className="flex">
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={`flex-1 px-4 py-3 border rounded-l-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.imageUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={loading}
            />
            <button
              type="button"
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              disabled={loading}
            >
              Upload
            </button>
          </div>
          {errors.imageUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
          )}
        </div>

        {/* Background Gradient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Background Gradient
          </label>
          <select
            value={formData.gradient}
            onChange={(e) => handleInputChange('gradient', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={loading}
          >
            <option value="from-blue-500 to-purple-600">Blue to Purple</option>
            <option value="from-purple-500 to-pink-600">Purple to Pink</option>
            <option value="from-blue-500 to-green-600">Blue to Green</option>
            <option value="from-gray-800 to-gray-900">Dark Gray</option>
            <option value="from-red-500 to-yellow-500">Red to Yellow</option>
          </select>
          <div className="mt-2">
            <div
              className={`gradient-preview h-8 rounded ${formData.gradient} border border-gray-200 dark:border-gray-600`}
            />
          </div>
        </div>

        {/* Button Gradient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Button Gradient
          </label>
          <select
            value={formData.buttonGradient}
            onChange={(e) => handleInputChange('buttonGradient', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={loading}
          >
            <option value="from-blue-500 to-purple-600">Blue to Purple</option>
            <option value="from-purple-500 to-pink-600">Purple to Pink</option>
            <option value="from-blue-500 to-green-600">Blue to Green</option>
            <option value="from-red-500 to-yellow-500">Red to Yellow</option>
          </select>
        </div>

        {/* Alt Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alt Text (Accessibility)
          </label>
          <input
            type="text"
            value={formData.altText}
            onChange={(e) => handleInputChange('altText', e.target.value)}
            placeholder="Video Production"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
        </div>

        {/* Project Overlay (Optional) */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Project Overlay (Optional)</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={formData.projectTitle}
                onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                placeholder="Latest Project"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Description
              </label>
              <textarea
                rows={2}
                value={formData.projectDesc}
                onChange={(e) => handleInputChange('projectDesc', e.target.value)}
                placeholder="Brand Storytelling for Tech Startup"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Slide'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSlideForm;
