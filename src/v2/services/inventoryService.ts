import {
    collection, getDocs, addDoc, updateDoc,
    doc, query, where, Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase-bridge';
import { Dress, InventoryItem } from '../types';

export const inventoryService = {
    async fetchDresses(): Promise<Dress[]> {
        try {
            const snapshot = await getDocs(collection(db, 'dresses'));
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Dress));
        } catch (error) {
            handleFirestoreError(OperationType.LIST, error, 'dresses');
        }
    },

    async addDress(dress: Omit<Dress, 'id'>): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, 'dresses'), {
                ...dress,
                createdAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            handleFirestoreError(OperationType.CREATE, error, 'dresses');
        }
    },

    async updateDress(id: string, dress: Partial<Omit<Dress, 'id'>>): Promise<void> {
        try {
            await updateDoc(doc(db, 'dresses', id), dress as Record<string, unknown>);
        } catch (error) {
            handleFirestoreError(OperationType.UPDATE, error, 'dresses');
        }
    },

    async fetchInventoryItems(dressId: string): Promise<InventoryItem[]> {
        try {
            const q = query(collection(db, 'inventory_items'), where('dressId', '==', dressId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem));
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
