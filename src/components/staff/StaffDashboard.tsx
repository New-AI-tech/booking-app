import React, { useState, useEffect } from 'react';
import { fetchRecentBookings } from '../../firebase-services/bookingService';
import { BookingWithDress } from '../../types';

export function StaffDashboard() {
  const [bookings, setBookings] = useState<BookingWithDress[]>([]);
  
  useEffect(() => {
    fetchRecentBookings().then(setBookings);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Staff Portal - Recent Bookings</h2>
      <div className="grid gap-4">
        {bookings.map(b => (
          <div key={b.id} className="p-4 bg-white shadow rounded-lg border">
            <p className="font-semibold">{b.customerName || 'Guest'}</p>
            <p className="text-sm text-gray-500">{b.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
