import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown } from 'lucide-react';
import { Timetable as TimetableType } from '@/types';

export function Timetable() {
  const { data, isLoading } = useQuery<TimetableType[]>({
    queryKey: ['/api/timetable', { day: 'monday' }],
    // If API not implemented, provide default values
    initialData: [
      {
        id: 1,
        subjectAssignmentId: 1,
        day: 'monday',
        startTime: '08:00:00',
        endTime: '09:30:00',
        room: 'Class Room',
        subjectAssignment: {
          id: 1,
          teacherId: 1,
          subjectId: 1,
          classId: 1,
          subject: {
            id: 1,
            name: 'Numeracy',
            code: 'MATH101',
            description: 'Basic Mathematics'
          }
        }
      },
      {
        id: 2,
        subjectAssignmentId: 2,
        day: 'monday',
        startTime: '10:00:00',
        endTime: '11:30:00',
        room: 'Class Room',
        subjectAssignment: {
          id: 2,
          teacherId: 1,
          subjectId: 2,
          classId: 1,
          subject: {
            id: 2,
            name: 'Poetry',
            code: 'ENG101',
            description: 'Poetry and Literature'
          }
        }
      },
      {
        id: 3,
        subjectAssignmentId: 3,
        day: 'monday',
        startTime: '11:00:00',
        endTime: '12:30:00',
        room: 'ICT Room',
        subjectAssignment: {
          id: 3,
          teacherId: 1,
          subjectId: 3,
          classId: 1,
          subject: {
            id: 3,
            name: 'Computer',
            code: 'CS101',
            description: 'Computer Science'
          }
        }
      },
      {
        id: 4,
        subjectAssignmentId: 4,
        day: 'monday',
        startTime: '12:30:00',
        endTime: '14:00:00',
        room: 'Music Room',
        subjectAssignment: {
          id: 4,
          teacherId: 1,
          subjectId: 4,
          classId: 1,
          subject: {
            id: 4,
            name: 'Music',
            code: 'MUS101',
            description: 'Music Theory and Practice'
          }
        }
      },
      {
        id: 5,
        subjectAssignmentId: 5,
        day: 'monday',
        startTime: '13:30:00',
        endTime: '15:00:00',
        room: 'French Class',
        subjectAssignment: {
          id: 5,
          teacherId: 1,
          subjectId: 5,
          classId: 1,
          subject: {
            id: 5,
            name: 'French',
            code: 'FRE101',
            description: 'French Language'
          }
        }
      }
    ]
  });

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Today's Timetable</h2>
        <button className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500">
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {data.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {entry.subjectAssignment?.subject?.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formattedDate}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(`2000-01-01T${entry.startTime}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.room}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default Timetable;
