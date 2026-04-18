import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface MaintenanceLog {
  id: string;
  cost: number;
  repairDate: Timestamp;
  // Add other relevant fields as per your Firestore structure
}

export const fetchMaintenanceLogs = async (month: number, year: number): Promise<MaintenanceLog[]> => {
  try {
    const startOfMonth = Timestamp.fromDate(new Date(year, month - 1, 1));
    const endOfMonth = Timestamp.fromDate(new Date(year, month, 0, 23, 59, 59));

    const maintenanceRef = collection(db, 'maintenance_log');
    const q = query(
      maintenanceRef,
      where('repairDate', '>=', startOfMonth),
      where('repairDate', '<=', endOfMonth)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceLog));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'maintenance_log');
    return [];
  }
};
