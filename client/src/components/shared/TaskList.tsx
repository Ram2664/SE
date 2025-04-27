import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FileText, CalendarClock, ClipboardList, MessageSquare, MoreVertical } from 'lucide-react';
import { Task } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

export function TaskList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddingTask, setIsAddingTask] = useState(false);

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks', { userId: user?.id }],
    enabled: !!user,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number, completed: boolean }) => {
      return apiRequest('PATCH', `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTaskIcon = (title: string) => {
    if (title.toLowerCase().includes('assessment') || title.toLowerCase().includes('question')) {
      return <FileText className="h-5 w-5 text-secondary-500" />;
    } else if (title.toLowerCase().includes('meeting') || title.toLowerCase().includes('mentee')) {
      return <CalendarClock className="h-5 w-5 text-amber-500" />;
    } else if (title.toLowerCase().includes('report') || title.toLowerCase().includes('submit')) {
      return <ClipboardList className="h-5 w-5 text-primary-500" />;
    } else {
      return <MessageSquare className="h-5 w-5 text-info" />;
    }
  };

  return (
    <Card className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          My Tasks <span className="ml-1 text-sm bg-primary-100 text-primary-800 py-0.5 px-2 rounded-full">{tasks?.length || 0}</span>
        </h2>
        <Button 
          size="sm" 
          className="bg-primary-600 text-white text-sm px-3 py-1 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={() => setIsAddingTask(true)}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Task
        </Button>
      </div>
      
      <div className="space-y-4">
        {tasks?.map((task) => (
          <div key={task.id} className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getTaskIcon(task.title)}
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {task.dueTime ? format(new Date(`2000-01-01T${task.dueTime}`), 'h:mm a') : ''}
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2 text-gray-400 hover:text-gray-500"
                      onClick={() => updateTaskMutation.mutate({ id: task.id, completed: !task.completed })}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as {task.completed ? 'incomplete' : 'complete'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default TaskList;
