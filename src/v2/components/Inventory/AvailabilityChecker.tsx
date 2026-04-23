import React, { useState } from 'react';
import { Timestamp, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-bridge';
import { Dress, InventoryItem } from '../../types';
import { bookingService } from '../../services/bookingService';
import { Calendar, CheckCircle2, XCircle, Loader2, ShoppingBag } from 'lucide-react';

interface Props {
    dress: Dress;
}

interface AvailableSlot {
    item: InventoryItem;
    available: boolean;
}

export default function AvailabilityChecker({ dress }: Props) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [checking, setChecking] = useState(false);
    const [booking, setBooking] = useState(false);
    const [slots, setSlots] = useState<AvailableSlot[]>([]);
    const [hasChecked, setHasChecked] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const totalDays = startDate && endDate
        ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
        : 0;
    const totalPrice = totalDays * dress.basePrice;

    const checkAvailability = async () => {
        if (!startDate || !endDate) return;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) { alert('تاريخ النهاية يجب أن يكون بعد تاريخ البداية.'); return; }

        setChecking(true);
        setHasChecked(false);
        setSelectedItem(null);
        setBookingSuccess(false);

        try {
            const itemsSnap = await getDocs(
                query(collection(db, 'inventory_items'),
                    where('dressId', '==', dress.id),
                    where('status', '==', 'available'))
            );
            const allItems = itemsSnap.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem));

            const bufferEnd = new Date(end);
            bufferEnd.setDate(bufferEnd.getDate() + dress.cleaningBufferDays);

            const results = await Promise.all(
                allItems.map(async (item) => ({
                    item,
                    available: await bookingService.isItemAvailable(item.id, start, bufferEnd)
                }))
            );

            setSlots(results);
            setHasChecked(true);
        } catch (error) {
            console.error('Error checking availability:', error);
        } finally {
            setChecking(false);
        }
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem || !startDate || !endDate || !customerName || !customerEmail) return;

        setBooking(true);
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const bufferEnd = new Date(end);
            bufferEnd.setDate(bufferEnd.getDate() + dress.cleaningBufferDays);

            await bookingService.createReservation({
                itemId: selectedItem.id,
                dressId: dress.id,
                customerName,
                customerEmail,
                startDate: Timestamp.fromDate(start),
                endDate: Timestamp.fromDate(end),
                bufferEndDate: Timestamp.fromDate(bufferEnd),
                totalPrice,
                status: 'confirmed',
            });

            setBookingSuccess(true);
            setSelectedItem(null);
            setCustomerName('');
            setCustomerEmail('');
            await checkAvailability();
        } catch (error) {
            console.error('Booking error:', error);
        } finally {
            setBooking(false);
        }
    };

    const availableSlots = slots.filter(s => s.available);

    return (
        <div className="space-y-4 pt-4 border-t border-stone-100 text-right" dir="rtl">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">تاريخ البداية</label>
                    <input type="date" value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setHasChecked(false); }}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-stone-900 transition-all" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">تاريخ النهاية</label>
                    <input type="date" value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setHasChecked(false); }}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-stone-900 transition-all" />
                </div>
            </div>

            {totalDays > 0 && (
                <div className="flex justify-between items-center px-2 text-xs text-stone-500">
                    <span>{totalDays} يوم</span>
                    <span className="font-bold text-stone-900">{totalPrice.toFixed(2)} ج.م</span>
                </div>
            )}

            <button onClick={checkAvailability} disabled={!startDate || !endDate || checking}
                className="w-full py-3 bg-stone-900 text-white rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-stone-800 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                {checking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
                التحقق من التوفر
            </button>

            {bookingSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <p className="text-emerald-700 text-sm font-medium">تم تأكيد الحجز بنجاح!</p>
                </div>
            )}

            {hasChecked && (
                <div className="space-y-3">
                    {availableSlots.length > 0 ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" />
                                يتوفر {availableSlots.length} مقاس(ات)
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {availableSlots.map(({ item }) => (
                                    <button key={item.id} type="button"
                                        onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${selectedItem?.id === item.id
                                            ? 'bg-stone-900 text-white border-stone-900'
                                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900'}`}>
                                        مقاس {item.size}{item.color ? ` · ${item.color}` : ''}
                                    </button>
                                ))}
                            </div>

                            {selectedItem && (
                                <form onSubmit={handleBook} className="p-5 bg-stone-50 rounded-2xl border border-stone-100 space-y-3 mt-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                                        حجز — مقاس {selectedItem.size} · الإجمالي {totalPrice.toFixed(2)} ج.م
                                    </p>
                                    <input required placeholder="اسم العميل" value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-stone-900 transition-all text-right" />
                                    <input required type="email" placeholder="البريد الإلكتروني للعميل" value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-stone-900 transition-all text-right" />
                                    <button type="submit" disabled={booking}
                                        className="w-full py-3 bg-stone-900 text-white rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                        {booking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                                        تأكيد الحجز
                                    </button>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-rose-600 font-bold text-[10px] uppercase tracking-widest">
                            <XCircle className="w-4 h-4" /> لا تتوفر مقاسات لهذه التواريخ
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
