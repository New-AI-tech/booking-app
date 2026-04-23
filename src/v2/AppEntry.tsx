import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { authService } from './services/authService';
import { UserProfile } from './types';
import { StaffDashboard } from './components/StaffDashboard';
import InventoryList from './components/Inventory/InventoryList';
import IncomeStatement from './components/IncomeStatement';
import LoginPage from './components/Auth/LoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import DressForm from './components/Inventory/DressForm';
import { Package, LayoutDashboard, ShieldCheck, LogOut, Sparkles, Loader2, BarChart2 } from 'lucide-react';

function AdminOnboarding() {
    const navigate = useNavigate();
    return (
        <div className="py-12">
            <DressForm 
                onSuccess={() => navigate('/inventory')} 
                onCancel={() => navigate('/inventory')} 
            />
        </div>
    );
}

export default function AppEntry() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChange(async (user) => {
            if (user) {
                const profile = await authService.ensureUserProfile(user);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-stone-50">
            <Loader2 className="w-8 h-8 text-stone-900 animate-spin" />
        </div>
    );

    return (
        <ErrorBoundary>
            <BrowserRouter>
                <div className="min-h-screen bg-stone-50">
                    {userProfile && (
                        <nav className="bg-white border-b border-stone-100 px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                            <Link to="/" className="flex items-center gap-2 font-serif text-xl text-stone-900 hover:text-stone-700 transition-colors">
                                <Sparkles className="w-5 h-5 text-amber-500" /> VogueRent
                            </Link>
                            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                                <Link to="/inventory" className="hover:text-stone-900 transition-colors flex items-center gap-2">
                                    <Package className="w-3 h-3" /> Inventory
                                </Link>
                                <Link to="/staff" className="hover:text-stone-900 transition-colors flex items-center gap-2">
                                    <LayoutDashboard className="w-3 h-3" /> Dashboard
                                </Link>
                                {userProfile.role === 'admin' && (
                                    <>
                                        <Link to="/admin" className="text-amber-600 hover:text-stone-900 transition-colors flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3" /> Admin
                                        </Link>
                                        <Link to="/admin/income" className="text-amber-600 hover:text-stone-900 transition-colors flex items-center gap-2">
                                            <BarChart2 className="w-3 h-3" /> Income
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block text-right">
                                    <p className="text-[10px] font-bold text-stone-900 uppercase tracking-tighter">{userProfile.displayName}</p>
                                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{userProfile.role}</p>
                                </div>
                                <button
                                    onClick={() => authService.signOut()}
                                    className="p-2 text-stone-300 hover:text-rose-600 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </nav>
                    )}

                    <main className="max-w-7xl mx-auto px-6 py-12">
                        <Routes>
                            <Route path="/login" element={!userProfile ? <LoginPage /> : <Navigate to="/" />} />

                            <Route path="/" element={
                                <ProtectedRoute userProfile={userProfile} loading={loading}>
                                    <div className="py-20 text-center space-y-8 animate-in fade-in zoom-in duration-700">
                                        <div className="inline-block bg-white p-4 rounded-2xl shadow-xl shadow-stone-200 mb-2">
                                            <Sparkles className="w-12 h-12 text-amber-500" />
                                        </div>
                                        <h1 className="text-6xl font-serif text-stone-900 tracking-tight">
                                            Welcome, <span className="italic text-stone-500">{userProfile?.displayName?.split(' ')[0]}</span>
                                        </h1>
                                        <p className="text-xl text-stone-400 font-serif italic max-w-lg mx-auto">
                                            Managing the world's most exclusive evening wear collection.
                                        </p>
                                        <Link
                                            to="/inventory"
                                            className="inline-block mt-4 px-10 py-5 bg-stone-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
                                        >
                                            Enter Collection
                                        </Link>
                                    </div>
                                </ProtectedRoute>
                            } />

                            <Route path="/inventory" element={
                                <ProtectedRoute userProfile={userProfile} loading={loading}>
                                    <InventoryList isAdmin={userProfile?.role === 'admin'} />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin/income" element={
                                <ProtectedRoute userProfile={userProfile} loading={loading} requiredRole="admin">
                                    <IncomeStatement />
                                </ProtectedRoute>
                            } />

                            <Route path="/staff" element={
                                <ProtectedRoute userProfile={userProfile} loading={loading}>
                                    <StaffDashboard />
                                </ProtectedRoute>
                            } />

                            <Route path="/admin" element={
                                <ProtectedRoute userProfile={userProfile} loading={loading} requiredRole="admin">
                                    <AdminOnboarding />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </ErrorBoundary>
    );
}
