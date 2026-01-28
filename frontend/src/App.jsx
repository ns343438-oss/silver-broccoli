import React from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-gov-navy shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-gov-navy font-bold text-lg">🏛️</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              서울시 임대주택 대시보드
            </h1>
          </div>
          <div className="text-gray-300 text-sm">
            대한민국 정부 스타일
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Dashboard />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
