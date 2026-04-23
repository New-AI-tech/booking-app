import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { BookingWithDress } from '../types';
import { Calendar, User } from 'lucide-react';

export function StaffDashboard() {
    const [bookings, setBookings] = useState<BookingWithDress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bookingService.fetchRecentBookings().then(data => {
            setBookings(data);
            setLoading(false);
        });
    }, []);

    const getStatusStyle = (status: string) => {
        const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ";
        switch (status) {
            case 'active': return base + "bg-emerald-100 text-emerald-700 border border-emerald-200";
            case 'confirmed': return base + "bg-blue-100 text-blue-700 border border-blue-200";
            default: return base + "bg-stone-100 text-stone-600 border border-stone-200";
        }
    };

    const translateStatus = (status: string) => {
        switch (status) {
            case 'active': return 'نشط';
            case 'confirmed': return 'مؤكد';
            case 'completed': return 'مكتمل';
            case 'cancelled': return 'ملغي';
            default: return status;
        }
    };

    if (loading) return (
        <div className="p-20 text-center animate-pulse text-stone-400 font-serif italic" dir="rtl">
            جاري تحميل بيانات الحجوزات المباشرة...
        </div>
    );

    return (
        <div className="space-y-10" dir="rtl">
            <header className="flex justify-between items-end border-b border-stone-100 pb-6 text-right">
                <div className="space-y-1">
                    <h2 className="text-4xl font-serif font-medium text-stone-900 tracking-tight">بوابة الموظفين</h2>
                    <p className="text-stone-400 text-sm">رقابة فورية على الإيجارات الحالية والحجوزات القادمة.</p>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 overflow-hidden border border-stone-100">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-stone-50/50 border-b border-stone-100">
                        <tr>
                            <th className="px-10 py-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">العميل / الاتصال</th>
                            <th className="px-10 py-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">تفاصيل القطعة</th>
                            <th className="px-10 py-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">فترة الإيجار</th>
                            <th className="px-10 py-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-10 py-16 text-center text-stone-400 font-serif italic">
                                    لا توجد حجوزات نشطة حالياً.
                                </td>
                            </tr>
                        ) : bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-stone-50/40 transition-colors group">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-all">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-stone-900">{booking.customerName}</p>
                                            <p className="text-xs text-stone-400">{booking.customerEmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <p className="font-medium text-stone-800">{booking.dress?.name || 'تصميم قياسي'}</p>
                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">
                                        رمز: {booking.id.substring(0, 8)}
                                    </p>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-2 text-stone-600 text-sm">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{booking.startDate.toDate().toLocaleDateString('ar-EG')}</span>
                                        <span className="text-stone-300">←</span>
                                        <span>{booking.endDate.toDate().toLocaleDateString('ar-EG')}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <span className={getStatusStyle(booking.status)}>{translateStatus(booking.status)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
