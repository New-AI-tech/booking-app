import {
    collection, query, orderBy, limit, getDocs,
    doc, getDoc, addDoc, where, Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase-bridge';
import { BookingWithDress, Dress, Reservation } from '../types';

export const bookingService = {
    async fetchRecentBookings(): Promise<BookingWithDress[]> {
        try {
            const q = query(collection(db, 'reservations'), orderBy('startDate', 'desc'), limit(15));
            const snapshot = await getDocs(q);
            return await Promise.all(snapshot.docs.map(async (docSnap) => {
                const resData = docSnap.data() as Reservation;
                const dressSnap = await getDoc(doc(db, 'dresses', resData.dressId));
                return {
                    id: docSnap.id,
                    ...resData,
                    dress: dressSnap.exists() ? { id: dressSnap.id, ...dressSnap.data() } as Dress : undefined
                };
            }));
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    },

    async createReservation(data: Omit<Reservation, 'id'>): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, 'reservations'), {
                ...data,
                createdAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            handleFirestoreError(OperationType.CREATE, error, 'reservations');
        }
    },

    /** Check if a specific item is already booked during the proposed window (incl. buffer). */
    async isItemAvailable(itemId: string, startDate: Date, bufferEndDate: Date): Promise<boolean> {
        try {
            const q = query(
                collection(db, 'reservations'),
                where('itemId', '==', itemId),
                where('status', '==', 'confirmed'),
                where('startDate', '<=', Timestamp.fromDate(bufferEndDate)),
                where('bufferEndDate', '>=', Timestamp.fromDate(startDate))
            );
            const snap = await getDocs(q);
            return snap.empty;
        } catch (error) {
            console.error('Availability check error:', error);
            return false;
        }
    }
};
