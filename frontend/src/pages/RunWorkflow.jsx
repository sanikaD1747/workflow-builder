import React, { useState, useEffect } from 'react';
import { Play, Loader, CheckCircle, XCircle } from 'lucide-react';
import { workflowAPI, runAPI } from '../services/api';

const STEP_LABELS = {
  clean: 'Clean Text',
  summarize: 'Summarize',
  keypoints: 'Extract Key Points',
  tag: 'Tag Category',
};

function RunWorkflow() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
  const [inputText, setInputText] = useState('');
  const [executing, setExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const response = await workflowAPI.getAll();
      setWorkflows(response.data);
    } catch (err) {
      console.error('Error loading workflows:', err);
    }
  };

  const handleExecute = async (e) => {
    e.preventDefault();
    setError('');
    setResults(null);
    setCurrentStep(null);

    if (!selectedWorkflowId) {
      setError('Please select a workflow');
      return;
    }

    if (!inputText.trim()) {
      setError('Please enter some text to process');
      return;
    }

    setExecuting(true);

    try {
      // The instruction snippet implies a `setLoading` state, but `setExecuting` already exists.
      // Assuming `setExecuting` is the intended state for loading/execution.
      // If `setLoading` was meant to be a separate state, it would need to be defined.
      // For now, we'll keep `setExecuting(true)` as it aligns with the button's disabled state.
      // The instruction snippet also had `setLoading(true);` which is omitted here to avoid
      // introducing an undefined state variable and to maintain consistency with `setExecuting`.

      await runAPI.execute({
        workflowId: selectedWorkflowId, // Kept selectedWorkflowId as it's the ID, not the object
        initialInput: inputText, // Changed 'input' to 'initialInput' and used 'inputText'
      });
      navigate('/history'); // Added navigation as per instruction

      // The instruction snippet included `setResults(response.data);` after `navigate`.
      // If navigation occurs, this line will not be reached or its effect will be lost.
      // Therefore, it's removed to reflect the likely intent of navigating away.
      // If results were still needed before navigation, the instruction would need clarification.

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to execute workflow');
    } finally {
      setExecuting(false);
      setCurrentStep(null);
    }
  };

  const selectedWorkflow = workflows.find(w => w._id === selectedWorkflowId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Run Workflow</h2>
        <p className="mt-2 text-gray-600">Execute a workflow against your text input</p>
      </div>

      {/* Form */}
      <div className="bg-white shadow-sm rounded-lg p-6" data-testid="run-workflow-form">
        <form onSubmit={handleExecute} className="space-y-6">
          {/* Workflow Selection */}
          <div>
            <label htmlFor="workflow-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Workflow
            </label>
            <select
              id="workflow-select"
              value={selectedWorkflowId}
              onChange={(e) => setSelectedWorkflowId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              data-testid="workflow-select"
            >
              <option value="">-- Choose a workflow --</option>
              {workflows.map((workflow) => (
                <option key={workflow._id} value={workflow._id}>
                  {workflow.name} ({workflow.steps.length} steps)
                </option>
              ))}
            </select>
          </div>

          {/* Show selected workflow steps */}
          {selectedWorkflow && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Pipeline Steps:</h4>
              <div className="flex items-center space-x-2">
                {selectedWorkflow.steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="bg-white px-3 py-1 rounded-md border border-gray-200 text-sm">
                      {idx + 1}. {STEP_LABELS[step]}
                    </div>
                    {idx < selectedWorkflow.steps.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Input Text */}
          <div>
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 mb-2">
              Input Text
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter the text you want to process..."
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              data-testid="input-text"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center">
              <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Execute Button */}
          <button
            type="submit"
            disabled={executing}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium transition-colors"
            data-testid="execute-button"
          >
            {executing ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Execute Workflow
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white shadow-sm rounded-lg p-6" data-testid="execution-results">
          <div className="flex items-center mb-6">
            <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Execution Complete</h3>
          </div>

          {/* Original Input */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Original Input:</h4>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{results.input}</p>
            </div>
          </div>

          {/* Step Outputs */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Step-by-Step Results:</h4>
            {results.outputs.map((output, idx) => (
              <div
                key={idx}
                className="border-l-4 border-primary-500 bg-primary-50 p-4 rounded-r-md"
                data-testid={`step-output-${idx}`}
              >
                <div className="flex items-center mb-2">
                  <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">
                    Step {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {STEP_LABELS[output.step]}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{output.output}</p>
              </div>
            ))}
          </div>

          {/* Metadata */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
            <p>Workflow: {results.workflowName}</p>
            <p>Completed at: {new Date(results.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RunWorkflow;
