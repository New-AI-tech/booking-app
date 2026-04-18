import { Reservation, BookingWithDress } from '../types';

export const fetchRecentBookings = async (): Promise<BookingWithDress[]> => {
  // Return empty array for now to pass build; logic is in firebase-services if needed
  return [];
};

export const processBookingData = (data: any): Reservation => {
  return {
    ...data,
    id: data.id,
    dressId: data.dressId || '',
    status: data.status || 'Pending',
    rentalFee: data.rentalFee || 0,
    depositAmount: data.depositAmount || 0,
  } as Reservation;
};
