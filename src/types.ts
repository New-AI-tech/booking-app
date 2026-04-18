export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  displayName?: string;
}
export interface Dress {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
}
export interface Reservation {
  id: string;
  dressId: string;
  itemId?: string;
  outDate: any;
  returnDate: any;
  startDate?: any;
  endDate?: any;
  bufferEndDate?: any;
  status: string;
  rentalFee: number;
  totalPrice?: number;
  depositAmount: number;
}
export interface BookingWithDress extends Reservation {
  dress?: Dress;
}
