import React from 'react';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { PlayCircleIcon } from '@/components/icons/static-icons';

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
                <AnimatedIcon
                  animation="spin"
                  trigger="load"
                  isEnabled={true}
                  respectReducedMotion={false}
                  className="text-white"
                  aria-hidden={true}
                >
                  <div className="rounded-full h-4 w-4 border border-white border-t-transparent"></div>
                </AnimatedIcon>
                Running Diagnostics...
              </>
            ) : (
              <>
                <AnimatedIcon
                  animation="scale"
                  trigger="hover"
                  duration={300}
                  className="text-white"
                  aria-label="Run diagnostics"
                >
                  <PlayCircleIcon className="h-4 w-4" />
                </AnimatedIcon>
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
