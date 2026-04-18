import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StaffDashboard } from './components/staff/StaffDashboard';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div className="p-10"><h1>VogueRent Home</h1><a href="/staff">Staff Portal</a></div>} />
          <Route path="/staff" element={<StaffDashboard />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
