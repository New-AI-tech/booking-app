import { Timestamp } from 'firebase/firestore';

export interface Dress {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  cleaningBufferDays: number;
  imageUrl: string;
  createdAt: Timestamp;
}

export interface InventoryItem {
  id: string;
  dressId: string;
  size: string;
  color: string;
  status: 'available' | 'maintenance' | 'retired';
  sku: string;
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
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'staff';
  displayName: string;
}
