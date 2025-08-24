import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

// Import UI components and icons
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Moon, Sun, Menu, User, LogOut } from 'lucide-react';

// A simple hook for theme toggling (you would put this in a separate file)
import { useState, useEffect } from 'react';

const useTheme = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    
    return [theme, toggleTheme];
};


export default function Navbar() {
  const nav = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [theme, toggleTheme] = useTheme();

  const onLogout = () => {
    logout();
    toast.success('You have been logged out.');
    nav('/login');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="text-lg font-semibold">Taskflow</Link>

        {/* Desktop Navigation */}
        <nav className="items-center hidden gap-4 text-sm md:flex">
          <Link to="/dashboard" className="transition-colors text-foreground/60 hover:text-foreground/80">Dashboard</Link>
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin/users" className="transition-colors text-foreground/60 hover:text-foreground/80">Manage Users</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme Toggler */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Separator orientation="vertical" className="h-6" />

          {/* User Menu / Login Button */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => nav('/profile')}>
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onLogout} className="text-red-500">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Login</Link>
            </Button>
          )}

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
             <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon"><Menu /></Button>
                </SheetTrigger>
                <SheetContent>
                     <nav className="grid gap-6 text-lg font-medium mt-8">
                        <Link to="/dashboard">Dashboard</Link>
                        {isAuthenticated && user?.role === 'admin' && <Link to="/admin/users">Manage Users</Link>}
                     </nav>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}