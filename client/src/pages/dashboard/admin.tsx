import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { User, Users, BookOpen, School, GraduationCap, CalendarClock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import TaskList from '@/components/shared/TaskList';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { user } = useAuth();
  const today = new Date();
  const formattedDate = format(today, 'MMMM d, yyyy - EEEE');

  // User statistics query
  const { data: userStats } = useQuery({
    queryKey: ['/api/admin/stats/users'],
    // If API not implemented, provide initial data
    initialData: {
      total: 380,
      students: 320,
      teachers: 50,
      admins: 10,
      recentlyJoined: 25
    }
  });

  // Branch statistics query
  const { data: branchStats } = useQuery({
    queryKey: ['/api/admin/stats/branches'],
    // If API not implemented, provide initial data
    initialData: [
      { name: 'Computer Science', value: 120 },
      { name: 'Electronics', value: 80 },
      { name: 'Mechanical', value: 70 },
      { name: 'Civil', value: 50 }
    ]
  });

  // Performance data
  const { data: performanceData } = useQuery({
    queryKey: ['/api/admin/stats/performance'],
    // If API not implemented, provide initial data
    initialData: [
      { name: 'Computer Science', attendance: 92, performance: 85 },
      { name: 'Electronics', attendance: 85, performance: 76 },
      { name: 'Mechanical', attendance: 78, performance: 82 },
      { name: 'Civil', attendance: 88, performance: 71 }
    ]
  });

  // Announcements data
  const { data: announcements } = useQuery({
    queryKey: ['/api/announcements'],
    // If API not implemented, provide initial data
    initialData: [
      { id: 1, title: 'Semester Exam Schedule', createdAt: '2023-07-25T10:00:00Z', targetRole: 'all' },
      { id: 2, title: 'Faculty Meeting', createdAt: '2023-07-24T14:30:00Z', targetRole: 'teachers' },
      { id: 3, title: 'Campus Maintenance Notice', createdAt: '2023-07-23T09:15:00Z', targetRole: 'all' },
      { id: 4, title: 'Scholarship Applications Open', createdAt: '2023-07-22T11:20:00Z', targetRole: 'students' }
    ]
  });

  // Colors for pie chart
  const COLORS = ['#4338ca', '#f43f5e', '#22c55e', '#eab308'];

  return (
    <DashboardLayout
      title={`Admin Dashboard${user ? ` - ${user.firstName} ${user.lastName}` : ''}`}
      subtitle={formattedDate}
    >
      {/* Stats overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h2 className="text-3xl font-bold">{userStats.total}</h2>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Students</p>
              <h2 className="text-3xl font-bold">{userStats.students}</h2>
            </div>
            <div className="p-2 bg-secondary/10 rounded-full">
              <User className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teachers</p>
              <h2 className="text-3xl font-bold">{userStats.teachers}</h2>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <GraduationCap className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Users</p>
              <h2 className="text-3xl font-bold">{userStats.recentlyJoined}</h2>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-full">
              <User className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Branch Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <School className="mr-2 h-5 w-5" /> 
              Branch Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={branchStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {branchStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance and Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <BookOpen className="mr-2 h-5 w-5" /> 
              Branch Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" name="Attendance %" fill="#4338ca" />
                <Bar dataKey="performance" name="Performance %" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section with tasks and announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {announcements.map((announcement) => (
                <li key={announcement.id} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CalendarClock className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{announcement.title}</h3>
                      <div className="flex mt-1 text-xs text-gray-400 justify-between">
                        <span>{format(new Date(announcement.createdAt), 'MMM d, yyyy')}</span>
                        <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                          {announcement.targetRole === 'all' ? 'Everyone' : 
                           announcement.targetRole === 'teachers' ? 'Teachers' : 'Students'}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <TaskList />
      </div>
    </DashboardLayout>
  );
}
