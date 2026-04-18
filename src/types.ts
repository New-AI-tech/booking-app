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
  size?: string; // Fixed: Added size
}

export interface Reservation {
  id: string;
  dressId: string;
  status: string;
  rentalFee: number;
  depositAmount: number;
  itemId?: string;      // Fixed: Added itemId
  startDate?: any;      // Fixed: Added startDate
  endDate?: any;        // Fixed: Added endDate
  outDate?: any;
  returnDate?: any;
  bufferEndDate?: any;  // Fixed: Added bufferEndDate
  customerName?: string;
  customerEmail?: string;
  totalPrice?: number;
}

export interface BookingWithDress extends Reservation {
  dress?: Dress;
}
