import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, User, LogOut } from 'lucide-react'; // Icons

export default function Sidebar() {
  const { user, logout, _hasHydrated} = useAuthStore();
  const navigate = useNavigate();
// if (!_hasHydrated) {
//     return null; // or <p>Loading...</p>
//   }
  console.log('User in sidebar (after hydration):', user);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation links
  const navLinks = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, text: 'Dashboard' },
    { to: '/profile', icon: <User className="w-4 h-4" />, text: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin/users', icon: <Users className="w-4 h-4" />, text: 'Manage Users' },
  ];

  console.log(user);

  const linkClass = "flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground transition-all hover:text-primary hover:bg-muted";
  const activeLinkClass = "flex items-center gap-3 px-3 py-2 rounded-lg text-primary bg-muted";

  return (
    <aside className="hidden w-64 p-4 border-r bg-background md:block">
        <p>Welcome, {user?.name}</p>
      <div className="flex flex-col h-full">
        <div className="flex items-center h-14 mb-4">
          <h2 className="text-2xl font-bold">Taskflow</h2>
        </div>
        <nav className="flex-1 space-y-2">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
              {link.icon}
              {link.text}
            </NavLink>
          ))}
          {/* Conditionally render admin links */}
          
          {user?.role === 'admin' && adminLinks.map(link => (
             <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
              {link.icon}
              {link.text}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}