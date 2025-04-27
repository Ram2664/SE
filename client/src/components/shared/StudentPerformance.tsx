import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StudentPerformanceItem } from '@/types';

export function StudentPerformance() {
  const { data, isLoading } = useQuery<StudentPerformanceItem[]>({
    queryKey: ['/api/student-performance'],
    // If API not implemented, provide default values
    initialData: [
      {
        student: {
          id: 1,
          userId: 2,
          studentId: 'ST20230001',
          yearLevel: 1,
          branchId: 1,
          sectionId: 1,
          user: {
            firstName: 'Maureen',
            lastName: 'Smith',
            profileImage: 'https://ui-avatars.com/api/?name=Maureen+Smith&background=4F46E5&color=fff'
          }
        },
        percentage: 100
      },
      {
        student: {
          id: 2,
          userId: 3,
          studentId: 'ST20230012',
          yearLevel: 1,
          branchId: 1,
          sectionId: 1,
          user: {
            firstName: 'James',
            lastName: 'Wilson',
            profileImage: 'https://ui-avatars.com/api/?name=James+Wilson&background=22C55E&color=fff'
          }
        },
        percentage: 70
      },
      {
        student: {
          id: 3,
          userId: 4,
          studentId: 'ST20230024',
          yearLevel: 1,
          branchId: 1,
          sectionId: 1,
          user: {
            firstName: 'Brandy',
            lastName: 'Johnson',
            profileImage: 'https://ui-avatars.com/api/?name=Brandy+Johnson&background=EAB308&color=fff'
          }
        },
        percentage: 48
      },
      {
        student: {
          id: 4,
          userId: 5,
          studentId: 'ST20230031',
          yearLevel: 1,
          branchId: 1,
          sectionId: 1,
          user: {
            firstName: 'Khloe',
            lastName: 'Davis',
            profileImage: 'https://ui-avatars.com/api/?name=Khloe+Davis&background=EF4444&color=fff'
          }
        },
        percentage: 21
      }
    ]
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  function getBadgeColor(percentage: number) {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  return (
    <Card className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Students Performance</h2>
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">View All</a>
      </div>
      
      <div className="mt-6 flow-root">
        <ul role="list" className="-my-5 divide-y divide-gray-200">
          {data.map((item) => (
            <li key={item.student.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src={item.student.user.profileImage} alt={`${item.student.user.firstName} ${item.student.user.lastName}`} />
                    <AvatarFallback>{`${item.student.user.firstName.charAt(0)}${item.student.user.lastName.charAt(0)}`}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.student.user.firstName} {item.student.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">Student ID: {item.student.studentId}</p>
                </div>
                <div>
                  <Badge className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getBadgeColor(item.percentage)}`}>
                    {item.percentage}%
                  </Badge>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export default StudentPerformance;
