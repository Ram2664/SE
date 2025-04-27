import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AssignmentOverview from '@/components/shared/AssignmentOverview';
import AttendanceChart from '@/components/shared/AttendanceChart';
import StudentPerformance from '@/components/shared/StudentPerformance';
import Timetable from '@/components/shared/Timetable';
import Planner from '@/components/shared/Planner';
import TaskList from '@/components/shared/TaskList';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const today = new Date();
  const formattedDate = format(today, 'MMMM d, yyyy - EEEE');

  return (
    <DashboardLayout
      title={`Teacher Dashboard${user ? ` - ${user.firstName} ${user.lastName}` : ''}`}
      subtitle={formattedDate}
    >
      {/* Assignment statistics */}
      <AssignmentOverview />
      
      {/* Two columns with attendance and student performance */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AttendanceChart />
        <StudentPerformance />
      </div>
      
      {/* Timetable and Tasks/Planner */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Timetable */}
        <div className="lg:col-span-4">
          <Timetable />
        </div>
        
        {/* Planner and Tasks */}
        <div className="lg:col-span-3">
          <Planner />
          <TaskList />
        </div>
      </div>
    </DashboardLayout>
  );
}
