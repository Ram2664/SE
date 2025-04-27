import React, { useState } from 'react';
import { Menu, Search, MessageSquare, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProfileMenu from '@/components/shared/ProfileMenu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export function Header({ toggleMobileMenu }: HeaderProps) {
  const { user } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const { data: subjects } = useQuery({
    queryKey: ['/api/subjects'],
    enabled: user?.role === 'teacher',
  });
  
  const { data: branches } = useQuery({
    queryKey: ['/api/branches'],
    enabled: user?.role === 'teacher',
  });
  
  const { data: sections } = useQuery({
    queryKey: ['/api/sections'],
    enabled: user?.role === 'teacher',
  });
  
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* Mobile Logo - visible on mobile only */}
              <div className="md:hidden">
                <div className="flex items-center">
                  <div className="rounded-md bg-primary-100 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h1 className="ml-3 text-xl font-semibold text-gray-800">EduSync</h1>
                </div>
              </div>
            </div>
            
            {/* Filters for teacher role */}
            {user?.role === 'teacher' && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {/* Subject Filter Dropdown */}
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects?.map((subject: any) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Year Filter Dropdown */}
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Branch Filter Dropdown */}
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches?.map((branch: any) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Section Filter Dropdown */}
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sections?.map((section: any) => (
                      <SelectItem key={section.id} value={section.id.toString()}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {/* Search */}
            <div className="flex-shrink-0">
              <div className="relative mx-4 lg:mx-0">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="w-5 h-5 text-gray-400" />
                </span>
                <Input
                  className="w-full pl-10 pr-4 py-2 rounded-md text-sm text-gray-900 border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="Search..."
                  type="search"
                />
              </div>
            </div>
            
            {/* Messages dropdown */}
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <span className="sr-only">View messages</span>
              <MessageSquare className="h-6 w-6" />
            </Button>
            
            {/* Notification dropdown */}
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </Button>
            
            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={toggleProfileMenu}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`}
                    alt="Profile"
                  />
                </Button>
              </div>
              {isProfileMenuOpen && <ProfileMenu />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 z-40 p-4">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Open menu</span>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}

export default Header;
