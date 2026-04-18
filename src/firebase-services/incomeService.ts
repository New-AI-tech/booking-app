import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Reservation } from '../types';

interface IncomeData {
  revenue: { rental: number; delay: number; total: number; };
  variableCosts: { cleaning: number; repairs: number; total: number; };
  grossProfit: number;
  fixedCosts: { rent: number; utilities: number; software_subs: number; insurance: number; salaries: number; marketing: number; total: number; };
  netProfit: number;
}

export const fetchIncomeData = async (month: number, year: number): Promise<IncomeData> => {
  try {
    const startOfMonth = Timestamp.fromDate(new Date(year, month - 1, 1));
    const endOfMonth = Timestamp.fromDate(new Date(year, month, 0, 23, 59, 59));

    // Fetch revenues & variable costs from reservations
    const reservationsRef = collection(db, 'reservations');
    const reservationsQuery = query(
      reservationsRef,
      where('startDate', '>=', startOfMonth),
      where('startDate', '<=', endOfMonth)
    );
    const reservationsSnap = await getDocs(reservationsQuery);
    const reservations = reservationsSnap.docs.map(doc => doc.data() as Reservation);

    // For now, we'll use placeholder data for maintenance and fixed expenses
    // In a real scenario, these would come from dedicated Firestore collections
    const maintenanceCosts = 0; // Placeholder
    const fixedExpenses = {
      rent: 1000, utilities: 200, software_subs: 150, insurance: 50, salaries: 2000, marketing: 300
    }; // Placeholder

    // Calculations
    const rentalRev = reservations.reduce((acc, r) => acc + (r.totalPrice || 0), 0); // Assuming totalPrice includes base rental
    const delayRev = 0; // Not directly available in current Reservation type, placeholder
    const totalRev = rentalRev + delayRev;

    const varCleaning = 0; // Not directly available in current Reservation type, placeholder
    const varRepair = maintenanceCosts; // Placeholder
    const totalVarCosts = varCleaning + varRepair;

    const grossProfit = totalRev - totalVarCosts;

    const totalFixed = fixedExpenses.rent + fixedExpenses.utilities + fixedExpenses.software_subs + fixedExpenses.insurance + fixedExpenses.salaries + fixedExpenses.marketing;

    const netProfit = grossProfit - totalFixed;

    return {
      revenue: { rental: rentalRev, delay: delayRev, total: totalRev },
      variableCosts: { cleaning: varCleaning, repairs: varRepair, total: totalVarCosts },
      grossProfit,
      fixedCosts: { ...fixedExpenses, total: totalFixed },
      netProfit
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'incomeStatement');
    throw error;
  }
};
