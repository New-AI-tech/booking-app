import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { StaffDashboard } from './components/StaffDashboard';

export default function AppEntry() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b px-8 py-4 flex gap-6 shadow-sm">
          <Link to="/" className="font-bold text-blue-600 mr-4">VogueRent V2</Link>
          <Link to="/staff" className="text-gray-600 hover:text-blue-600 transition-colors">Staff Dashboard</Link>
          <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">Admin Panel</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="p-20 text-center">
              <h1 className="text-5xl font-extrabold text-gray-900 mb-4">VogueRent</h1>
              <p className="text-xl text-gray-500">Inventory & Booking Management System</p>
            </div>
          } />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/admin" element={<div className="p-20 text-center text-gray-400">Admin Module Coming Next...</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
