import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { healthAPI } from '../services/api';

function HealthDashboard() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await healthAPI.check();
      setHealth(response.data);
      setLastChecked(new Date());
    } catch (err) {
      console.error('Error checking health:', err);
      setHealth({
        backend: { status: 'unhealthy', message: 'Failed to connect to backend' },
        database: { status: 'unknown', message: 'Unable to check' },
        llm: { status: 'unknown', message: 'Unable to check' },
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'unhealthy':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-700';
      case 'unhealthy':
        return 'text-red-700';
      default:
        return 'text-yellow-700';
    }
  };

  const services = health ? [
    { name: 'Backend Service', key: 'backend', info: health.backend },
    { name: 'Database (MongoDB)', key: 'database', info: health.database },
    { name: 'LLM (Gemini)', key: 'llm', info: health.llm },
  ] : [];

  const overallHealthy = health && services.every(s => s.info.status === 'healthy');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Health Dashboard</h2>
          <p className="mt-2 text-gray-600">Monitor system status and connectivity</p>
        </div>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
          data-testid="refresh-health-button"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overall Status */}
      {health && (
        <div
          className={`p-6 rounded-lg border-2 ${
            overallHealthy
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}
          data-testid="overall-status"
        >
          <div className="flex items-center">
            {overallHealthy ? (
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600 mr-3" />
            )}
            <div>
              <h3
                className={`text-xl font-semibold ${
                  overallHealthy ? 'text-green-900' : 'text-red-900'
                }`}
              >
                System Status: {overallHealthy ? 'Healthy' : 'Issues Detected'}
              </h3>
              <p className={`text-sm ${overallHealthy ? 'text-green-700' : 'text-red-700'}`}>
                {overallHealthy
                  ? 'All services are operational'
                  : 'One or more services are experiencing issues'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.key}
            className={`p-6 rounded-lg border ${getStatusColor(service.info.status)}`}
            data-testid={`service-${service.key}`}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{service.name}</h3>
              {getStatusIcon(service.info.status)}
            </div>
            <div>
              <p className={`text-sm font-medium mb-1 ${getStatusTextColor(service.info.status)}`}>
                Status: {service.info.status.charAt(0).toUpperCase() + service.info.status.slice(1)}
              </p>
              <p className="text-sm text-gray-600">{service.info.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Last Checked */}
      {lastChecked && (
        <div className="text-center text-sm text-gray-500">
          Last checked: {lastChecked.toLocaleString()}
        </div>
      )}

      {/* System Info */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Backend:</span>
            <span className="ml-2 text-gray-600">Node.js + Express</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Database:</span>
            <span className="ml-2 text-gray-600">MongoDB</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">LLM Provider:</span>
            <span className="ml-2 text-gray-600">Google Gemini</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Frontend:</span>
            <span className="ml-2 text-gray-600">React 18 + Vite 5</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Status Legend</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-gray-600">Healthy - Service is operational</span>
          </div>
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-gray-600">Unhealthy - Service is down</span>
          </div>
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-gray-600">Unknown - Unable to verify</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthDashboard;
