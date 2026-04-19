export type UserRole = 'admin' | 'staff' | 'customer';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
}

export interface Dress {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  category: string;
  imageUrl?: string;
  cleaningBufferDays: number;
}

export interface InventoryItem {
  id: string;
  dressId: string;
  size: string;
  status: 'available' | 'rented' | 'maintenance' | 'retired';
  notes?: string;
}

export interface Reservation {
  id: string;
  dressId: string;
  itemId: string;
  customerName: string;
  customerEmail: string;
  startDate: any; // Firestore Timestamp
  endDate: any;   // Firestore Timestamp
  bufferEndDate: any; // Firestore Timestamp (endDate + cleaningBufferDays)
  status: 'pending' | 'confirmed' | 'cancelled' | 'active' | 'returned';
  totalPrice: number;
  depositAmount: number;
}

export interface BookingWithDress extends Reservation {
  dress?: Dress;
}
