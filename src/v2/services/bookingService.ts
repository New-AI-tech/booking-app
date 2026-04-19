import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase-bridge';
import { BookingWithDress } from '../types'; // This looks at src/v2/types.ts

export const fetchRecentBookings = async (): Promise<BookingWithDress[]> => {
  try {
    const q = query(collection(db, 'reservations'), orderBy('outDate', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      customerName: doc.data().customerName || 'Unknown Customer',
      status: doc.data().status || 'Pending'
    } as BookingWithDress));
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};
