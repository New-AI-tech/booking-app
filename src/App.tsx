import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DressCard } from './components/DressCard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { IncomeStatement } from './components/admin/IncomeStatement';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<div className="p-8 text-center"><h1>Welcome to VogueRent</h1><a href="/staff" className="text-blue-500 underline">Staff Portal</a></div>} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/income" element={<IncomeStatement />} />
            <Route path="/staff" element={<StaffDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
