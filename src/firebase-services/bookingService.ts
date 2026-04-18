import { collection, query, orderBy, limit, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Reservation, Dress } from '../types';

interface BookingWithDress extends Reservation {
  dress?: Dress;
}

export const fetchRecentBookings = async (): Promise<BookingWithDress[]> => {
  try {
    const reservationsRef = collection(db, 'reservations');
    const q = query(reservationsRef, orderBy('createdAt', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);

    const bookings: BookingWithDress[] = [];
    for (const docSnapshot of querySnapshot.docs) {
      const reservation = docSnapshot.data() as Reservation;
      
      // Fetch dress details using reservation.dressId
      const dressRef = doc(db, 'dresses', reservation.dressId);
      const dressSnap = await getDoc(dressRef);
      const dress = dressSnap.exists() ? { id: dressSnap.id, ...dressSnap.data() } as Dress : undefined;

      bookings.push({
        id: docSnapshot.id,
        ...reservation,
        dress,
      });
    }
    return bookings;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'reservations');
    return [];
  }
};
