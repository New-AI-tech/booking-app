import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import { UserProfile } from './types';
import { User } from 'firebase/auth';
import { StaffDashboard } from './components/StaffDashboard';
import InventoryList from './components/Inventory/InventoryList';
import LoginPage from './components/Auth/LoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { LogOut, Sparkles, LayoutDashboard, Package, ShieldCheck, Loader2 } from 'lucide-react';

export default function AppEntry() {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                const profile = await authService.ensureUserProfile(firebaseUser);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const NavLink = ({ to, icon: Icon, children }: any) => (
        <Link 
            to={to} 
            className="flex items-center gap-3 px-6 py-3 text-stone-500 hover:text-stone-900 transition-all text-sm font-bold uppercase tracking-widest group"
        >
            <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {children}
        </Link>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="w-8 h-8 text-stone-900 animate-spin" />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
                {userProfile && (
                    <nav className="bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50 px-8 py-2 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-12">
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="bg-stone-900 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                                    <Sparkles className="w-5 h-5 text-gold" />
                                </div>
                                <span className="font-serif text-xl tracking-tight">VogueRent</span>
                            </Link>
                            
                            <div className="hidden md:flex items-center">
                                <NavLink to="/inventory" icon={Package}>Inventory</NavLink>
                                <NavLink to="/staff" icon={LayoutDashboard}>Dashboard</NavLink>
                                {userProfile.role === 'admin' && (
                                    <NavLink to="/admin" icon={ShieldCheck}>Admin Panel</NavLink>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end hidden sm:flex">
                                <p className="text-xs font-bold text-stone-900 uppercase tracking-tighter">{userProfile.displayName}</p>
                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{userProfile.role}</p>
                            </div>
                            <button 
                                onClick={() => authService.signOut()}
                                className="p-3 bg-stone-50 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </nav>
                )}

                <main className={userProfile ? "max-w-7xl mx-auto px-6 py-12" : ""}>
                    <Routes>
                        <Route path="/login" element={userProfile ? <Navigate to="/" /> : <LoginPage />} />
                        
                        <Route path="/" element={
                            <ProtectedRoute userProfile={userProfile} loading={loading}>
                                <div className="py-20 text-center space-y-6 animate-in fade-in zoom-in duration-1000">
                                    <div className="inline-block bg-white p-3 rounded-2xl shadow-xl shadow-stone-200 mb-4">
                                        <Sparkles className="w-12 h-12 text-gold" />
                                    </div>
                                    <h1 className="text-6xl font-serif text-stone-900 tracking-tight">Welcome, <span className="italic text-stone-600">{userProfile?.displayName?.split(' ')[0]}</span></h1>
                                    <p className="text-xl text-stone-400 font-serif italic max-w-lg mx-auto">
                                        Managing the world's most exclusive evening wear collection with effortless precision.
                                    </p>
                                    <div className="flex items-center justify-center gap-4 pt-10">
                                        <Link to="/inventory" className="px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-200">
                                            Manage Inventory
                                        </Link>
                                    </div>
                                </div>
                            </ProtectedRoute>
                        } />

                        <Route path="/inventory" element={
                            <ProtectedRoute userProfile={userProfile} loading={loading}>
                                <InventoryList />
                            </ProtectedRoute>
                        } />

                        <Route path="/staff" element={
                            <ProtectedRoute userProfile={userProfile} loading={loading}>
                                <StaffDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin" element={
                            <ProtectedRoute userProfile={userProfile} loading={loading} requiredRole="admin">
                                <div className="py-20 text-center space-y-4">
                                    <h2 className="text-4xl font-serif text-stone-900">Admin Control</h2>
                                    <p className="text-stone-400 italic">Advanced system settings and designer management.</p>
                                </div>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
