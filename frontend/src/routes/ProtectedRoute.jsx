import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

// A lightweight function to check JWT expiration
const isJwtValid = (token) => {
  if (!token) return false;
  try {
    const [, payload] = token.split('.');
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === 'number' ? Date.now() < exp * 1000 : false;
  } catch {
    return false;
  }
};

export default function ProtectedRoute({ children }) {
  const { token, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Check if the user is authenticated and has a valid token
  const isAuth = isAuthenticated && isJwtValid(token);

  if (!isAuth) {
    // If not authenticated, just redirect to the login page.
    // Do NOT call logout() here, as this is what causes the infinite loop.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated, render the children components (the actual page)
  return children;
}