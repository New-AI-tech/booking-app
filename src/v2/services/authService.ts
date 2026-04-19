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
      return null;
    }
  },

  async ensureUserProfile(user: User, defaultRole: UserRole = 'staff'): Promise<UserProfile> {
    const existing = await this.getUserProfile(user.uid);
    if (existing) return existing;

    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      role: defaultRole,
      displayName: user.displayName || 'Team Member'
    };

    await setDoc(doc(db, 'users', user.uid), newProfile);
    return newProfile;
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async signOut() {
    await firebaseSignOut(auth);
  }
};
