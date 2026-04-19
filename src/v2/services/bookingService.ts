import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase-bridge'; // We'll create this bridge next
import { BookingWithDress } from '../types';

export const fetchRecentBookings = async (): Promise<BookingWithDress[]> => {
  try {
    const q = query(collection(db, 'reservations'), orderBy('outDate', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BookingWithDress));
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};
