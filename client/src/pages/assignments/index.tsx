import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Plus, Download, Filter, Eye, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { Assignment } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Get subjects for filter
  const { data: subjects } = useQuery({
    queryKey: ['/api/subjects'],
  });
  
  // Get assignments, filtered if necessary
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['/api/assignments', { subject: subjectFilter, status: statusFilter, search: searchTerm }],
  });

  const filteredAssignments = assignments ?? [];
  
  // Different views based on role
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  function getStatusBadge(status: string, dueDate?: string) {
    if (!dueDate) return null;
    
    const now = new Date();
    const due = new Date(dueDate);
    const isOverdue = now > due;
    
    if (status === 'submitted') {
      return <Badge className="bg-green-100 text-green-800">Submitted</Badge>;
    } else if (status === 'marked') {
      return <Badge className="bg-blue-100 text-blue-800">Marked</Badge>;
    } else if (isOverdue) {
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    } else {
      return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
    }
  }
  
  return (
    <DashboardLayout title="Assignments">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search assignments..."
            type="search"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Subject" />
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
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="marked">Marked</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          {isTeacher && (
            <Button className="md:ml-2">
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="active" className="w-full mt-6">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          {isTeacher && <TabsTrigger value="draft">Drafts</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due Date</TableHead>
                    {isTeacher && <TableHead>Submissions</TableHead>}
                    {isStudent && <TableHead>Status</TableHead>}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={isTeacher ? 5 : 4} className="text-center py-8">
                        Loading assignments...
                      </TableCell>
                    </TableRow>
                  ) : filteredAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isTeacher ? 5 : 4} className="text-center py-8">
                        No assignments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssignments.map((assignment: any) => (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {assignment.description || 'No description'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{assignment.subject?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            <span>
                              {assignment.dueDate ? format(new Date(assignment.dueDate), 'MMM d, yyyy') : 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        {isTeacher && (
                          <TableCell>
                            <Badge variant="outline">
                              {assignment.submissionsCount || 0} / {assignment.totalStudents || 0}
                            </Badge>
                          </TableCell>
                        )}
                        {isStudent && (
                          <TableCell>
                            {getStatusBadge(assignment.status || 'pending', assignment.dueDate)}
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {isTeacher && (
                              <>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {isStudent && assignment.status !== 'submitted' && (
                              <Button size="sm">Submit</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              <div className="flex items-center justify-between py-4 px-6">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredAssignments.length}</span> of{" "}
                  <span className="font-medium">{filteredAssignments.length}</span> assignments
                </p>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center">
              Displaying completed assignments...
            </CardContent>
          </Card>
        </TabsContent>
        
        {isTeacher && (
          <TabsContent value="draft" className="mt-4">
            <Card>
              <CardContent className="p-6 text-center">
                Displaying draft assignments...
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </DashboardLayout>
  );
}
