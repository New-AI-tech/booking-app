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
                                <Sparkles className="w-6 h-6 text-stone-900" /> آتليه فريال الحصري
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
                                    <div className="relative -mx-6 -mt-8 h-[calc(100vh-80px)] min-h-[600px] flex items-center justify-center overflow-hidden">
                                        {/* Hero Background with Overlay */}
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                                            style={{ backgroundImage: "url('/hero-bg.jpg')" }}
                                        />
                                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                                        
                                        {/* Hero Content */}
                                        <div className="relative z-10 text-center space-y-8 px-6 animate-in">
                                            <div className="inline-block bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl mb-4">
                                                <Sparkles className="w-12 h-12 text-white" />
                                            </div>
                                            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                                                أهلاً بك في <br/>
                                                <span className="text-stone-300">آتليه فريال الحصري</span>
                                            </h1>
                                            <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto font-medium leading-relaxed">
                                                حيث تجتمع الفخامة مع الإبداع في كل تصميم. <br/>
                                                إدارة المجموعة الأكثر تميزاً لفساتين السهرة.
                                            </p>
                                            <Link
                                                to="/inventory"
                                                className="inline-block mt-8 px-12 py-5 bg-white text-stone-900 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-stone-100 transition-all shadow-2xl hover:scale-105"
                                            >
                                                دخول المجموعة
                                            </Link>
                                        </div>
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
