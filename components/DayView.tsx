import React from 'react';
import { CalendarEvent } from '../types';
import { HOURS } from '../constants';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDrop: (e: React.DragEvent, hour: number) => void;
}

export const DayView: React.FC<DayViewProps> = ({ currentDate, events, onDrop }) => {
  // Filter events for this specific day
  const todaysEvents = events.filter(e => 
    e.start.toDateString() === currentDate.toDateString()
  );

  return (
    <div className="flex-1 overflow-y-auto bg-white relative h-full">
      <div className="flex border-b border-slate-200 sticky top-0 bg-white z-10">
        <div className="w-16 shrink-0 border-r border-slate-200 bg-slate-50"></div>
        <div className="flex-1 p-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          <p className="text-sm text-slate-500">
            {todaysEvents.length} events scheduled
          </p>
        </div>
      </div>

      <div className="relative min-h-[800px]">
        {/* Time Grid */}
        {HOURS.map((hour) => (
          <div 
            key={hour} 
            className="flex h-20 border-b border-slate-100 group"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('bg-indigo-50');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('bg-indigo-50');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('bg-indigo-50');
              onDrop(e, hour);
            }}
          >
            <div className="w-16 shrink-0 flex justify-center text-xs font-medium text-slate-400 -mt-2.5 bg-white h-5 z-10">
              {hour}:00
            </div>
            <div className="flex-1 border-l border-slate-100 group-hover:bg-slate-50/50 transition-colors relative">
               {/* Half-hour line guide (visual only) */}
               <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-slate-100/50 pointer-events-none"></div>
            </div>
          </div>
        ))}

        {/* Events Overlay */}
        {todaysEvents.map((event) => {
          const startHour = event.start.getHours();
          const startMin = event.start.getMinutes();
          const endHour = event.end.getHours();
          const endMin = event.end.getMinutes();
          
          const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
          const startOffsetMinutes = (startHour - HOURS[0]) * 60 + startMin;
          
          // 80px per hour (h-20) -> 80px / 60min = 1.333 px/min
          const top = startOffsetMinutes * (80 / 60);
          const height = Math.max(durationMinutes * (80 / 60), 40); // Min height 40px

          // Don't render if before start of day view
          if (startHour < HOURS[0]) return null;

          return (
            <div
              key={event.id}
              className="absolute left-16 right-4 rounded-md bg-indigo-100 border-l-4 border-indigo-500 p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer z-20 overflow-hidden"
              style={{ top: `${top}px`, height: `${height}px` }}
            >
              <div className="font-semibold text-indigo-900 text-sm leading-tight">
                {event.title}
              </div>
              <div className="text-xs text-indigo-700 mt-1">
                {event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                {event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              {height > 50 && (
                 <div className="text-xs text-indigo-600 mt-1 truncate opacity-75">
                    {event.description}
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
