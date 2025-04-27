import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { AssignmentStats } from '@/types';
import { FileText, CheckCircle2, XCircle, CheckSquare, AlertCircle } from 'lucide-react';

export function AssignmentOverview() {
  const { data, isLoading } = useQuery<AssignmentStats>({
    queryKey: ['/api/assignments/stats'],
    // If API not implemented, provide default values
    initialData: {
      totalStudents: 150,
      assigned: 130,
      submitted: 100,
      notSubmitted: 100,
      marked: 82,
      notMarked: 18
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Students',
      value: data.totalStudents,
      icon: <FileText className="h-6 w-6 text-primary-600" />,
      percentage: '100%',
      color: 'bg-primary-600'
    },
    {
      title: 'Assigned',
      value: data.assigned,
      icon: <FileText className="h-6 w-6 text-amber-500" />,
      percentage: `${Math.round((data.assigned / data.totalStudents) * 100)}%`,
      color: 'bg-amber-500'
    },
    {
      title: 'Submitted',
      value: data.submitted,
      icon: <CheckCircle2 className="h-6 w-6 text-amber-500" />,
      percentage: `${Math.round((data.submitted / data.totalStudents) * 100)}%`,
      color: 'bg-amber-500'
    },
    {
      title: 'Not Submitted',
      value: data.notSubmitted,
      icon: <XCircle className="h-6 w-6 text-secondary-500" />,
      percentage: `${Math.round((data.notSubmitted / data.totalStudents) * 100)}%`,
      color: 'bg-secondary-500'
    },
    {
      title: 'Marked',
      value: data.marked,
      icon: <CheckSquare className="h-6 w-6 text-success" />,
      percentage: `${Math.round((data.marked / data.submitted) * 100)}%`,
      color: 'bg-success'
    },
    {
      title: 'Not Marked',
      value: data.notMarked,
      icon: <AlertCircle className="h-6 w-6 text-error" />,
      percentage: `${Math.round((data.notMarked / data.submitted) * 100)}%`,
      color: 'bg-error'
    }
  ];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-gray-900">Assignment Overview</h2>
      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${stat.color} h-2.5 rounded-full`} style={{ width: stat.percentage }}></div>
              </div>
              <div className="text-right text-xs font-medium text-gray-500 mt-1">{stat.percentage}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AssignmentOverview;
