import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BookOpen, Clock, FileCheck, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Timetable from '@/components/shared/Timetable';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function StudentDashboard() {
  const { user } = useAuth();
  const today = new Date();
  const formattedDate = format(today, 'MMMM d, yyyy - EEEE');

  // Attendance query
  const { data: attendanceData } = useQuery({
    queryKey: ['/api/student/attendance', { studentId: user?.student?.id }],
    enabled: !!user?.student?.id,
    initialData: {
      overall: 85,
      subjects: [
        { name: 'Mathematics', present: 12, absent: 2, percentage: 86 },
        { name: 'Physics', present: 14, absent: 0, percentage: 100 },
        { name: 'Computer Science', present: 10, absent: 3, percentage: 77 },
        { name: 'English', present: 12, absent: 1, percentage: 92 }
      ]
    }
  });

  // Assignments query
  const { data: assignmentsData } = useQuery({
    queryKey: ['/api/student/assignments', { studentId: user?.student?.id }],
    enabled: !!user?.student?.id,
    initialData: {
      total: 12,
      completed: 8,
      pending: 4,
      recent: [
        { id: 1, title: 'Mathematics Problem Set', due: '2023-08-15', subject: 'Mathematics', status: 'submitted' },
        { id: 2, title: 'Physics Lab Report', due: '2023-08-10', subject: 'Physics', status: 'submitted' },
        { id: 3, title: 'Programming Assignment', due: '2023-08-20', subject: 'Computer Science', status: 'pending' },
        { id: 4, title: 'Essay on Literature', due: '2023-08-25', subject: 'English', status: 'pending' }
      ]
    }
  });

  // Performance query
  const { data: performanceData } = useQuery({
    queryKey: ['/api/student/performance', { studentId: user?.student?.id }],
    enabled: !!user?.student?.id,
    initialData: {
      overall: 78,
      subjects: [
        { name: 'Mathematics', score: 75 },
        { name: 'Physics', score: 88 },
        { name: 'Computer Science', score: 92 },
        { name: 'English', score: 82 }
      ],
      trend: [
        { month: 'Jan', performance: 65 },
        { month: 'Feb', performance: 68 },
        { month: 'Mar', performance: 72 },
        { month: 'Apr', performance: 70 },
        { month: 'May', performance: 75 },
        { month: 'Jun', performance: 80 },
        { month: 'Jul', performance: 78 }
      ]
    }
  });

  // Colors for charts
  const COLORS = ['#4338ca', '#f43f5e', '#22c55e', '#eab308'];

  return (
    <DashboardLayout
      title={`Student Dashboard${user ? ` - ${user.firstName} ${user.lastName}` : ''}`}
      subtitle={formattedDate}
    >
      {/* Stats overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Attendance</p>
              <h2 className="text-3xl font-bold">{attendanceData.overall}%</h2>
              <p className="text-xs text-muted-foreground mt-1">Overall attendance rate</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assignments</p>
              <h2 className="text-3xl font-bold">{assignmentsData.completed}/{assignmentsData.total}</h2>
              <p className="text-xs text-muted-foreground mt-1">Completed assignments</p>
            </div>
            <div className="p-2 bg-secondary/10 rounded-full">
              <FileCheck className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Performance</p>
              <h2 className="text-3xl font-bold">{performanceData.overall}%</h2>
              <p className="text-xs text-muted-foreground mt-1">Overall grade average</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart and Subject Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Performance Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[40, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="performance" 
                  name="Performance %" 
                  stroke="#4338ca" 
                  activeDot={{ r: 8 }}
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Subject Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.subjects.map((subject, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{subject.name}</span>
                    <span className="text-sm font-medium">{subject.score}%</span>
                  </div>
                  <Progress value={subject.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timetable and Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div>
          <Timetable />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Assignments</CardTitle>
            <Badge variant="outline" className="ml-auto">
              {assignmentsData.pending} pending
            </Badge>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {assignmentsData.recent.map((assignment) => (
                <li key={assignment.id} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{assignment.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">Subject: {assignment.subject}</p>
                      <p className="text-xs text-gray-500">Due: {format(new Date(assignment.due), 'MMM d, yyyy')}</p>
                    </div>
                    <Badge 
                      className={
                        assignment.status === 'submitted' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }
                    >
                      {assignment.status === 'submitted' ? 'Submitted' : 'Pending'}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Details */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Attendance by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {attendanceData.subjects.map((subject, index) => (
              <Card key={index} className="bg-gray-50 border-0">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">{subject.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Present: {subject.present}</span>
                    <span className="text-xs text-gray-500">Absent: {subject.absent}</span>
                  </div>
                  <Progress 
                    value={subject.percentage} 
                    className="h-2" 
                    indicatorClassName={
                      subject.percentage >= 90 
                        ? 'bg-green-600' 
                        : subject.percentage >= 75 
                          ? 'bg-amber-500' 
                          : 'bg-red-500'
                    }
                  />
                  <p className="text-right text-xs font-medium mt-1">{subject.percentage}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
