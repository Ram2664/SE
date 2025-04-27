import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PlannerMonth, CalendarDay } from '@/types';

export function Planner() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  // Generate days for the current month
  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days: CalendarDay[] = [];
    
    // Previous month days
    for (let i = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; i > 0; i--) {
      days.push({
        date: new Date(year, month, 1 - i).getDate(),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isToday: (
          today.getDate() === i &&
          today.getMonth() === month &&
          today.getFullYear() === year
        ),
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const daysNeeded = 42 - days.length;
    for (let i = 1; i <= daysNeeded; i++) {
      days.push({
        date: i,
        isCurrentMonth: false
      });
    }
    
    return days;
  };
  
  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  return (
    <Card className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">My Planner</h2>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="p-1 text-gray-400 hover:text-gray-500">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium text-gray-900">{monthName}</span>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="p-1 text-gray-400 hover:text-gray-500">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="mt-2 grid grid-cols-7 gap-2 text-center text-xs leading-6 text-gray-500">
        <div>MON</div>
        <div>TUE</div>
        <div>WED</div>
        <div>THU</div>
        <div>FRI</div>
        <div>SAT</div>
        <div>SUN</div>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2 text-sm">
        {days.map((day, index) => (
          <div
            key={index}
            className={`py-1.5 text-center ${
              !day.isCurrentMonth
                ? 'text-gray-400'
                : day.isToday
                ? 'bg-primary-100 text-primary-600 font-semibold rounded-md'
                : 'text-gray-900'
            }`}
          >
            {day.date}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default Planner;
