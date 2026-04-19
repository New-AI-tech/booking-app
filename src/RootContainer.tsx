import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StaffDashboard } from './components/staff/StaffDashboard';

export default function RootContainer() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-10"><h1>System Live</h1><a href="/staff" className="text-blue-600 underline">Enter Portal</a></div>} />
        <Route path="/staff" element={<StaffDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
