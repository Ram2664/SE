import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, Users, FileText, Layers, Calendar, 
  BarChart2, BookOpen, MessageSquare, Settings, LogOut,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location === path || location.startsWith(`${path}/`);
  };
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/assignments', label: 'Assignments', icon: FileText },
    { href: '/students', label: 'Students', icon: Users },
    { href: '/classes', label: 'Classes', icon: Layers },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/reports', label: 'Reports', icon: BarChart2 },
    { href: '/resources', label: 'Resources', icon: BookOpen },
    { href: '/ai-tutor', label: 'AI Tutor', icon: BrainCircuit },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];
  
  // Filter out navItems based on user role if needed
  const filteredNavItems = navItems.filter(item => {
    if (user?.role === 'student' && (item.href === '/students' || item.href === '/classes')) {
      return false;
    }
    return true;
  });

  return (
    <aside className={cn("hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-10 bg-white border-r border-gray-200", className)}>
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto scrollbar-hide">
        <div className="px-4 mb-6">
          <div className="flex items-center">
            <div className="rounded-md bg-primary-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="ml-3 text-xl font-semibold text-gray-800">EduSync</h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                isActive(item.href)
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5",
                  isActive(item.href) ? "text-primary-600" : "text-gray-500"
                )}
              />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="px-3 mt-6 mb-6">
          <button 
            onClick={() => logout()}
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 w-full"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-500" />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
