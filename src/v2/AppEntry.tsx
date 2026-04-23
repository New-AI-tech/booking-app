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

import { useLocation } from 'react-router-dom';

function AdminOnboarding() {
    const navigate = useNavigate();
    return (
        <div className="py-8 px-6 max-w-6xl mx-auto">
            <DressForm 
                onSuccess={() => navigate('/inventory')} 
                onCancel={() => navigate('/inventory')} 
            />
        </div>
    );
}

function LayoutContent({ userProfile, loading }: { userProfile: UserProfile | null, loading: boolean }) {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900" dir="rtl">
            {userProfile && (
                <nav className={`px-8 py-5 flex justify-between items-center fixed top-0 w-full z-50 transition-all duration-500 ${
                    isHomePage ? 'bg-transparent border-transparent' : 'bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm'
                }`}>
                    <Link to="/" className={`flex items-center gap-3 font-bold text-2xl transition-all ${isHomePage ? 'text-white' : 'text-stone-900'}`}>
                        <Sparkles className={`w-7 h-7 ${isHomePage ? 'text-white' : 'text-stone-900'}`} /> آتليه فريال الحصري
                    </Link>
                    <div className={`flex gap-8 text-sm font-bold tracking-wide ${isHomePage ? 'text-white/90' : 'text-stone-500'}`}>
                        <Link to="/inventory" className="hover:opacity-70 transition-all flex items-center gap-2">
                            <Package className="w-4 h-4" /> المخزون
                        </Link>
                        <Link to="/staff" className="hover:opacity-70 transition-all flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" /> لوحة التحكم
                        </Link>
                        {userProfile.role === 'admin' && (
                            <>
                                <Link to="/admin" className="hover:opacity-70 transition-all flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" /> الإدارة
                                </Link>
                                <Link to="/income" className="hover:opacity-70 transition-all flex items-center gap-2">
                                    <BarChart2 className="w-4 h-4" /> كشف الدخل
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`hidden sm:block text-left ${isHomePage ? 'text-white' : 'text-stone-900'}`}>
                            <p className="text-xs font-black">{userProfile.displayName}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${isHomePage ? 'text-white/60' : 'text-stone-400'}`}>
                                {userProfile.role === 'admin' ? 'مدير' : 'موظف'}
                            </p>
                        </div>
                        <button
                            onClick={() => authService.signOut()}
                            className={`p-2 transition-colors ${isHomePage ? 'text-white/40 hover:text-white' : 'text-stone-400 hover:text-rose-600'}`}
                            title="تسجيل الخروج"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </nav>
            )}

            <main className={`${isHomePage ? 'w-full' : 'max-w-7xl mx-auto px-6 pt-24 pb-12'}`}>
                <Routes>
                    <Route path="/login" element={!userProfile ? <LoginPage /> : <Navigate to="/" />} />

                    <Route path="/" element={
                        <ProtectedRoute userProfile={userProfile} loading={loading}>
                            <div className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
                                {/* High-Definition Fullscreen Video Background */}
                                <video 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline 
                                    className="absolute inset-0 w-full h-full object-cover z-0"
                                >
                                    <source src="/background-video.mp4" type="video/mp4" />
                                </video>
                                
                                {/* Sophisticated Dark Vignette Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 backdrop-blur-[1px] z-10" />
                                
                                {/* Centered Hero Content */}
                                <div className="relative z-10 text-center space-y-10 px-6 max-w-4xl animate-in">
                                    <div className="inline-block bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl mb-4">
                                        <Sparkles className="w-16 h-16 text-white" />
                                    </div>
                                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[1.1]">
                                        آتليه <br/>
                                        <span className="text-white/80">فريال الحصري</span>
                                    </h1>
                                    <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed italic">
                                        أناقة التصميم.. وفخامة الحضور
                                    </p>
                                    <div className="pt-6">
                                        <Link
                                            to="/inventory"
                                            className="inline-block px-14 py-6 bg-white text-stone-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-stone-100 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95"
                                        >
                                            دخول المجموعة
                                        </Link>
                                    </div>
                                </div>
                                
                                {/* Bottom Accent */}
                                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
                                    Est. 2024
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
                <LayoutContent userProfile={userProfile} loading={loading} />
            </BrowserRouter>
        </ErrorBoundary>
    );
}

