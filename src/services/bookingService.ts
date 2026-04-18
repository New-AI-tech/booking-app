import { Reservation } from '../types';

export const processBookingData = (data: any): Reservation => {
  return {
    ...data,
    id: data.id,
    outDate: data.outDate,
    returnDate: data.returnDate,
    startDate: data.startDate || data.outDate,
    endDate: data.endDate || data.returnDate,
    status: data.status || 'Pending',
    rentalFee: data.rentalFee || 0,
    depositAmount: data.depositAmount || 0,
    dressId: data.dressId || '',
  } as Reservation;
};
