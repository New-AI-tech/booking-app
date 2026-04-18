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
