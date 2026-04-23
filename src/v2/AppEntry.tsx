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
        <div className="py-8">
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
        <div className="h-screen flex items-center justify-center bg-stone-50" dir="rtl">
            <Loader2 className="w-8 h-8 text-stone-900 animate-spin" />
        </div>
    );

    return (
        <ErrorBoundary>
            <BrowserRouter>
                <div className="min-h-screen bg-stone-50 text-stone-900" dir="rtl">
                    {userProfile && (
                        <nav className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-stone-900 hover:opacity-80 transition-opacity">
                                <Sparkles className="w-6 h-6 text-stone-900" /> ڤوج رينت
                            </Link>
                            <div className="flex gap-6 text-sm font-semibold text-stone-500">
                                <Link to="/inventory" className="hover:text-stone-900 transition-colors flex items-center gap-2">
                                    <Package className="w-4 h-4" /> المخزون
                                </Link>
                                <Link to="/staff" className="hover:text-stone-900 transition-colors flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4" /> لوحة التحكم
                                </Link>
                                {userProfile.role === 'admin' && (
                                    <>
                                        <Link to="/admin" className="text-stone-700 hover:text-stone-900 transition-colors flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" /> الإدارة
                                        </Link>
                                        <Link to="/income" className="text-stone-700 hover:text-stone-900 transition-colors flex items-center gap-2">
                                            <BarChart2 className="w-4 h-4" /> كشف الدخل
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-bold text-stone-900">{userProfile.displayName}</p>
                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{userProfile.role === 'admin' ? 'مدير' : 'موظف'}</p>
                                </div>
                                <button
                                    onClick={() => authService.signOut()}
                                    className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                                    title="تسجيل الخروج"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </nav>
                    )}

                    <main className="max-w-6xl mx-auto px-6 py-8">
                        <Routes>
                            <Route path="/login" element={!userProfile ? <LoginPage /> : <Navigate to="/" />} />

                            <Route path="/" element={
                                <ProtectedRoute userProfile={userProfile} loading={loading}>
                                    <div className="py-24 text-center space-y-8 animate-in">
                                        <div className="inline-block bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-4">
                                            <Sparkles className="w-12 h-12 text-stone-900" />
                                        </div>
                                        <h1 className="text-5xl font-bold text-stone-900 tracking-tight">
                                            أهلاً بك، <span className="text-stone-500 font-medium">{userProfile?.displayName?.split(' ')[0]}</span>
                                        </h1>
                                        <p className="text-lg text-stone-500 max-w-lg mx-auto">
                                            إدارة المجموعة الأكثر تميزاً لفساتين السهرة في مكان واحد.
                                        </p>
                                        <Link
                                            to="/inventory"
                                            className="inline-block mt-4 px-12 py-4 bg-stone-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg"
                                        >
                                            دخول المجموعة
                                        </Link>
                                    </div>
                                </ProtectedRoute>
                            } />

                            <Route path="/inventory" element={
                                <ProtectedRoute userProfile={userProfile} loading={loading}>
                                    <InventoryList isAdmin={userProfile?.role === 'admin'} />
                                </ProtectedRoute>
                            } />

                            <Route path="/income" element={
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
