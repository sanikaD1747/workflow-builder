import React, { useState, useEffect } from 'react';
import { History, ChevronDown, ChevronUp } from 'lucide-react';
import { runAPI } from '../services/api';

const STEP_LABELS = {
  clean: 'Clean Text',
  summarize: 'Summarize',
  keypoints: 'Extract Key Points',
  extract: 'Extract Key Points',
  tag: 'Tag Category',
};

function RunHistory() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRuns, setExpandedRuns] = useState(new Set());

  useEffect(() => {
    loadRuns();
  }, []);

  const loadRuns = async () => {
    try {
      const response = await runAPI.getAll();
      setRuns(response.data);
    } catch (err) {
      console.error('Error loading runs:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (runId) => {
    const newExpanded = new Set(expandedRuns);
    if (newExpanded.has(runId)) {
      newExpanded.delete(runId);
    } else {
      newExpanded.add(runId);
    }
    setExpandedRuns(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading run history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Run History</h2>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">View the last 5 workflow executions</p>
      </div>

      {runs.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No workflow runs yet</p>
          <p className="text-sm text-gray-400 mt-2">Execute a workflow to see results here</p>
        </div>
      ) : (
        <div className="space-y-4" data-testid="run-history-list">
          {runs.map((run) => {
            const isExpanded = expandedRuns.has(run._id);
            const statusColor = run.status === 'completed' ? 'green' : 'red';

            return (
              <div
                key={run._id}
                className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden"
                data-testid={`run-${run._id}`}
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpand(run._id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  data-testid={`run-header-${run._id}`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-3 h-3 rounded-full bg-${statusColor}-500`}></div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{run.workflowName}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(run.createdAt).toLocaleString()} • {run.steps.length} steps
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    {/* Original Input */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Original Input:</h4>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                          {run.input}
                        </p>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Processing Steps:</h4>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {run.steps.map((step, idx) => (
                          <React.Fragment key={idx}>
                            <div className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                              {STEP_LABELS[step]}
                            </div>
                            {idx < run.steps.length - 1 && (
                              <span className="text-gray-400 shrink-0">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Outputs */}
                    {run.outputs && run.outputs.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Step Outputs:</h4>
                        {run.outputs.map((output, idx) => (
                          <div
                            key={idx}
                            className="border-l-4 border-primary-500 bg-primary-50 p-3 rounded-r-md"
                            data-testid={`run-${run._id}-output-${idx}`}
                          >
                            <div className="flex items-center mb-1">
                              <span className="text-xs font-medium text-primary-700">
                                Step {idx + 1}: {STEP_LABELS[output.step]}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                              {output.output}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Error */}
                    {run.error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-700">Error: {run.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RunHistory;
