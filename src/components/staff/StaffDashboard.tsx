// src/components/staff/StaffDashboard.tsx
// Updated Staff Dashboard including Invoice Trigger & Financial Tracking
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { Calendar, User, Clock, CheckCircle2, FileText } from 'lucide-react';
import InvoiceGenerator from './InvoiceGenerator';

export default function StaffDashboard() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

    useEffect(() => {
        fetchRecentBookings();
    }, []);

    async function fetchRecentBookings() {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
          id,
          transaction_id,
          customer_name,
          customer_phone,
          start_date,
          due_date,
          actual_return_date,
          base_rental_fee,
          delay_fee,
          total_due,
          amount_paid,
          status,
          dresses (id, name, price)
        `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

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
                                                <p className="text-sm font-bold text-gold tracking-tight">{booking.transaction_id || 'N/A'}</p>
                                                <p className="text-xs text-stone-400 mt-1">{booking.dresses?.name}</p>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex flex-col gap-1 text-stone-300">
                                                    <span className="text-sm font-bold">{booking.customer_name}</span>
                                                    <span className="text-xs text-stone-500">{booking.customer_phone || '---'}</span>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-2 text-stone-400">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-xs">
                                                        {new Date(booking.start_date).toLocaleDateString('ar-EG')} → {new Date(booking.due_date || booking.start_date).toLocaleDateString('ar-EG')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="text-xs space-y-1">
                                                    <p className="text-stone-300">المستحق: <span className="font-bold">{booking.total_due} EGP</span></p>
                                                    <p className="text-green-500">المدفوع: <span className="font-bold">{booking.amount_paid} EGP</span></p>
                                                    {(booking.total_due - booking.amount_paid) > 0 && (
                                                        <p className="text-red-400">المتبقي: <span className="font-bold">{booking.total_due - booking.amount_paid} EGP</span></p>
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
