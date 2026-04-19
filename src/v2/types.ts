import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'staff' | 'customer';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
}

export interface Dress {
  id: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  cleaningBufferDays: number;
  imageUrl?: string;
  createdAt?: Timestamp;
}

export interface InventoryItem {
  id: string;
  dressId: string;
  size: string;
  color?: string;
  sku?: string;
  status: 'available' | 'rented' | 'maintenance' | 'retired';
}

export interface Reservation {
  id: string;
  itemId: string;
  dressId: string;
  customerName: string;
  customerEmail: string;
  startDate: Timestamp;
  endDate: Timestamp;
  bufferEndDate: Timestamp;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'active' | 'returned';
  createdAt?: Timestamp;
}

export interface BookingWithDress extends Reservation {
  dress?: Dress;
}
