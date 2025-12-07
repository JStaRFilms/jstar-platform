'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { ModelSelectorItem, ModelsApiResponse } from '@/lib/ai/types';

/**
 * Props for ModelSelector component
 */
interface ModelSelectorProps {
    /** Currently selected model ID */
    selectedModelId: string | null;
    /** Callback when a model is selected */
    onSelectModel: (modelId: string) => void;
    /** Whether the selector is open */
    isOpen: boolean;
    /** Callback to close the selector */
    onClose: () => void;
}

/**
 * Model Selector Modal
 *
 * Displays available AI models in a grid with tier restrictions.
 * Used in the JohnGPT page header for model selection.
 */
export function ModelSelector({
    selectedModelId,
    onSelectModel,
    isOpen,
    onClose,
}: ModelSelectorProps) {
    const [models, setModels] = useState<ModelSelectorItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [dailyLimit, setDailyLimit] = useState<{ used: number; max: number; resetsAt: string | null } | null>(null);

    // Fetch available models
    const fetchModels = useCallback(async () => {
        try {
            const res = await fetch('/api/models');
            if (!res.ok) throw new Error('Failed to fetch models');
            const data: ModelsApiResponse = await res.json();
            setModels(data.models);
            setDailyLimit(data.dailyLimit || null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchModels();
        }
    }, [isOpen, fetchModels]);

    // Filter models by search query
    const filteredModels = models.filter((model) => {
        const query = searchQuery.toLowerCase();
        return (
            model.displayName.toLowerCase().includes(query) ||
            model.provider.displayName.toLowerCase().includes(query) ||
            model.modelId.toLowerCase().includes(query) ||
            model.tags.some((tag) => tag.toLowerCase().includes(query))
        );
    });

    // Group models by provider
    const modelsByProvider = filteredModels.reduce((acc, model) => {
        const providerName = model.provider.displayName;
        if (!acc[providerName]) {
            acc[providerName] = [];
        }
        acc[providerName].push(model);
        return acc;
    }, {} as Record<string, ModelSelectorItem[]>);

    const handleSelectModel = (model: ModelSelectorItem) => {
        if (!model.isAccessible) {
            // Show upgrade prompt
            alert(`Upgrade to ${model.requiredTier} to access this model`);
            return;
        }
        if (model.isPremium && !model.canUsePremium) {
            alert('You have reached your daily limit for premium models');
            return;
        }
        onSelectModel(model.id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Choose AI Model
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search models..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Daily limit info */}
                    {dailyLimit && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Premium usage: {dailyLimit.used}/{dailyLimit.max} today
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 p-4">{error}</div>
                    ) : filteredModels.length === 0 ? (
                        <div className="text-center text-gray-500 p-4">
                            {searchQuery ? 'No models match your search' : 'No models available'}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(modelsByProvider).map(([providerName, providerModels]) => (
                                <ProviderSection
                                    key={providerName}
                                    providerName={providerName}
                                    models={providerModels}
                                    selectedModelId={selectedModelId}
                                    onSelectModel={handleSelectModel}
                                    isSearching={searchQuery.length > 0}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const MAX_VISIBLE_MODELS = 5;

/**
 * Provider Section - Shows top 5 models with expand option
 */
function ProviderSection({
    providerName,
    models,
    selectedModelId,
    onSelectModel,
    isSearching,
}: {
    providerName: string;
    models: ModelSelectorItem[];
    selectedModelId: string | null;
    onSelectModel: (model: ModelSelectorItem) => void;
    isSearching: boolean;
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    // When searching, show all matching results
    const showAll = isSearching || isExpanded;
    const visibleModels = showAll ? models : models.slice(0, MAX_VISIBLE_MODELS);
    const hiddenCount = models.length - MAX_VISIBLE_MODELS;
    const hasMore = hiddenCount > 0;

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {providerName}
                    <span className="ml-2 text-xs font-normal normal-case">
                        ({models.length} models)
                    </span>
                </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                {visibleModels.map((model) => (
                    <ModelCard
                        key={model.id}
                        model={model}
                        isSelected={model.id === selectedModelId}
                        onSelect={() => onSelectModel(model)}
                    />
                ))}
            </div>
            {hasMore && !isSearching && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Show less
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Show {hiddenCount} more
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

/**
 * Individual Model Card Component
 */
function ModelCard({
    model,
    isSelected,
    onSelect,
}: {
    model: ModelSelectorItem;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const isLocked = !model.isAccessible;
    const isOverLimit = model.isPremium && !model.canUsePremium;
    const isDisabled = isLocked || isOverLimit;

    return (
        <button
            onClick={onSelect}
            disabled={isDisabled}
            className={`
        relative p-4 rounded-xl text-left transition-all duration-200
        ${isSelected
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-[1.02]'
                    : isDisabled
                        ? 'bg-gray-100 dark:bg-gray-700 opacity-60 cursor-not-allowed'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-md'
                }
      `}
        >
            {/* Lock overlay */}
            {isLocked && (
                <div className="absolute top-2 right-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-800 text-white text-xs rounded-full">
                        🔒 {model.requiredTier}
                    </span>
                </div>
            )}

            {/* Premium badge */}
            {model.isPremium && !isLocked && (
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        ⭐ PREMIUM
                    </span>
                </div>
            )}

            {/* Included badge */}
            {!model.isPremium && !isLocked && (
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-green-100 text-green-800'
                        }`}>
                        ✓ INCLUDED
                    </span>
                </div>
            )}

            <div className="pr-16">
                <h4 className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {model.displayName}
                </h4>
                <p className={`text-sm mt-1 ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {model.modelId}
                </p>
            </div>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-1 mt-3">
                {model.contextWindow && (
                    <span className={`px-2 py-0.5 text-xs rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}>
                        {model.contextWindow >= 1000000
                            ? `${(model.contextWindow / 1000000).toFixed(model.contextWindow % 1000000 === 0 ? 0 : 1)}M context`
                            : `${(model.contextWindow / 1000).toFixed(0)}K context`
                        }
                    </span>
                )}
                {model.hasVision && (
                    <span className={`px-2 py-0.5 text-xs rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        }`}>
                        👁️ Vision
                    </span>
                )}
                {model.hasImageGen && (
                    <span className={`px-2 py-0.5 text-xs rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        }`}>
                        🎨 Image Gen
                    </span>
                )}
            </div>

            {/* Description */}
            {model.description && (
                <p className={`text-xs mt-2 line-clamp-2 ${isSelected ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {model.description}
                </p>
            )}
        </button>
    );
}

/**
 * Model Indicator Button
 *
 * Small button showing current model, used in chat header.
 * Click to open the model selector.
 */
export function ModelIndicator({
    modelId,
    modelName,
    onClick,
}: {
    modelId: string | null;
    modelName: string | null;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="max-w-[120px] truncate">{modelName || 'Default Model'}</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    );
}
