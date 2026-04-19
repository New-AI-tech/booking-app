import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserProfile, UserRole } from '../../types';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    userProfile: UserProfile | null;
    loading: boolean;
    requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, userProfile, loading, requiredRole }: ProtectedRouteProps) {
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-stone-900 animate-spin" />
            </div>
        );
    }

    // Not authenticated at all — send to login
    if (!userProfile) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Authenticated but profile missing from Firestore (race condition on first login)
    // The authService.ensureUserProfile() should prevent this, but handle gracefully
    if (!userProfile.role) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
                <AlertCircle className="w-10 h-10 text-amber-500" />
                <h2 className="text-xl font-serif text-stone-900">Account setup incomplete</h2>
                <p className="text-stone-400 text-sm max-w-xs">
                    Your account was created but a system role hasn't been assigned yet.
                    Please contact your administrator.
                </p>
            </div>
        );
    }

    // Role mismatch — admin can access everything, staff cannot access admin-only routes
    if (requiredRole && requiredRole === 'admin' && userProfile.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
