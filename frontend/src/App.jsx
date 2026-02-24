import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Workflow, Play, History, Activity, LogOut } from 'lucide-react';
import WorkflowBuilder from './pages/WorkflowBuilder';
import RunWorkflow from './pages/RunWorkflow';
import RunHistory from './pages/RunHistory';
import HealthDashboard from './pages/HealthDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const { user, logout } = useAuth();

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
                {user && navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
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
            {user && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-4">{user.email}</span>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><WorkflowBuilder /></ProtectedRoute>} />
          <Route path="/run" element={<ProtectedRoute><RunWorkflow /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><RunHistory /></ProtectedRoute>} />
          <Route path="/health" element={<HealthDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
