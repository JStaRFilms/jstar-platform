'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Filter, RefreshCw } from 'lucide-react';

interface DiagnosticRecord {
  id: string;
  type: string;
  status: 'PASSED' | 'WARNINGS' | 'FAILED';
  timestamp: string;
  duration?: number;
  title: string;
  summary: string;
  results: any;
  warnings: number;
  errors: number;
}

interface DiagnosticHistoryProps {
  refreshTrigger?: number; // Optional prop to trigger refresh
}

const DiagnosticHistory: React.FC<DiagnosticHistoryProps> = ({ refreshTrigger }) => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticRecord | null>(null);

  const fetchDiagnostics = async () => {
    try {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/admin/diagnostics?${params}`);
      const data = await response.json();

      if (data.status === 'success') {
        setDiagnostics(data.data);
      }
    } catch (error) {
      console.error('Error fetching diagnostic history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, [filterType, filterStatus]);

  // Refresh when triggered from parent
  useEffect(() => {
    if (refreshTrigger !== undefined) {
      fetchDiagnostics();
    }
  }, [refreshTrigger]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASSED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'WARNINGS':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'FAILED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'FULL_SYSTEM':
        return 'Full System Diagnostic';
      case 'AI_BENCHMARK':
        return 'AI Model Benchmark';
      case 'HARDWARE_BENCHMARK':
        return 'Hardware Benchmark';
      case 'STORAGE_SCAN':
        return 'Storage Scan';
      case 'NETWORK_TEST':
        return 'Network Test';
      default:
        return type.replace('_', ' ');
    }
  };

  const filteredDiagnostics = diagnostics.filter(diagnostic => {
    if (filterType !== 'all' && diagnostic.type !== filterType) return false;
    if (filterStatus !== 'all' && diagnostic.status !== filterStatus) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Diagnostic History</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Diagnostic History</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDiagnostics}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="FULL_SYSTEM">Full System</option>
                <option value="AI_BENCHMARK">AI Benchmark</option>
                <option value="HARDWARE_BENCHMARK">Hardware</option>
                <option value="STORAGE_SCAN">Storage</option>
                <option value="NETWORK_TEST">Network</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="PASSED">Passed</option>
                <option value="WARNINGS">Warnings</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredDiagnostics.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No diagnostic records found matching your filters.
            </div>
          ) : (
            filteredDiagnostics.map((diagnostic) => (
              <div
                key={diagnostic.id}
                className="benchmark-item p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {getTypeDisplayName(diagnostic.type)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimestamp(diagnostic.timestamp)}
                      {diagnostic.duration && (
                        <span className="ml-2">• {Math.round(diagnostic.duration / 1000)}s</span>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(diagnostic.status)}`}>
                    {diagnostic.status}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {diagnostic.summary}
                    {(diagnostic.warnings > 0 || diagnostic.errors > 0) && (
                      <span className="ml-2">
                        {diagnostic.warnings > 0 && `${diagnostic.warnings} warning${diagnostic.warnings > 1 ? 's' : ''}`}
                        {diagnostic.warnings > 0 && diagnostic.errors > 0 && ', '}
                        {diagnostic.errors > 0 && `${diagnostic.errors} error${diagnostic.errors > 1 ? 's' : ''}`}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedDiagnostic(diagnostic)}
                    className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Diagnostic Details Modal */}
      {selectedDiagnostic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {getTypeDisplayName(selectedDiagnostic.type)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {formatTimestamp(selectedDiagnostic.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDiagnostic(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedDiagnostic.status)}`}>
                        {selectedDiagnostic.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span>{selectedDiagnostic.duration ? `${Math.round(selectedDiagnostic.duration / 1000)}s` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Warnings:</span>
                      <span>{selectedDiagnostic.warnings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Errors:</span>
                      <span>{selectedDiagnostic.errors}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Results</h4>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto max-h-60">
                    {JSON.stringify(selectedDiagnostic.results, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiagnosticHistory;
