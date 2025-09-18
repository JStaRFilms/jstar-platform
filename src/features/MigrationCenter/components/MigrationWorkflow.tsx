import React, { useState } from 'react';

/**
 * Migration Workflow Component
 * Displays the 4-step migration process with progress tracking
 */
export const MigrationWorkflow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(2); // Step 2 is "In Progress"

  const steps = [
    {
      id: 1,
      title: 'Schema Analysis',
      description: 'Compare current schema with target database',
      status: 'completed' as const,
      progress: 100,
      details: {
        match: '99.8%',
        records: '12,458 records',
        differences: '0 schema differences'
      }
    },
    {
      id: 2,
      title: 'Data Validation',
      description: 'Verify data integrity before migration',
      status: 'in-progress' as const,
      progress: 78,
      details: {
        validated: '9,717 records validated',
        remaining: '2,741 remaining'
      }
    },
    {
      id: 3,
      title: 'Migration Execution',
      description: 'Transfer validated data to target database',
      status: 'pending' as const,
      progress: 0,
      details: {
        target: 'Supabase',
        connection: 'Not established',
        estimated: '2.4 min'
      }
    },
    {
      id: 4,
      title: 'Verification',
      description: 'Confirm successful migration and data integrity',
      status: 'pending' as const,
      progress: 0,
      details: {
        type: 'Full',
        records: '12,458 records to verify',
        method: 'Hash comparison'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'pending': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return 'Pending';
    }
  };

  const handleResetWorkflow = () => {
    // TODO: Implement reset logic
    console.log('Resetting workflow...');
  };

  const handleExportSchema = () => {
    // TODO: Implement schema export
    console.log('Exporting schema...');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Migration Workflow</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleResetWorkflow}
            className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset Workflow
          </button>
          <button
            onClick={handleExportSchema}
            className="text-sm bg-red-50 dark:bg-red-900/20 text-admin-red px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Export Schema
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.id} className="migration-step p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-medium text-xs ${
                    step.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                    step.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {step.id}
                  </span>
                  <h3 className="font-medium text-gray-900 dark:text-white ml-2">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(step.status)}`}>
                {getStatusText(step.status)}
              </span>
            </div>

            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {step.status === 'completed' && (
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Schema Match</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{step.details.match}</span>
                </div>
              )}

              {step.status === 'in-progress' && (
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Validation Progress</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{step.progress}%</span>
                </div>
              )}

              {step.status === 'pending' && step.id === 3 && (
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Database</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{step.details.target}</span>
                </div>
              )}

              {step.status === 'pending' && step.id === 4 && (
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Verification Type</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{step.details.type}</span>
                </div>
              )}

              {(step.status === 'completed' || step.status === 'in-progress') && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-gradient-to-r from-admin-red to-red-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                {step.status === 'completed' && (
                  <>
                    <span>{step.details.records}</span>
                    <span>{step.details.differences}</span>
                  </>
                )}
                {step.status === 'in-progress' && (
                  <>
                    <span>{step.details.validated}</span>
                    <span>{step.details.remaining}</span>
                  </>
                )}
                {step.status === 'pending' && step.id === 3 && (
                  <>
                    <span>{step.details.connection}</span>
                    <span>{step.details.estimated}</span>
                  </>
                )}
                {step.status === 'pending' && step.id === 4 && (
                  <>
                    <span>{step.details.records}</span>
                    <span>{step.details.method}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
