import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRole?: 'client' | 'pro' | 'admin';
}

export default function ProtectedRoute({ children, requireAdmin = false, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // If they are authenticated but not an admin, redirect to home
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user?.role !== allowedRole && !isAdmin) {
    // If they have the wrong role, redirect to their correct dashboard
    const targetDashboard = user?.role === 'pro' ? '/dashboard/pro' : '/dashboard/client';
    return <Navigate to={targetDashboard} replace />;
  }

  return <>{children}</>;
}
