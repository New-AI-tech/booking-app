import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserProfile, UserRole } from '../../types';
import { Loader2 } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 text-stone-900 animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userProfile.role !== requiredRole && userProfile.role !== 'admin') {
    // If user is staff but needs admin, or other mismatch (admin bypasses all)
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
