import React, { useState } from 'react';
import { collection, query, where, getDocs, Timestamp, QuerySnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase-bridge';
import { Dress, InventoryItem, Reservation } from '../../types';
import { Calendar, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  dress: Dress;
}

export default function AvailabilityChecker({ dress }: Props) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [checking, setChecking] = useState(false);
  const [availableItems, setAvailableItems] = useState<InventoryItem[]>([]);
  const [hasChecked, setHasChecked] = useState(false);

  const checkAvailability = async () => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert('End date cannot be before start date.');
      return;
    }

    setChecking(true);
    setHasChecked(false);

    try {
      const itemsRef = collection(db, 'inventory_items');
      const itemsQuery = query(itemsRef, where('dressId', '==', dress.id), where('status', '==', 'available'));
      const itemsSnap = await getDocs(itemsQuery);
      const allItems = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));

      if (allItems.length === 0) {
        setAvailableItems([]);
        setHasChecked(true);
        setChecking(false);
        return;
      }

      const reservationsRef = collection(db, 'reservations');
      const reservationsQuery = query(
        reservationsRef,
        where('dressId', '==', dress.id),
        where('status', '==', 'confirmed'),
        where('startDate', '<=', Timestamp.fromDate(end)),
        where('bufferEndDate', '>=', Timestamp.fromDate(start))
      );
      const reservationsSnap: QuerySnapshot<Reservation> = await getDocs(reservationsQuery) as QuerySnapshot<Reservation>;
      const overlappingReservations = reservationsSnap.docs.map(doc => doc.data());

      const available = allItems.filter(item => {
        const itemReservations = overlappingReservations.filter(res => res.itemId === item.id);
        return !itemReservations.some(res => {
          const resStart = res.startDate.toDate();
          const resBufferEnd = res.bufferEndDate.toDate();
          return start <= resBufferEnd && end >= resStart;
        });
      });

      setAvailableItems(available);
      setHasChecked(true);
    } catch (error) {
      handleFirestoreError(OperationType.LIST, error, 'reservations');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-stone-100">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">In</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-stone-900 transition-all font-medium"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Out</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-stone-900 transition-all font-medium"
            min={startDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <button
        onClick={checkAvailability}
        disabled={!startDate || !endDate || checking}
        className="w-full py-4 bg-stone-900 text-white rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-stone-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
        Check Availability
      </button>

      <AnimatePresence>
        {hasChecked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-2xl border border-stone-100 bg-stone-50 mt-4 space-y-3">
              {availableItems.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" />
                    Available in {availableItems.length} Sizes
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableItems.map(item => (
                      <span key={item.id} className="px-3 py-1 bg-white border border-stone-200 rounded-full text-[10px] font-bold text-stone-600">
                        Size {item.size}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-600 font-bold text-[10px] uppercase tracking-widest">
                  <XCircle className="w-4 h-4" />
                  Not Available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
