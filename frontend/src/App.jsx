import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NationwideDashboard from './pages/NationwideDashboard';
import LandingPage from './pages/LandingPage';
import logo from './assets/header_logo.png';

function App() {
  return (
    <Router basename='/silver-broccoli'>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <header className="bg-white border-b shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo Section */}
              <Link to="/about" className="flex-shrink-0 flex items-center">
                <img className="h-10 w-auto" src={logo} alt="e-나라집" />
              </Link>

              {/* GNB (Tabs) */}
              <div className="flex space-x-8 h-full">
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full ${isActive
                      ? 'border-gov-navy text-gov-navy font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  서비스 소개
                </NavLink>
                <NavLink
                  to="/seoul"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full ${isActive
                      ? 'border-gov-navy text-gov-navy font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  서울시 (SH)
                </NavLink>
                <NavLink
                  to="/nationwide"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full ${isActive
                      ? 'border-gov-navy text-gov-navy font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  전국 (LH)
                </NavLink>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/about" replace />} />
            <Route path="/about" element={<LandingPage />} />
            <Route path="/seoul" element={
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4">
                <Dashboard />
              </div>
            } />
            <Route path="/nationwide" element={
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4">
                <NationwideDashboard />
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
