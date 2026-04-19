import React, { useEffect, useState } from 'react';
import { fetchRecentBookings } from '../services/bookingService';
import { BookingWithDress } from '../types';

export function StaffDashboard() {
  const [bookings, setBookings] = useState<BookingWithDress[]>([]);

  useEffect(() => {
    fetchRecentBookings().then(setBookings);
  }, []);

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Staff Portal</h1>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          {bookings.length} Active Reservations
        </div>
      </header>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Return Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{b.customerName}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    b.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(b.returnDate?.seconds * 1000).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
