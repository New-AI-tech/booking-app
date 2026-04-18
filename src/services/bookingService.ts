import { collection, query, orderBy, limit, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Reservation, Dress, BookingWithDress } from '../types';

// Helper to safely convert Firestore Timestamps or strings to JS Date objects
const ensureDate = (date: any): Date => {
  if (!date) return new Date();
  if (typeof date.toDate === 'function') return date.toDate();
  return new Date(date);
};

export const fetchRecentBookings = async (): Promise<BookingWithDress[]> => {
  try {
    const reservationsRef = collection(db, 'reservations');
    const q = query(reservationsRef, orderBy('createdAt', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);

    const bookings: BookingWithDress[] = [];

    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();

      // Construct the reservation object with safe date conversions
      const reservation: Reservation = {
        ...data,
        id: docSnapshot.id,
        outDate: ensureDate(data.outDate),
        returnDate: ensureDate(data.returnDate),
        // Handle optional Manus-hallucinated dates
        startDate: data.startDate ? ensureDate(data.startDate) : undefined,
        bufferEndDate: data.bufferEndDate ? ensureDate(data.bufferEndDate) : undefined,
      } as Reservation;

      // Fetch dress details
      let dress: Dress | undefined = undefined;
      if (reservation.dressId) {
        const dressRef = doc(db, 'dresses', reservation.dressId);
        const dressSnap = await getDoc(dressRef);
        if (dressSnap.exists()) {
          dress = { id: dressSnap.id, ...dressSnap.data() } as Dress;
        }
      }

      bookings.push({
        ...reservation,
        dress,
      });
    }
    return bookings;
  } catch (error) {
    // FIXED: Corrected argument order (Operation, Error, Context)
    handleFirestoreError(OperationType.LIST, error, 'fetching recent bookings');
    return [];
  }
};