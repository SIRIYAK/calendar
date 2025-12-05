import React from 'react';
import { CalendarEvent } from '../types';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export const MonthView: React.FC<MonthViewProps> = ({ currentDate, events }) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = getFirstDayOfMonth(currentDate);
  
  // Create grid cells
  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="bg-slate-50/50 min-h-[120px] border-b border-r border-slate-100"></div>);
  }

  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    const dayEvents = events.filter(e => 
      e.start.getDate() === i && 
      e.start.getMonth() === currentDate.getMonth() && 
      e.start.getFullYear() === currentDate.getFullYear()
    );

    days.push(
      <div key={`day-${i}`} className="bg-white min-h-[120px] border-b border-r border-slate-200 p-2 group hover:bg-slate-50 transition-colors">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
            new Date().toDateString() === dayDate.toDateString() 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-700 group-hover:bg-slate-200'
          }`}>
            {i}
          </span>
        </div>
        <div className="space-y-1">
          {dayEvents.map(event => (
            <div key={event.id} className="text-xs truncate px-1.5 py-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium">
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-slate-400 pl-1">+ {dayEvents.length - 3} more</div>
          )}
        </div>
      </div>
    );
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full bg-slate-200 border-l border-t border-slate-200 rounded-tl-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
        {weekDays.map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-slate-200 gap-px border-b border-r border-slate-200">
        {days}
      </div>
    </div>
  );
};
