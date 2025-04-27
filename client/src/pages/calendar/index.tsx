import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO, isSameDay } from 'date-fns';
import { CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, BookOpen, Layers, Users, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: 'class' | 'assignment' | 'exam' | 'meeting' | 'other';
  location?: string;
  description?: string;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Get events for the calendar
  const { data: events = [] } = useQuery<CalendarEvent[]>({
    queryKey: ['/api/calendar/events', { month: date.getMonth() + 1, year: date.getFullYear() }],
    initialData: [
      {
        id: '1',
        title: 'Mathematics Class',
        date: '2023-08-07',
        startTime: '08:00',
        endTime: '09:30',
        type: 'class',
        location: 'Room 101'
      },
      {
        id: '2',
        title: 'Physics Class',
        date: '2023-08-07',
        startTime: '10:00',
        endTime: '11:30',
        type: 'class',
        location: 'Room 102'
      },
      {
        id: '3',
        title: 'Computer Science Lab',
        date: '2023-08-07',
        startTime: '11:00',
        endTime: '12:30',
        type: 'class',
        location: 'Lab 2'
      },
      {
        id: '4',
        title: 'Mathematics Assignment Due',
        date: '2023-08-15',
        type: 'assignment'
      },
      {
        id: '5',
        title: 'Physics Exam',
        date: '2023-08-20',
        startTime: '10:00',
        endTime: '12:00',
        type: 'exam',
        location: 'Main Hall'
      }
    ]
  });
  
  // Get events for the selected day
  const selectedDayEvents = events.filter(
    (event) => isSameDay(parseISO(event.date), selectedDate)
  ).sort((a, b) => {
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    return a.startTime.localeCompare(b.startTime);
  });
  
  const previousMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };
  
  const getDayEvents = (day: Date) => {
    return events.filter((event) => isSameDay(parseISO(event.date), day));
  };
  
  // Get event badge based on type
  const getEventBadge = (type: string) => {
    switch (type) {
      case 'class':
        return <Badge className="bg-blue-100 text-blue-800">Class</Badge>;
      case 'assignment':
        return <Badge className="bg-amber-100 text-amber-800">Assignment</Badge>;
      case 'exam':
        return <Badge className="bg-red-100 text-red-800">Exam</Badge>;
      case 'meeting':
        return <Badge className="bg-purple-100 text-purple-800">Meeting</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Other</Badge>;
    }
  };
  
  // Get event icon based on type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'class':
        return <BookOpen className="h-4 w-4" />;
      case 'assignment':
        return <FileText className="h-4 w-4" />;
      case 'exam':
        return <Layers className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };
  
  return (
    <DashboardLayout title="Calendar" subtitle="Manage your schedule">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Panel - Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl">
                {format(date, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Select defaultValue="month" onValueChange={(value) => setView(value as any)}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(day) => day && setSelectedDate(day)}
                month={date}
                className="rounded-md border"
                components={{
                  DayContent: ({ day }) => {
                    const dayEvents = getDayEvents(day);
                    return (
                      <div className="relative h-full w-full p-2">
                        <span>{format(day, 'd')}</span>
                        {dayEvents.length > 0 && (
                          <div className="absolute bottom-1 right-1">
                            <div className="flex -space-x-1">
                              {dayEvents.length <= 3 ? (
                                dayEvents.map((event, i) => (
                                  <div
                                    key={i}
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                      backgroundColor: 
                                        event.type === 'class' ? '#3b82f6' : 
                                        event.type === 'assignment' ? '#f59e0b' :
                                        event.type === 'exam' ? '#ef4444' : 
                                        event.type === 'meeting' ? '#8b5cf6' : '#6b7280'
                                    }}
                                  />
                                ))
                              ) : (
                                <>
                                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                                  <div className="h-2 w-2 rounded-full bg-gray-500">
                                    <span className="sr-only">{dayEvents.length} events</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Right Panel - Selected Day Events */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
              <CardDescription>
                {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium">No events scheduled</h3>
                  <p className="mt-1 text-sm">Add a new event to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayEvents.map((event) => (
                    <div key={event.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-md">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{event.title}</h3>
                            {getEventBadge(event.type)}
                          </div>
                          {(event.startTime || event.location) && (
                            <div className="mt-2 space-y-1 text-sm text-gray-500">
                              {event.startTime && (
                                <div className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  <span>
                                    {format(parseISO(`2000-01-01T${event.startTime}`), 'h:mm a')}
                                    {event.endTime && ` - ${format(parseISO(`2000-01-01T${event.endTime}`), 'h:mm a')}`}
                                  </span>
                                </div>
                              )}
                              {event.location && (
                                <div>
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Event for {format(selectedDate, 'MMM d')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Upcoming Events Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events
                  .filter(event => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 6)
                  .map(event => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-gray-500">
                              {format(parseISO(event.date), 'EEE, MMM d')}
                              {event.startTime && ` • ${format(parseISO(`2000-01-01T${event.startTime}`), 'h:mm a')}`}
                            </p>
                          </div>
                          {getEventBadge(event.type)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            
            {/* Similar content for other tabs, filtered by type */}
            <TabsContent value="classes" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events
                  .filter(event => event.type === 'class' && new Date(event.date) >= new Date())
                  .slice(0, 6)
                  .map(event => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-gray-500">
                              {format(parseISO(event.date), 'EEE, MMM d')}
                              {event.startTime && ` • ${format(parseISO(`2000-01-01T${event.startTime}`), 'h:mm a')}`}
                            </p>
                          </div>
                          {getEventBadge(event.type)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            
            {/* Other tab contents would be similar */}
            <TabsContent value="assignments" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <h3 className="mt-2 text-sm font-medium">No upcoming assignments</h3>
              </div>
            </TabsContent>
            <TabsContent value="exams" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <h3 className="mt-2 text-sm font-medium">No upcoming exams</h3>
              </div>
            </TabsContent>
            <TabsContent value="meetings" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <h3 className="mt-2 text-sm font-medium">No upcoming meetings</h3>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
