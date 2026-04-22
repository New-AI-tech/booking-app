import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-bridge';
import { UserProfile, UserRole } from '../types';

export const authService = {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async ensureUserProfile(user: User, defaultRole: UserRole = 'staff'): Promise<UserProfile> {
    try {
      const existing = await this.getUserProfile(user.uid);
      
      // If the profile exists, return it exactly as is. 
      // This prevents the 'staff' overwrite logic from ever running.
      if (existing) return existing;

      // Only create a NEW document if we are 100% sure one doesn't exist
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        role: defaultRole,
        displayName: user.displayName || 'Team Member'
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);
      return newProfile;
    } catch (error) {
      console.warn('Client is offline, aborting overwrite and returning local auth state.', error);
      return {
        uid: user.uid,
        email: user.email || '',
        role: defaultRole,
        displayName: user.displayName || 'Team Member'
      };
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async signOut() {
    await firebaseSignOut(auth);
  }
};
