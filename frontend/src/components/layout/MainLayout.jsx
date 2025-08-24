import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import Sidebar from '@/components/layout/Sidebar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 overflow-auto md:p-8">
        <Outlet /> {/* This is where your page components will be rendered */}
      </main>
    </div>
  );
}