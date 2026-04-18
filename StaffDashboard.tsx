import React, { useEffect, useState } from 'react';
import { Calendar, User, Clock, CheckCircle2, FileText } from 'lucide-react';
import InvoiceGenerator from './InvoiceGenerator';
import { fetchRecentBookings } from '../../firebase-services/bookingService';
import { Reservation, Dress } from '../../types';

interface BookingWithDress extends Reservation {
  dress?: Dress;
}

export default function StaffDashboard() {
    const [bookings, setBookings] = useState<BookingWithDress[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<BookingWithDress | null>(null);

    useEffect(() => {
        const loadBookings = async () => {
            setLoading(true);
            const fetchedBookings = await fetchRecentBookings();
            setBookings(fetchedBookings as BookingWithDress[]);
            setLoading(false);
        };
        loadBookings();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12" dir="rtl">
            <header className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tighter">
                    لوحة <span className="text-gold italic">الموظفين</span>
                </h1>
                <div className="h-[1px] w-40 bg-gold/30" />
            </header>

            <div className="grid gap-8">
                <div className="bg-stone-900/50 border border-stone-800 rounded-sm p-8">
                    <h2 className="text-xl font-serif text-white mb-8 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gold" />
                        سجل التأجير الحديث
                    </h2>

                    {loading ? (
                        <div className="text-stone-500 font-serif italic py-12 text-center">جاري مزامنة السجلات...</div>
                    ) : bookings.length === 0 ? (
                        <div className="text-stone-500 font-serif italic py-12 text-center">لا توجد حجوزات نشطة.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead>
                                    <tr className="border-b border-stone-800">
                                        <th className="pb-4 text-xs font-bold text-stone-500">رقم العملية</th>
                                        <th className="pb-4 text-xs font-bold text-stone-500">العميلة</th>
                                        <th className="pb-4 text-xs font-bold text-stone-500">التواريخ</th>
                                        <th className="pb-4 text-xs font-bold text-stone-500">المالية</th>
                                        <th className="pb-4 text-xs font-bold text-stone-500">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-800/50">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-6">
                                                <p className="text-sm font-bold text-gold tracking-tight">{booking.id.substring(0, 8)}</p>
                                                <p className="text-xs text-stone-400 mt-1">{booking.dress?.name}</p>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex flex-col gap-1 text-stone-300">
                                                    <span className="text-sm font-bold">{booking.customerName}</span>
                                                    <span className="text-xs text-stone-500">{booking.customerEmail || '---'}</span>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-2 text-stone-400">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-xs">
                                                        {booking.startDate.toDate().toLocaleDateString('ar-EG')} → {booking.endDate.toDate().toLocaleDateString('ar-EG')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="text-xs space-y-1">
                                                    <p className="text-stone-300">المستحق: <span className="font-bold">{booking.totalPrice} EGP</span></p>
                                                    <p className="text-green-500">المدفوع: <span className="font-bold">{booking.totalPrice} EGP</span></p>
                                                    {(booking.totalPrice - booking.totalPrice) > 0 && (
                                                        <p className="text-red-400">المتبقي: <span className="font-bold">{booking.totalPrice - booking.totalPrice} EGP</span></p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <button
                                                    onClick={() => setSelectedInvoice(booking)}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-gold/20 hover:text-gold border border-stone-700 text-xs transition-colors rounded-sm text-stone-300"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    فاتورة
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {selectedInvoice && (
                <InvoiceGenerator
                    booking={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </div>
    );
}
