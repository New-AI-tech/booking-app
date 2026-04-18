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
export interface InventoryItem extends Dress {
  status: string;
  purchaseCost?: number;
  targetROI?: number;
}
export interface Reservation {
  id: string;
  dressId: string;
  customerName?: string;
  customerEmail?: string;
  outDate: any;
  returnDate: any;
  status: string;
  rentalFee: number;
  depositAmount: number;
  totalPrice?: number;
}
export interface BookingWithDress extends Reservation {
  dress?: Dress;
}
