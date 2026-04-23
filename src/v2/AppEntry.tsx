import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { authService } from './services/authService';
import { UserProfile } from './types';
import { StaffDashboard } from './components/StaffDashboard';
import InventoryList from './components/Inventory/InventoryList';
import IncomeStatement from './components/IncomeStatement';
import LoginPage from './components/Auth/LoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import DressForm from './components/Inventory/DressForm';
import { Package, LayoutDashboard, ShieldCheck, LogOut, Sparkles, Loader2, BarChart2, Menu, X } from 'lucide-react';

function AdminOnboarding() {
    const navigate = useNavigate();
    return (
        <div className="py-8 px-4 md:px-8 max-w-6xl mx-auto">
            <DressForm 
                onSuccess={() => navigate('/inventory')} 
                onCancel={() => navigate('/inventory')} 
            />
        </div>
    );
}

function LayoutContent({ userProfile, loading }: { userProfile: UserProfile | null, loading: boolean }) {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isHomePage = location.pathname === '/';
    const isLoginPage = location.pathname === '/login';
    const showGlobalVideo = isHomePage || isLoginPage;

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { to: "/inventory", label: "المخزون", icon: Package },
        { to: "/staff", label: "لوحة التحكم", icon: LayoutDashboard },
        ...(userProfile?.role === 'admin' ? [
            { to: "/admin", label: "الإدارة", icon: ShieldCheck },
            { to: "/income", label: "كشف الدخل", icon: BarChart2 }
        ] : [])
    ];

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 relative overflow-x-hidden" dir="rtl">
            {/* Global Video Background */}
            {showGlobalVideo && (
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        poster="/hero-bg.jpg"
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/background-video.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 backdrop-blur-[1px]" />
                </div>
            )}

            {userProfile && (
                <nav className={`px-4 md:px-8 py-4 md:py-5 flex justify-between items-center fixed top-0 w-full z-50 transition-all duration-500 ${
                    isHomePage ? 'bg-transparent border-transparent' : 'bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm'
                }`}>
                    <Link to="/" className={`flex items-center gap-2 md:gap-3 font-bold text-xl md:text-2xl transition-all ${isHomePage ? 'text-white' : 'text-stone-900'}`}>
                        <Sparkles className={`w-6 h-6 md:w-7 md:h-7 ${isHomePage ? 'text-white' : 'text-stone-900'}`} /> 
                        <span className="truncate">آتليه فريال الحصري</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className={`hidden md:flex gap-8 text-sm font-bold tracking-wide ${isHomePage ? 'text-white/90' : 'text-stone-500'}`}>
                        {navLinks.map(link => (
                            <Link key={link.to} to={link.to} className="hover:opacity-70 transition-all flex items-center gap-2">
                                <link.icon className="w-4 h-4" /> {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className={`hidden sm:block text-left ${isHomePage ? 'text-white' : 'text-stone-900'}`}>
                            <p className="text-xs font-black">{userProfile.displayName}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${isHomePage ? 'text-white/60' : 'text-stone-400'}`}>
                                {userProfile.role === 'admin' ? 'مدير' : 'موظف'}
                            </p>
                        </div>
                        
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 transition-colors ${isHomePage ? 'text-white' : 'text-stone-900'}`}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        <button
                            onClick={() => authService.signOut()}
                            className={`hidden md:block p-2 transition-colors ${isHomePage ? 'text-white/40 hover:text-white' : 'text-stone-400 hover:text-rose-600'}`}
                            title="تسجيل الخروج"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <div className="absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-xl p-6 flex flex-col gap-6 md:hidden animate-in" dir="rtl">
                            {navLinks.map(link => (
                                <Link key={link.to} to={link.to} className="flex items-center gap-4 text-lg font-bold text-stone-900">
                                    <link.icon className="w-6 h-6 text-stone-400" /> {link.label}
                                </Link>
                            ))}
                            <button
                                onClick={() => authService.signOut()}
                                className="flex items-center gap-4 text-lg font-bold text-rose-600 pt-4 border-t border-stone-100"
                            >
                                <LogOut className="w-6 h-6" /> تسجيل الخروج
                            </button>
                        </div>
                    )}
                </nav>
            )}

            <main className={`relative z-10 ${isHomePage ? 'w-full' : 'max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-12'}`}>
                <Routes>
                    <Route path="/login" element={!userProfile ? <LoginPage /> : <Navigate to="/" />} />

                    <Route path="/" element={
                        <ProtectedRoute userProfile={userProfile} loading={loading}>
                            <div className="w-full h-screen min-h-[600px] flex items-center justify-center">
                                <div className="text-center space-y-6 md:space-y-10 px-4 md:px-6 max-w-4xl animate-in">
                                    <div className="inline-block bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl mb-4">
                                        <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white" />
                                    </div>
                                    <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-[1.1]">
                                        آتليه <br/>
                                        <span className="text-white/80">فريال الحصري</span>
                                    </h1>
                                    <p className="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed italic">
                                        أناقة التصميم.. وفخامة الحضور
                                    </p>
                                    <div className="pt-4 md:pt-6">
                                        <Link
                                            to="/inventory"
                                            className="inline-block px-10 md:px-14 py-4 md:py-6 bg-white text-stone-900 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-stone-100 transition-all shadow-2xl hover:scale-105 active:scale-95"
                                        >
                                            دخول المجموعة
                                        </Link>
                                    </div>
                                </div>
                                <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-white/20 text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em]">
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
