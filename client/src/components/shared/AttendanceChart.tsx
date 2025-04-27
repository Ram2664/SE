import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AttendanceStats } from '@/types';

export function AttendanceChart() {
  const { data, isLoading } = useQuery<AttendanceStats>({
    queryKey: ['/api/attendance/stats'],
    // If API not implemented, provide default values
    initialData: {
      present: 120,
      absent: 30,
      late: 0,
      total: 150
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#22c55e', '#ef4444'];
  const RADIAN = Math.PI / 180;
  
  const chartData = [
    { name: 'Present', value: data.present },
    { name: 'Absent', value: data.absent }
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Attendance</h2>
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="w-48 h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-3xl font-semibold text-gray-900">{data.total}</div>
            <div className="text-sm text-gray-500">Students</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center space-x-12">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
          <span className="text-sm text-gray-600">Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-error mr-2"></div>
          <span className="text-sm text-gray-600">Absent</span>
        </div>
      </div>
    </Card>
  );
}

export default AttendanceChart;
