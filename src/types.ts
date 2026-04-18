export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
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
  status: string;
  rentalFee: number;
  depositAmount: number;
  customerName?: string;
}
export interface BookingWithDress extends Reservation {
  dress?: Dress;
}
