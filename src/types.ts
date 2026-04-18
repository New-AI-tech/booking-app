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
  purchaseCost?: number;
  targetROI?: number;
  rentalPrice?: number;
  status: string;
  size?: string;
}
export interface Reservation {
  id: string;
  dressId: string;
  itemId?: string;
  clientId?: string;
  customerName?: string;
  customerEmail?: string;
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
