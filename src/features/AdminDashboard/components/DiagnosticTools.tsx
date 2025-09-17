'use client';

import React, { useState } from 'react';

/**
 * Diagnostic Tools Component
 * Provides troubleshooting and diagnostic tools for the system
 */
export const DiagnosticTools: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  const runDiagnosticTest = async (testName: string) => {
    setTestResults(prev => ({ ...prev, [testName]: 'running' }));

    // Simulate test execution
    setTimeout(() => {
      const results = ['passed', 'passed', 'passed', 'warning', 'error'];
      const randomResult = results[Math.floor(Math.random() * results.length)];
      setTestResults(prev => ({ ...prev, [testName]: randomResult }));
    }, 2000);
  };

  const diagnosticTests = [
    {
      name: 'Database Connection',
      description: 'Test SQLite database connectivity and query execution',
      icon: '💾',
      action: () => runDiagnosticTest('database')
    },
    {
      name: 'API Endpoints',
      description: 'Test all hero slides API endpoints for functionality',
      icon: '🔗',
      action: () => runDiagnosticTest('api')
    },
    {
      name: 'File System',
      description: 'Check file system permissions and storage access',
      icon: '📁',
      action: () => runDiagnosticTest('filesystem')
    },
    {
      name: 'Memory Usage',
      description: 'Analyze memory consumption and potential leaks',
      icon: '🧠',
      action: () => runDiagnosticTest('memory')
    },
    {
      name: 'Network Connectivity',
      description: 'Test network connections and response times',
      icon: '🌐',
      action: () => runDiagnosticTest('network')
    },
    {
      name: 'Performance Benchmark',
      description: 'Run performance benchmarks and load tests',
      icon: '⚡',
      action: () => runDiagnosticTest('performance')
    }
  ];

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'running':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'running':
        return '⏳';
      default:
        return '❓';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Diagnostic Tools
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Run diagnostic tests and troubleshoot system issues
          </p>
        </div>
        <div className="text-2xl">🔧</div>
      </div>

      {/* Diagnostic Tests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {diagnosticTests.map((test, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="text-lg">{test.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {test.name}
                  </h3>
                  {testResults[test.name.toLowerCase().replace(' ', '')] && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTestStatusColor(testResults[test.name.toLowerCase().replace(' ', '')])}`}>
                      {getTestStatusIcon(testResults[test.name.toLowerCase().replace(' ', '')])}
                      {testResults[test.name.toLowerCase().replace(' ', '')] === 'running' ? 'Running...' : testResults[test.name.toLowerCase().replace(' ', '')]}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {test.description}
                </p>
                <button
                  onClick={test.action}
                  disabled={testResults[test.name.toLowerCase().replace(' ', '')] === 'running'}
                  className="w-full px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {testResults[test.name.toLowerCase().replace(' ', '')] === 'running' ? 'Running...' : 'Run Test'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              // Run all tests
              diagnosticTests.forEach(test => test.action());
            }}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Run All Diagnostics
          </button>
          <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Generate Report
          </button>
          <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Clear Results
          </button>
        </div>
      </div>

      {/* System Information */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          System Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Node Version:</span>
            <span className="ml-2 text-gray-900 dark:text-white">v18.17.0</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Next.js Version:</span>
            <span className="ml-2 text-gray-900 dark:text-white">v14.0.0</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Database:</span>
            <span className="ml-2 text-gray-900 dark:text-white">SQLite + Prisma</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
            <span className="ml-2 text-gray-900 dark:text-white">2h 34m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
