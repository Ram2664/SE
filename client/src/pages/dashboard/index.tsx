import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from './admin';
import TeacherDashboard from './teacher';
import StudentDashboard from './student';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to role-specific dashboard if accessing generic dashboard route
      setLocation(`/dashboard/${user.role}`);
    }
  }, [user, isLoading, setLocation]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Should be handled by router with redirect to login
  }
  
  // Render the appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <div>Unknown role</div>;
  }
}
