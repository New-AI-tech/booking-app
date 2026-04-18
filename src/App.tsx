import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, addDoc, Timestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, login, logout, handleFirestoreError, OperationType } from './firebase';
import { Dress, UserProfile } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DressCard } from './components/DressCard';
import {
  Plus,
  LogOut,
  Search,
  LayoutDashboard,
  Package,
  CalendarCheck,
  Settings,
  Sparkles,
  Loader2,
  User as UserIcon
} from 'lucide-react';
 main
import { motion, AnimatePresence } from 'motion/react';

import { motion, AnimatePresence } from 'framer-motion'; // Changed from 'motion/react' to 'framer-motion'
 main
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';

// Import Admin and Staff Dashboards
import AdminDashboard from './components/admin/AdminDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import IncomeStatement from './components/admin/IncomeStatement';

// Helper for conditional class names (assuming it's in utils.ts)
import { cn } from './lib/utils';

function MainAppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingDress, setIsAddingDress] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          // Default role to 'staff' for new users
          const profile: UserProfile = {
            uid: u.uid,
            email: u.email || '',
            role: 'staff', // Default role
            displayName: u.displayName || 'Staff Member'
          };
          await setDoc(userRef, profile);
          setUserProfile(profile);
        } else {
          setUserProfile(userSnap.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'dresses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDresses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dress)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'dresses');
    });
    return unsubscribe;
  }, [user]);

  const seedData = async () => {
    try {
      const dressData = [
        { name: 'Midnight Blue Gown', category: 'Evening', basePrice: 120, cleaningBufferDays: 2, description: 'A stunning floor-length silk gown in deep midnight blue.' },
        { name: 'Pearl White Wedding Dress', category: 'Wedding', basePrice: 450, cleaningBufferDays: 5, description: 'Elegant lace wedding dress with a long train and pearl detailing.' },
        { name: 'Emerald Cocktail Dress', category: 'Cocktail', basePrice: 85, cleaningBufferDays: 1, description: 'Chic emerald green knee-length dress perfect for parties.' }
      ];

      for (const d of dressData) {
        const docRef = await addDoc(collection(db, 'dresses'), {
          ...d,
          createdAt: Timestamp.now(),
          imageUrl: `https://picsum.photos/seed/${d.name}/800/1000`
        });

        const sizes = ['S', 'M', 'L'];
        for (const size of sizes) {
          await addDoc(collection(db, 'inventory_items'), {
            dressId: docRef.id,
            size,
            color: d.name.split(' ')[0],
            status: 'available',
            sku: `${d.name.substring(0, 3).toUpperCase()}-${size}-${Math.floor(Math.random() * 1000)}`
          });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'dresses');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2ed] p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-5xl serif font-light tracking-tight text-stone-900">VogueRent</h1>
            <p className="text-stone-500 uppercase tracking-[0.2em] text-xs font-semibold">Inventory & Rental Management</p>
          </div>
          <div className="luxury-card p-10 space-y-6">
            <p className="text-stone-600 font-serif italic text-lg">"Excellence in every stitch, efficiency in every booking."</p>
            <button onClick={login} className="w-full luxury-button flex items-center justify-center gap-3 py-4">
              <Sparkles className="w-5 h-5" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredDresses = dresses.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-stone-200 p-6 flex flex-col gap-8">
          <div className="space-y-1">
            <h2 className="text-2xl serif font-semibold text-stone-900">VogueRent</h2>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Staff Portal</p>
          </div>

          <nav className="flex-1 space-y-2">
            <Link
              to="/inventory"
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                location.pathname === '/inventory' ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20' : 'text-stone-600 hover:bg-stone-50'
              )}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Inventory</span>
            </Link>
            <Link
              to="/reservations"
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                location.pathname === '/reservations' ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20' : 'text-stone-600 hover:bg-stone-50'
              )}
            >
              <CalendarCheck className="w-5 h-5" />
              <span className="font-medium">Reservations</span>
            </Link>
            {userProfile?.role === 'admin' && (
              <Link
                to="/admin"
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  location.pathname.startsWith('/admin') ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20' : 'text-stone-600 hover:bg-stone-50'
                )}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Admin</span>
              </Link>
            )}
            {userProfile?.role === 'staff' && (
              <Link
                to="/staff"
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  location.pathname.startsWith('/staff') ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20' : 'text-stone-600 hover:bg-stone-50'
                )}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Staff Dashboard</span>
              </Link>
            )}
          </nav>

          <div className="pt-6 border-t border-stone-100 space-y-4">
            <div className="flex items-center gap-3 px-4">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-stone-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-900 truncate">{user.displayName}</p>
                <p className="text-[10px] text-stone-400 uppercase font-bold">{userProfile?.role}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-stone-500 hover:text-rose-600 transition-colors text-sm font-medium">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-10">
          <Routes>
            <Route path="/inventory" element={
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-8"
              >
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 col-span-full">
                  <div>
                    <h1 className="text-4xl serif font-medium text-stone-900 capitalize">Inventory</h1>
                    <p className="text-stone-500 text-sm">Manage your boutique's inventory seamlessly.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search dresses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all w-full md:w-64"
                      />
                    </div>
                    {userProfile?.role === 'admin' && (
                      <button
                        onClick={() => setIsAddingDress(true)}
                        className="luxury-button flex items-center gap-2 whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        New Design
                      </button>
                    )}
                  </div>
                </header>
                {filteredDresses.length > 0 ? (
                  filteredDresses.map(dress => (
                    <DressCard key={dress.id} dress={dress} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
                      <Package className="w-8 h-8 text-stone-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-stone-900 font-medium">No dresses found</p>
                      <p className="text-stone-500 text-sm">Try adjusting your search or add a new design.</p>
                    </div>
                    {dresses.length === 0 && (
                      <button onClick={seedData} className="luxury-button-outline inline-flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Seed Sample Data
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            } />
            <Route path="/reservations" element={
              <motion.div
                key="reservations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="luxury-card p-12 text-center"
              >
                <CalendarCheck className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                <h3 className="text-xl serif text-stone-900 mb-2">Reservation Management</h3>
                <p className="text-stone-500 max-w-md mx-auto">
                  This section will list all active and past bookings. Use the inventory tab to check availability and create new reservations.
                </p>
              </motion.div>
            } />
            {userProfile?.role === 'admin' && (
              <Route path="/admin/*" element={<AdminDashboard />}>
                <Route path="income" element={<IncomeStatement />} />
                {/* Add other admin routes here */}
              </Route>
            )}
            {userProfile?.role === 'staff' && (
              <Route path="/staff" element={<StaffDashboard />} />
            )}
            <Route path="*" element={<motion.div
                key="not-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="luxury-card p-12 text-center"
              >
                <h3 className="text-xl serif text-stone-900 mb-2">Page Not Found</h3>
                <p className="text-stone-500 max-w-md mx-auto">
                  The page you are looking for does not exist.
                </p>
              </motion.div>} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <Router>
      <MainAppContent />
    </Router>
  );
}
