export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
}
export interface Dress {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}
export interface Reservation {
  id: string;
  dressId: string;
  customerName: string;
  outDate: any;
  returnDate: any;
  status: 'Pending' | 'Active' | 'Returned' | 'Late';
}
export interface BookingWithDress extends Reservation {
  dress?: Dress;
}
