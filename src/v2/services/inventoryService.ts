import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase-bridge';
import { Dress, InventoryItem } from '../types';

export const inventoryService = {
  async fetchDresses(): Promise<Dress[]> {
    try {
      const q = collection(db, 'dresses');
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dress));
    } catch (error) {
      handleFirestoreError(OperationType.LIST, error, 'dresses');
    }
  },

  async addDress(dress: Omit<Dress, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'dresses'), dress);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(OperationType.CREATE, error, 'dresses');
    }
  },

  async updateDress(id: string, dress: Partial<Dress>): Promise<void> {
    try {
      const docRef = doc(db, 'dresses', id);
      await updateDoc(docRef, dress);
    } catch (error) {
      handleFirestoreError(OperationType.UPDATE, error, 'dresses');
    }
  },

  async fetchInventoryItems(dressId: string): Promise<InventoryItem[]> {
    try {
      const q = query(collection(db, 'inventory_items'), where('dressId', '==', dressId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
    } catch (error) {
      handleFirestoreError(OperationType.LIST, error, 'inventory_items');
    }
  },

  async addInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'inventory_items'), item);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(OperationType.CREATE, error, 'inventory_items');
    }
  }
};
