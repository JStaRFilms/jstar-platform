'use client';

import React, { useState, useEffect, useCallback } from 'react';

/**
 * AI Provider type from API
 */
interface AIProviderDisplay {
    id: string;
    name: string;
    displayName: string;
    hasApiKey: boolean;
    baseUrl: string | null;
    isEnabled: boolean;
    sortOrder: number;
    modelCount: number;
}

/**
 * AI Model type from API
 */
interface AIModelDisplay {
    id: string;
    modelId: string;
    displayName: string;
    description: string | null;
    minTier: string;
    contextWindow: number | null;
    hasVision: boolean;
    hasImageGen: boolean;
    isPremium: boolean;
    isFeatured: boolean;
    tags: string[];
    iconUrl: string | null;
    isDefault: boolean;
    isActive: boolean;
    sortOrder: number;
    provider: {
        id: string;
        name: string;
        displayName: string;
        isEnabled: boolean;
    };
}

/**
 * Admin AI Models Page
 * Manage AI providers (API keys) and models (tier requirements)
 * Located at /admin/johngpt-config/ai-models
 */
export default function AIModelsPage() {
    const [activeTab, setActiveTab] = useState<'providers' | 'models'>('providers');
    const [providers, setProviders] = useState<AIProviderDisplay[]>([]);
    const [models, setModels] = useState<AIModelDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [showProviderForm, setShowProviderForm] = useState(false);
    const [showModelForm, setShowModelForm] = useState(false);
    const [editingProvider, setEditingProvider] = useState<AIProviderDisplay | null>(null);
    const [editingModel, setEditingModel] = useState<AIModelDisplay | null>(null);

    // Fetch providers
    const fetchProviders = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/ai-providers');
            if (!res.ok) throw new Error('Failed to fetch providers');
            const data = await res.json();
            setProviders(data.providers);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    }, []);

    // Fetch models
    const fetchModels = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/ai-models');
            if (!res.ok) throw new Error('Failed to fetch models');
            const data = await res.json();
            setModels(data.models);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchProviders(), fetchModels()]);
            setLoading(false);
        };
        loadData();
    }, [fetchProviders, fetchModels]);

    // Toggle provider enabled
    const toggleProvider = async (provider: AIProviderDisplay) => {
        try {
            const res = await fetch(`/api/admin/ai-providers/${provider.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isEnabled: !provider.isEnabled }),
            });
            if (!res.ok) throw new Error('Failed to update provider');
            await fetchProviders();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    // Toggle model active
    const toggleModel = async (model: AIModelDisplay) => {
        try {
            const res = await fetch(`/api/admin/ai-models/${model.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !model.isActive }),
            });
            if (!res.ok) throw new Error('Failed to update model');
            await fetchModels();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    // Set default model
    const setDefaultModel = async (model: AIModelDisplay) => {
        try {
            const res = await fetch(`/api/admin/ai-models/${model.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isDefault: true }),
            });
            if (!res.ok) throw new Error('Failed to set default model');
            await fetchModels();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    // Toggle featured
    const toggleFeatured = async (model: AIModelDisplay) => {
        try {
            const res = await fetch(`/api/admin/ai-models/${model.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFeatured: !model.isFeatured }),
            });
            if (!res.ok) throw new Error('Failed to update featured');
            await fetchModels();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    // Move model order
    const moveModel = async (model: AIModelDisplay, direction: 'up' | 'down') => {
        const sortedModels = [...models].sort((a, b) => a.sortOrder - b.sortOrder);
        const currentIndex = sortedModels.findIndex(m => m.id === model.id);
        const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (swapIndex < 0 || swapIndex >= sortedModels.length) return;

        const swapModel = sortedModels[swapIndex];
        const currentOrder = model.sortOrder;
        const swapOrder = swapModel.sortOrder;

        try {
            // Update both models' sort orders
            await Promise.all([
                fetch(`/api/admin/ai-models/${model.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sortOrder: swapOrder }),
                }),
                fetch(`/api/admin/ai-models/${swapModel.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sortOrder: currentOrder }),
                }),
            ]);
            await fetchModels();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    // Delete provider
    const deleteProvider = async (id: string) => {
        if (!confirm('Delete this provider and all its models?')) return;
        try {
            const res = await fetch(`/api/admin/ai-providers/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete provider');
            await fetchProviders();
            await fetchModels();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    // Delete model
    const deleteModel = async (id: string) => {
        if (!confirm('Delete this model?')) return;
        try {
            const res = await fetch(`/api/admin/ai-models/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete model');
            await fetchModels();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    const tierBadgeClass = (tier: string) => {
        switch (tier) {
            case 'ADMIN': return 'bg-red-500 text-white';
            case 'TIER3': return 'bg-purple-500 text-white';
            case 'TIER2': return 'bg-blue-500 text-white';
            case 'TIER1': return 'bg-green-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Models</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage AI providers and model configurations
                    </p>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="absolute top-0 right-0 px-4 py-3">
                        ×
                    </button>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('providers')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'providers'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Providers ({providers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('models')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'models'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Models ({models.length})
                    </button>
                </nav>
            </div>

            {/* Providers Tab */}
            {activeTab === 'providers' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => { setEditingProvider(null); setShowProviderForm(true); }}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            + Add Provider
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {providers.map((provider) => (
                            <div
                                key={provider.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {provider.displayName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {provider.displayName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {provider.name} • {provider.modelCount} models
                                                {provider.hasApiKey && ' • API Key set'}
                                                {provider.baseUrl && ` • ${provider.baseUrl}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => toggleProvider(provider)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${provider.isEnabled
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                }`}
                                        >
                                            {provider.isEnabled ? 'Enabled' : 'Disabled'}
                                        </button>
                                        <button
                                            onClick={() => { setEditingProvider(provider); setShowProviderForm(true); }}
                                            className="text-blue-600 hover:text-blue-800 px-2 py-1"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteProvider(provider.id)}
                                            className="text-red-600 hover:text-red-800 px-2 py-1"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {providers.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No providers configured. Add one to get started.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Models Tab */}
            {activeTab === 'models' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => { setEditingModel(null); setShowModelForm(true); }}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            disabled={providers.length === 0}
                        >
                            + Add Model
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {[...models].sort((a, b) => a.sortOrder - b.sortOrder).map((model, index, sortedModels) => (
                            <div
                                key={model.id}
                                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border ${model.isDefault ? 'border-green-500' :
                                        model.isFeatured ? 'border-yellow-500' :
                                            'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    {/* Sort Controls */}
                                    <div className="flex flex-col gap-1 mr-3">
                                        <button
                                            onClick={() => moveModel(model, 'up')}
                                            disabled={index === 0}
                                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move up"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                        </button>
                                        <span className="text-xs text-gray-400 text-center">{model.sortOrder}</span>
                                        <button
                                            onClick={() => moveModel(model, 'down')}
                                            disabled={index === sortedModels.length - 1}
                                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move down"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 flex-wrap gap-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {model.displayName}
                                            </h3>
                                            {model.isDefault && (
                                                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                                    DEFAULT
                                                </span>
                                            )}
                                            {model.isFeatured && (
                                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                    ⭐ FEATURED
                                                </span>
                                            )}
                                            {model.isPremium && (
                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                    PREMIUM
                                                </span>
                                            )}
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${tierBadgeClass(model.minTier)}`}>
                                                {model.minTier}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {model.provider.displayName} • {model.modelId}
                                            {model.contextWindow && ` • ${model.contextWindow >= 1000000 ? `${(model.contextWindow / 1000000).toFixed(model.contextWindow % 1000000 === 0 ? 0 : 1)}M` : `${(model.contextWindow / 1000).toFixed(0)}K`} context`}
                                            {model.hasVision && ' • 👁️ Vision'}
                                            {model.hasImageGen && ' • 🎨 Image Gen'}
                                        </p>
                                        {model.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{model.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-1 flex-wrap gap-1">
                                        <button
                                            onClick={() => toggleFeatured(model)}
                                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${model.isFeatured
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                                }`}
                                            title="Toggle featured"
                                        >
                                            ⭐
                                        </button>
                                        <button
                                            onClick={() => toggleModel(model)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${model.isActive
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                }`}
                                        >
                                            {model.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                        {!model.isDefault && (
                                            <button
                                                onClick={() => setDefaultModel(model)}
                                                className="text-green-600 hover:text-green-800 px-2 py-1 text-sm"
                                            >
                                                Set Default
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { setEditingModel(model); setShowModelForm(true); }}
                                            className="text-blue-600 hover:text-blue-800 px-2 py-1"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteModel(model.id)}
                                            className="text-red-600 hover:text-red-800 px-2 py-1"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {models.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No models configured. {providers.length === 0 ? 'Add a provider first.' : 'Add one to get started.'}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Provider Form Modal */}
            {showProviderForm && (
                <ProviderFormModal
                    provider={editingProvider}
                    onClose={() => { setShowProviderForm(false); setEditingProvider(null); }}
                    onSave={async () => { await fetchProviders(); setShowProviderForm(false); setEditingProvider(null); }}
                />
            )}

            {/* Model Form Modal */}
            {showModelForm && (
                <ModelFormModal
                    model={editingModel}
                    providers={providers}
                    onClose={() => { setShowModelForm(false); setEditingModel(null); }}
                    onSave={async () => { await fetchModels(); setShowModelForm(false); setEditingModel(null); }}
                />
            )}
        </div>
    );
}

/**
 * Provider Form Modal Component
 */
function ProviderFormModal({
    provider,
    onClose,
    onSave,
}: {
    provider: AIProviderDisplay | null;
    onClose: () => void;
    onSave: () => Promise<void>;
}) {
    const [name, setName] = useState(provider?.name || '');
    const [displayName, setDisplayName] = useState(provider?.displayName || '');
    const [apiKey, setApiKey] = useState('');
    const [baseUrl, setBaseUrl] = useState(provider?.baseUrl || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const method = provider ? 'PATCH' : 'POST';
            const url = provider ? `/api/admin/ai-providers/${provider.id}` : '/api/admin/ai-providers';
            const body = provider
                ? { displayName, apiKey: apiKey || undefined, baseUrl: baseUrl || undefined }
                : { name, displayName, apiKey: apiKey || undefined, baseUrl: baseUrl || undefined };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save provider');
            }

            await onSave();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {provider ? 'Edit Provider' : 'Add Provider'}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!provider && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Provider ID
                            </label>
                            <select
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    // Auto-fill display name
                                    const names: Record<string, string> = {
                                        openai: 'OpenAI',
                                        google: 'Google Gemini',
                                        groq: 'Groq',
                                        anthropic: 'Anthropic',
                                        openrouter: 'OpenRouter',
                                    };
                                    setDisplayName(names[e.target.value] || '');
                                }}
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">Select provider...</option>
                                <option value="openai">openai</option>
                                <option value="google">google</option>
                                <option value="groq">groq</option>
                                <option value="anthropic">anthropic</option>
                                <option value="openrouter">openrouter</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            API Key {provider?.hasApiKey && '(leave blank to keep current)'}
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={provider?.hasApiKey ? '••••••••' : 'Enter API key...'}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave blank to use environment variable fallback</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Base URL (optional)
                        </label>
                        <input
                            type="url"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">For OpenRouter, Ollama, or local endpoints</p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/**
 * Model Form Modal Component
 */
function ModelFormModal({
    model,
    providers,
    onClose,
    onSave,
}: {
    model: AIModelDisplay | null;
    providers: AIProviderDisplay[];
    onClose: () => void;
    onSave: () => Promise<void>;
}) {
    const [providerId, setProviderId] = useState(model?.provider.id || '');
    const [modelId, setModelId] = useState(model?.modelId || '');
    const [displayName, setDisplayName] = useState(model?.displayName || '');
    const [description, setDescription] = useState(model?.description || '');
    const [minTier, setMinTier] = useState(model?.minTier || 'GUEST');
    const [contextWindow, setContextWindow] = useState(model?.contextWindow?.toString() || '');
    const [hasVision, setHasVision] = useState(model?.hasVision || false);
    const [hasImageGen, setHasImageGen] = useState(model?.hasImageGen || false);
    const [isPremium, setIsPremium] = useState(model?.isPremium || false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const method = model ? 'PATCH' : 'POST';
            const url = model ? `/api/admin/ai-models/${model.id}` : '/api/admin/ai-models';
            const body = {
                ...(model ? {} : { providerId, modelId }),
                displayName,
                description: description || null,
                minTier,
                contextWindow: contextWindow ? parseInt(contextWindow) : null,
                hasVision,
                hasImageGen,
                isPremium,
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save model');
            }

            await onSave();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {model ? 'Edit Model' : 'Add Model'}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!model && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Provider
                                </label>
                                <select
                                    value={providerId}
                                    onChange={(e) => setProviderId(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select provider...</option>
                                    {providers.map((p) => (
                                        <option key={p.id} value={p.id}>{p.displayName}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Model ID
                                </label>
                                <input
                                    type="text"
                                    value={modelId}
                                    onChange={(e) => setModelId(e.target.value)}
                                    required
                                    placeholder="e.g., gpt-4o, gemini-2.5-flash"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            placeholder="e.g., GPT-4o"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Minimum Tier
                            </label>
                            <select
                                value={minTier}
                                onChange={(e) => setMinTier(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="GUEST">GUEST (Free)</option>
                                <option value="TIER1">TIER 1</option>
                                <option value="TIER2">TIER 2</option>
                                <option value="TIER3">TIER 3</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Context Window
                            </label>
                            <input
                                type="number"
                                value={contextWindow}
                                onChange={(e) => setContextWindow(e.target.value)}
                                placeholder="e.g., 128000"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={hasVision}
                                onChange={(e) => setHasVision(e.target.checked)}
                                className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Has Vision (image input)</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={hasImageGen}
                                onChange={(e) => setHasImageGen(e.target.checked)}
                                className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Has Image Generation</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={isPremium}
                                onChange={(e) => setIsPremium(e.target.checked)}
                                className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Premium (counts against Tier 1 daily limit)</span>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
