import React from 'react';

interface DiagnosticHeaderProps {
  /** Whether diagnostics are currently running */
  isRunningDiagnostics: boolean;
  /** Callback to run full diagnostics */
  onRunDiagnostics: () => void;
  /** Callback to export report */
  onExportReport: () => void;
}

/**
 * DiagnosticHeader Component
 * Header section with title, description, and action buttons
 */
const DiagnosticHeader: React.FC<DiagnosticHeaderProps> = ({
  isRunningDiagnostics,
  onRunDiagnostics,
  onExportReport
}) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-admin-red to-red-500 bg-clip-text text-transparent">
            System Diagnostics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Hardware profiling, AI model health, and performance diagnostics
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onRunDiagnostics}
            disabled={isRunningDiagnostics}
            className="px-4 py-2 bg-gradient-to-r from-admin-red to-red-500 text-white rounded-lg font-medium btn-enhanced disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRunningDiagnostics ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent"></div>
                Running Diagnostics...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Run Full Diagnostic
              </>
            )}
          </button>
          <button
            onClick={onExportReport}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Export Report
          </button>
        </div>
      </div>
    </header>
  );
};

export default DiagnosticHeader;
