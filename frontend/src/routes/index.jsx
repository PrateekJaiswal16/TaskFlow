import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import TaskDetailPage from '../pages/TaskDetailPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/ProfilePage';


// Import the necessary components
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import MainLayout from '../components/layout/MainLayout'; // 1. Import the layout

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // --- Public Routes (No Sidebar) ---
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },

      // --- Protected Routes (With Sidebar) ---
      // 2. Create a parent route that uses the layout for all nested routes
      {
        element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'tasks/:id', element: <TaskDetailPage /> },
          { path: 'profile', element: <ProfilePage /> },
          // 3. Place the admin-only route here, wrapped in its own security
          { 
            path: 'admin/users', 
            element: (
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            ) 
          },
          // You can add other user-specific pages like a profile page here
        ]
      },
      
      // --- Catch-all for Not Found ---
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);