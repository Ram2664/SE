import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { User, Settings, LogOut, HelpCircle } from 'lucide-react';

export function ProfileMenu() {
  const { user, logout } = useAuth();

  return (
    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900 truncate">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
      </div>
      
      <div className="border-t border-gray-100"></div>
      
      <Link href="/settings/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <User className="mr-3 h-4 w-4 text-gray-500" />
        Profile
      </Link>
      
      <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <Settings className="mr-3 h-4 w-4 text-gray-500" />
        Settings
      </Link>
      
      <Link href="/help" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <HelpCircle className="mr-3 h-4 w-4 text-gray-500" />
        Help
      </Link>
      
      <div className="border-t border-gray-100"></div>
      
      <button
        onClick={() => logout()}
        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <LogOut className="mr-3 h-4 w-4 text-gray-500" />
        Sign out
      </button>
    </div>
  );
}

export default ProfileMenu;
