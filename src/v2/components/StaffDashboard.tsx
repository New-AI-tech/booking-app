import React, { useEffect, useState } from 'react';
import { fetchRecentBookings } from '../services/bookingService';
import { BookingWithDress } from '../types'; // This looks at src/v2/types.ts

export function StaffDashboard() {
  const [bookings, setBookings] = useState<BookingWithDress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBookings().then(data => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500 italic">Loading reservations...</div>;

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Staff Portal</h1>
        <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
          {bookings.length} Live Bookings
        </div>
      </header>

      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase">Customer</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-10 text-center text-gray-400">No recent bookings found in Firestore.</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="group hover:bg-blue-50/40 transition-all duration-200">
                    <td className="px-8 py-5 font-semibold text-gray-800">{b.customerName}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                        b.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-orange-50 text-orange-700 border-orange-100'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-gray-400 text-sm font-mono">
                      {b.startDate?.seconds ? new Date(b.startDate.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
