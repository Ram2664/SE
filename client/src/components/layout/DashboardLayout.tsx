import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar className={isMobileMenuOpen ? "" : "hidden md:flex"} />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        {/* Header with filters, search, notifications */}
        <Header toggleMobileMenu={toggleMobileMenu} />
        
        {/* Content area */}
        <main className="flex-1 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {title || `${user?.role?.charAt(0).toUpperCase()}${user?.role?.slice(1)} Dashboard`}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle || formattedDate}</p>
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
