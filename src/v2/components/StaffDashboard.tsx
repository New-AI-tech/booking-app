import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { BookingWithDress } from '../types';
import { Calendar, User, Search, Filter } from 'lucide-react';

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
        const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ";
        switch (status) {
            case 'active': return base + "bg-emerald-50 text-emerald-700 border-emerald-100";
            case 'confirmed': return base + "bg-blue-50 text-blue-700 border-blue-100";
            default: return base + "bg-stone-50 text-stone-600 border-stone-200";
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
        <div className="p-20 text-center animate-pulse text-stone-400 font-medium" dir="rtl">
            جاري تحميل بيانات الحجوزات...
        </div>
    );

    return (
        <div className="space-y-8 animate-in" dir="rtl">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
                <div className="space-y-1">
                    <h2 className="text-4xl font-bold text-stone-900 tracking-tight">بوابة الموظفين</h2>
                    <p className="text-stone-500 text-lg">متابعة الحجوزات المباشرة وحالة المخزون.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input placeholder="بحث في الحجوزات..." className="h-10 pr-9 pl-4 bg-white border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-900 w-48 shadow-sm transition-all" />
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-stone-50/80 border-b border-stone-200">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-bold text-stone-500 uppercase tracking-widest text-right">العميل</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-stone-500 uppercase tracking-widest text-right">التصميم</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-stone-500 uppercase tracking-widest text-right">فترة الإيجار</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-stone-500 uppercase tracking-widest text-center">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center text-stone-400 font-medium">
                                    لا توجد حجوزات مسجلة حالياً.
                                </td>
                            </tr>
                        ) : bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-stone-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-stone-900 text-sm">{booking.customerName}</p>
                                            <p className="text-[10px] text-stone-400 font-medium">{booking.customerEmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-bold text-stone-800 text-sm">{booking.dress?.name || 'تصميم قياسي'}</p>
                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                                        #{booking.id.substring(0, 6).toUpperCase()}
                                    </p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-stone-600 text-xs font-medium">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{booking.startDate.toDate().toLocaleDateString('ar-EG')}</span>
                                        <span className="text-stone-300">←</span>
                                        <span>{booking.endDate.toDate().toLocaleDateString('ar-EG')}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
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
