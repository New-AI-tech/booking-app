export interface BookingWithDress {
  id: string;
  customerName: string;
  customerEmail: string;
  startDate: Date | string;
  endDate: Date | string;
  totalPrice: number;
  dressId: string;
  status: 'Pending' | 'Active' | 'Returned' | 'Late' | string;
}
export interface Dress {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
}
export interface IncomeRecord {
  id: string;
  amount: number;
  date: string;
  description: string;
}
export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  purchaseCost?: number;
  targetROI?: number;
  rentalPrice?: number;
  status: 'Available' | 'Rented' | 'In Maintenance' | string;
  image?: string;
  size?: string;
}
export interface Reservation {
  id: string;
  dressId: string;
  clientId?: string;
  customerName?: string;
  outDate: Date | string;
  returnDate: Date | string;
  startDate?: Date | string;
  bufferEndDate?: Date | string;
  rentalFee: number;
  depositAmount: number;
  status: 'Pending' | 'Active' | 'Returned' | 'Late' | string;
}
