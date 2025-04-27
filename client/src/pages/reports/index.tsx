import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Download, FileDown, Users, BookOpen, GraduationCap, Calendar, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ReportsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  
  // Get classes for filter
  const { data: classes } = useQuery({
    queryKey: ['/api/classes'],
  });
  
  // Get subjects for filter
  const { data: subjects } = useQuery({
    queryKey: ['/api/subjects'],
  });
  
  // Get attendance data
  const { data: attendanceData } = useQuery({
    queryKey: ['/api/reports/attendance', { timeRange, class: classFilter, subject: subjectFilter }],
    initialData: [
      { day: 'Monday', present: 85, absent: 15, total: 100 },
      { day: 'Tuesday', present: 90, absent: 10, total: 100 },
      { day: 'Wednesday', present: 80, absent: 20, total: 100 },
      { day: 'Thursday', present: 95, absent: 5, total: 100 },
      { day: 'Friday', present: 88, absent: 12, total: 100 }
    ]
  });
  
  // Get performance data
  const { data: performanceData } = useQuery({
    queryKey: ['/api/reports/performance', { timeRange, class: classFilter, subject: subjectFilter }],
    initialData: [
      { name: 'Mathematics', average: 78, highest: 95, lowest: 45 },
      { name: 'Physics', average: 72, highest: 90, lowest: 50 },
      { name: 'Chemistry', average: 68, highest: 88, lowest: 40 },
      { name: 'Biology', average: 75, highest: 92, lowest: 55 },
      { name: 'Computer Science', average: 82, highest: 98, lowest: 60 }
    ]
  });
  
  // Student distribution data (for admin)
  const { data: studentDistribution } = useQuery({
    queryKey: ['/api/reports/student-distribution'],
    initialData: [
      { name: 'Year 1', value: 120 },
      { name: 'Year 2', value: 100 },
      { name: 'Year 3', value: 80 },
      { name: 'Year 4', value: 60 }
    ]
  });
  
  // Grade distribution data (for teacher/admin)
  const { data: gradeDistribution } = useQuery({
    queryKey: ['/api/reports/grade-distribution', { subject: subjectFilter, class: classFilter }],
    initialData: [
      { name: 'A', value: 25 },
      { name: 'B', value: 35 },
      { name: 'C', value: 20 },
      { name: 'D', value: 15 },
      { name: 'F', value: 5 }
    ]
  });
  
  // Monthly trend data
  const { data: monthlyTrend } = useQuery({
    queryKey: ['/api/reports/monthly-trend', { subject: subjectFilter }],
    initialData: [
      { month: 'Jan', attendance: 92, performance: 78 },
      { month: 'Feb', attendance: 88, performance: 75 },
      { month: 'Mar', attendance: 90, performance: 80 },
      { month: 'Apr', attendance: 85, performance: 76 },
      { month: 'May', attendance: 92, performance: 82 },
      { month: 'Jun', attendance: 95, performance: 84 }
    ]
  });
  
  // Colors for charts
  const COLORS = ['#4338ca', '#f43f5e', '#22c55e', '#eab308', '#3b82f6'];
  
  return (
    <DashboardLayout title="Reports & Analytics">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          {(isAdmin || isTeacher) && (
            <>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes?.map((cls: any) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
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
            </>
          )}
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-primary/10 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
              <div className="flex items-center gap-1">
                <h2 className="text-2xl font-bold">87%</h2>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-secondary/10 rounded-full mr-4">
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
              <div className="flex items-center gap-1">
                <h2 className="text-2xl font-bold">76%</h2>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-full mr-4">
              <GraduationCap className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
              <div className="flex items-center gap-1">
                <h2 className="text-2xl font-bold">92%</h2>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-green-500/10 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Student Engagement</p>
              <div className="flex items-center gap-1">
                <h2 className="text-2xl font-bold">84%</h2>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="attendance" className="w-full mt-6">
        <TabsList className="grid grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Daily attendance statistics</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" name="Present" fill="#4338ca" />
                    <Bar dataKey="absent" name="Absent" fill="#f43f5e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Student Distribution</CardTitle>
                  <CardDescription>By year level</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={studentDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {studentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
            
            {(isTeacher || isAdmin) && (
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>By grade category</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>{isStudent ? 'Subject' : 'Class'}</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Aug 1, 2023</TableCell>
                    <TableCell>{isStudent ? 'Mathematics' : 'CSE Year 1 - A'}</TableCell>
                    <TableCell>42</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>93%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Aug 2, 2023</TableCell>
                    <TableCell>{isStudent ? 'Physics' : 'CSE Year 1 - A'}</TableCell>
                    <TableCell>40</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>89%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Aug 3, 2023</TableCell>
                    <TableCell>{isStudent ? 'Computer Science' : 'CSE Year 1 - A'}</TableCell>
                    <TableCell>44</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>98%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Average, highest and lowest scores</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" name="Average" fill="#4338ca" />
                    <Bar dataKey="highest" name="Highest" fill="#22c55e" />
                    <Bar dataKey="lowest" name="Lowest" fill="#f43f5e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Monthly comparison</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      name="Attendance %"
                      stroke="#4338ca"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="performance"
                      name="Performance %"
                      stroke="#f43f5e"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Assignment/Test</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Class Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Mathematics</TableCell>
                    <TableCell>Mid-term Exam</TableCell>
                    <TableCell>Jul 15, 2023</TableCell>
                    <TableCell>85/100</TableCell>
                    <TableCell>76/100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Physics</TableCell>
                    <TableCell>Lab Assignment</TableCell>
                    <TableCell>Jul 22, 2023</TableCell>
                    <TableCell>92/100</TableCell>
                    <TableCell>80/100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Computer Science</TableCell>
                    <TableCell>Programming Project</TableCell>
                    <TableCell>Jul 30, 2023</TableCell>
                    <TableCell>88/100</TableCell>
                    <TableCell>82/100</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance vs Performance</CardTitle>
                <CardDescription>Correlation analysis</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      name="Attendance %"
                      stroke="#4338ca"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="performance"
                      name="Performance %"
                      stroke="#f43f5e"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
                <CardDescription>AI-generated insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-lg">Key Observations:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Attendance has shown a positive correlation with academic performance.</li>
                    <li>Mathematics performance improved by 8% compared to the previous month.</li>
                    <li>Physics scores show consistent growth over the last quarter.</li>
                    <li>Students with attendance above 90% show 15% better performance on average.</li>
                  </ul>
                  <h3 className="font-medium text-lg mt-6">Recommendations:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Focus on improving attendance in Computer Science classes.</li>
                    <li>Consider additional support for students struggling with Chemistry.</li>
                    <li>Recognize and reward consistent high performers to maintain motivation.</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Generate Detailed Analysis
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Long-Term Progress Report</CardTitle>
              <CardDescription>Academic year overview</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This comprehensive report provides a semester-by-semester breakdown of academic 
                performance and attendance patterns, highlighting trends and areas for improvement.
              </p>
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Report Generation Options:</h3>
                <div className="flex flex-wrap gap-4">
                  <Select defaultValue="current">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">2022-2023</SelectItem>
                      <SelectItem value="previous">2021-2022</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Full Report</SelectItem>
                      <SelectItem value="attendance">Attendance Only</SelectItem>
                      <SelectItem value="performance">Performance Only</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button>
                    <FileDown className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
