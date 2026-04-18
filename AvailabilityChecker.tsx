import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp, QuerySnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Dress, InventoryItem, Reservation } from '../types';
import { Calendar, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Basic validation: ensure end date is not before start date
    if (start > end) {
      alert('End date cannot be before start date.');
      return;
    }

    setChecking(true);
    setHasChecked(false);

    try {
      // 1. Get all physical items for this dress that are 'available'
      const itemsRef = collection(db, 'inventory_items');
      const itemsQuery = query(itemsRef, where('dressId', '==', dress.id), where('status', '==', 'available'));
      const itemsSnap = await getDocs(itemsQuery);
      const allItems = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));

      // If no items are available, no need to check reservations
      if (allItems.length === 0) {
        setAvailableItems([]);
        setHasChecked(true);
        setChecking(false);
        return;
      }

      // 2. Get all reservations for this dress that *could* overlap
      // This query is more complex due to Firestore limitations on range queries for different fields.
      // We fetch reservations that start before or during the requested end date
      // AND end after or during the requested start date.
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

      // Filter out items that have an overlapping reservation
      const available = allItems.filter(item => {
        const itemReservations = overlappingReservations.filter(res => res.itemId === item.id);
        return !itemReservations.some(res => {
          const resStart = res.startDate.toDate();
          const resBufferEnd = res.bufferEndDate.toDate();
          // Client-side check for actual overlap, as Firestore query is an approximation
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
