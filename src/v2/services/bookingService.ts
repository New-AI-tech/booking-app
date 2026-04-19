import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-bridge';
import { BookingWithDress, Dress, Reservation } from '../types';

export const bookingService = {
    async fetchRecentBookings(): Promise<BookingWithDress[]> {
        try {
            const q = query(collection(db, 'reservations'), orderBy('startDate', 'desc'), limit(15));
            const snapshot = await getDocs(q);

            const bookings = await Promise.all(snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data() as Reservation;
                // Parallel fetch for dress details
                const dressRef = doc(db, 'dresses', data.dressId);
                const dressSnap = await getDoc(dressRef);
                const dress = dressSnap.exists() ? { id: dressSnap.id, ...dressSnap.data() } as Dress : undefined;

                return {
                    id: docSnap.id,
                    ...data,
                    dress
                };
            }));

            return bookings;
        } catch (error) {
            console.error("Booking Fetch Error:", error);
            return [];
        }
    }
};
