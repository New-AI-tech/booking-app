import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Dress, InventoryItem, Reservation } from '../types';
import { Calendar, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  dress: Dress;
}

export function AvailabilityChecker({ dress }: Props) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [checking, setChecking] = useState(false);
  const [availableItems, setAvailableItems] = useState<InventoryItem[]>([]);
  const [hasChecked, setHasChecked] = useState(false);

  const checkAvailability = async () => {
    if (!startDate || !endDate) return;
    setChecking(true);
    setHasChecked(false);

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // 1. Get all physical items for this dress
      const itemsRef = collection(db, 'inventory_items');
      const itemsQuery = query(itemsRef, where('dressId', '==', dress.id), where('status', '==', 'available'));
      const itemsSnap = await getDocs(itemsQuery);
      const allItems = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));

      // 2. Get all reservations that overlap with the requested period
      // Overlap logic: (requestedStart <= existingBufferEnd) AND (requestedEnd >= existingStart)
      const reservationsRef = collection(db, 'reservations');
      const reservationsQuery = query(
        reservationsRef,
        where('dressId', '==', dress.id),
        where('status', '==', 'confirmed')
      );
      const reservationsSnap = await getDocs(reservationsQuery);
      const overlappingReservations = reservationsSnap.docs.map(doc => doc.data() as Reservation);

      // Filter out items that have an overlapping reservation
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
      handleFirestoreError(error, OperationType.LIST, 'reservations');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-stone-500 font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full luxury-input"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-stone-500 font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full luxury-input"
            min={startDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <button
        onClick={checkAvailability}
        disabled={!startDate || !endDate || checking}
        className="w-full luxury-button flex items-center justify-center gap-2"
      >
        {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
        Check Availability
      </button>

      <AnimatePresence>
        {hasChecked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-xl border border-stone-200 bg-stone-50"
          >
            {availableItems.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Available in {availableItems.length} sizes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableItems.map(item => (
                    <span key={item.id} className="px-3 py-1 bg-white border border-stone-200 rounded-full text-sm font-medium">
                      Size {item.size}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-600 font-medium">
                <XCircle className="w-5 h-5" />
                <span>Fully booked for these dates</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
