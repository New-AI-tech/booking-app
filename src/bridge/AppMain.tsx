import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StaffDashboard } from '../components/staff/StaffDashboard';

export default function AppMain() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-10"><h1>System Live</h1></div>} />
        <Route path="/staff" element={<StaffDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
