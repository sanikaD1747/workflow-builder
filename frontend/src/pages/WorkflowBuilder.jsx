import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { workflowAPI } from '../services/api';

const AVAILABLE_STEPS = [
  { key: 'clean', label: 'Clean Text', description: 'Removes extra whitespace and fixes basic grammar' },
  { key: 'summarize', label: 'Summarize', description: 'Condenses the input into ~5 lines' },
  { key: 'extract', label: 'Extract Key Points', description: 'Returns bullet-point insights' },
  { key: 'tag', label: 'Tag Category', description: 'Classifies text: Technology / Finance / Health / Education / Other' },
];

function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('');
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleStepToggle = (stepKey) => {
    if (selectedSteps.includes(stepKey)) {
      setSelectedSteps(selectedSteps.filter(s => s !== stepKey));
    } else {
      if (selectedSteps.length < 4) {
        setSelectedSteps([...selectedSteps, stepKey]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!workflowName.trim()) {
      setError('Please enter a workflow name');
      return;
    }

    if (selectedSteps.length < 2 || selectedSteps.length > 4) {
      setError('Please select 2-4 steps');
      return;
    }

    setLoading(true);

    try {
      await workflowAPI.create({
        name: workflowName,
        steps: selectedSteps,
      });

      setSuccess('Workflow created successfully!');
      setWorkflowName('');
      setSelectedSteps([]);
      loadWorkflows();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err.response?.data?.details) {
        const details = err.response.data.details;
        setError(Array.isArray(details) ? details[0].message : 'Validation failed');
      } else {
        setError(err.response?.data?.error || 'Failed to create workflow');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workflow?')) {
      return;
    }

    try {
      await workflowAPI.delete(id);
      loadWorkflows();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete workflow');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Create Workflow</h2>
        <p className="mt-2 text-gray-600">Design a multi-step AI processing pipeline</p>
      </div>

      {/* Form */}
      <div className="bg-white shadow-sm rounded-lg p-6" data-testid="workflow-builder-form">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workflow Name */}
          <div>
            <label htmlFor="workflow-name" className="block text-sm font-medium text-gray-700 mb-2">
              Workflow Name
            </label>
            <input
              id="workflow-name"
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="e.g., Content Analysis Pipeline"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              data-testid="workflow-name-input"
            />
          </div>

          {/* Steps Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Processing Steps (2-4 unique steps)
            </label>
            <p className="text-sm text-gray-500 mb-4">Selected: {selectedSteps.length}/4</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_STEPS.map((step) => {
                const isSelected = selectedSteps.includes(step.key);
                const isDisabled = !isSelected && selectedSteps.length >= 4;

                return (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => handleStepToggle(step.key)}
                    disabled={isDisabled}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : isDisabled
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-primary-300'
                      }`}
                    data-testid={`step-${step.key}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{step.label}</h3>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    {isSelected && (
                      <div className="mt-2 text-xs text-primary-600 font-medium">
                        Step {selectedSteps.indexOf(step.key) + 1}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium transition-colors"
            data-testid="save-workflow-button"
          >
            {loading ? (
              'Saving...'
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Workflow
              </>
            )}
          </button>
        </form>
      </div>

      {/* Saved Workflows */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Saved Workflows</h3>
        {workflows.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center text-gray-500">
            No workflows created yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <div
                key={workflow._id}
                className="bg-white shadow-sm rounded-lg p-4 border border-gray-200"
                data-testid={`workflow-${workflow._id}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                  <button
                    onClick={() => handleDelete(workflow._id)}
                    className="text-red-500 hover:text-red-700"
                    data-testid={`delete-workflow-${workflow._id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {workflow.steps.map((step, idx) => {
                    const stepInfo = AVAILABLE_STEPS.find(s => s.key === step);
                    return (
                      <div key={idx} className="text-sm text-gray-600 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-medium mr-2">
                          {idx + 1}
                        </span>
                        {stepInfo?.label}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  {new Date(workflow.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkflowBuilder;
