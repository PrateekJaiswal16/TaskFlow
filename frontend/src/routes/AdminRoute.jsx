import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuthStore();
  const location = useLocation();

  // Show a loading spinner while the auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // 1. Check if the user is authenticated AND is an admin
  if (isAuthenticated && user?.role === 'admin') {
    return children; // If yes, render the page they are trying to access
  }
  
  // 2. If they are not authenticated, redirect to the login page
  if (!isAuthenticated) {
     return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. If they are authenticated but NOT an admin, redirect to the dashboard
  // This prevents regular users from seeing a "forbidden" error
  return <Navigate to="/dashboard" replace />;
}