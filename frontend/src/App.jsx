import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Workflow, Play, History, Activity } from 'lucide-react';
import WorkflowBuilder from './pages/WorkflowBuilder';
import RunWorkflow from './pages/RunWorkflow';
import RunHistory from './pages/RunHistory';
import HealthDashboard from './pages/HealthDashboard';

function App() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Workflow Builder', icon: Workflow },
    { path: '/run', label: 'Run Workflow', icon: Play },
    { path: '/history', label: 'Run History', icon: History },
    { path: '/health', label: 'Health Dashboard', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">Workflow Builder</h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<WorkflowBuilder />} />
          <Route path="/run" element={<RunWorkflow />} />
          <Route path="/history" element={<RunHistory />} />
          <Route path="/health" element={<HealthDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
