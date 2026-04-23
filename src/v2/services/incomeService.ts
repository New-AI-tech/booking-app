import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase-bridge';
import { IncomeData, MaintenanceLog, Reservation } from '../types';

// Fixed monthly overhead (configurable)
const FIXED_COSTS = {
    rent: 2000,
    utilities: 300,
    software: 150,
    insurance: 200,
    salaries: 5000,
    marketing: 500,
};
const TOTAL_FIXED = Object.values(FIXED_COSTS).reduce((a, b) => a + b, 0);


export async function fetchIncomeData(month: number, year: number): Promise<IncomeData> {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);

        const startTs = Timestamp.fromDate(startOfMonth);
        const endTs = Timestamp.fromDate(endOfMonth);

        // 1. Revenue from confirmed reservations in this month
        const resQuery = query(
            collection(db, 'reservations'),
            where('status', '==', 'confirmed'),
            where('startDate', '>=', startTs),
            where('startDate', '<=', endTs)
        );
        const resSnap = await getDocs(resQuery);
        const reservations = resSnap.docs.map(d => ({ id: d.id, ...d.data() } as Reservation));
        const revenue = reservations.reduce((sum, r) => sum + (r.totalPrice ?? 0), 0);

        // 2. Variable costs from maintenance_log in this month
        const maintQuery = query(
            collection(db, 'maintenance_log'),
            where('date', '>=', startTs),
            where('date', '<=', endTs)
        );
        const maintSnap = await getDocs(maintQuery);
        const maintenanceCosts = maintSnap.docs
            .map(d => (d.data() as MaintenanceLog).cost ?? 0)
            .reduce((sum, c) => sum + c, 0);

        const grossProfit = revenue - maintenanceCosts;
        const netProfit = grossProfit - TOTAL_FIXED;

        return {
            revenue,
            maintenanceCosts,
            fixedCosts: TOTAL_FIXED,
            grossProfit,
            netProfit,
            bookingCount: reservations.length,
        };
    }

export const incomeService = { fetchIncomeData };
