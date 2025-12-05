import React, { useMemo } from 'react';
import { CalendarEvent } from '../types';
import { Clock, Briefcase } from 'lucide-react';

interface TimesheetViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export const TimesheetView: React.FC<TimesheetViewProps> = ({ currentDate, events }) => {
  const { weekDates, projectData, dailyTotals, grandTotal } = useMemo(() => {
    // 1. Determine Week Start (Monday)
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // 2. Generate 7 days
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });

    // 3. Process Events
    const projectMap = new Map<string, number[]>();
    const dailyTotals = new Array(7).fill(0);
    let grandTotal = 0;

    // Filter events overlapping this week
    // Set end of week to end of Sunday
    const endOfWeek = new Date(weekDates[6]);
    endOfWeek.setHours(23, 59, 59, 999);

    events.forEach(event => {
      if (event.start >= startOfWeek && event.start <= endOfWeek) {
        // Find day index (0=Mon, 6=Sun)
        const dayIndex = weekDates.findIndex(d => d.toDateString() === event.start.toDateString());
        
        if (dayIndex !== -1) {
          // Calculate Duration in Hours
          const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
          
          // Add to Project Map
          const projectName = event.project || 'Unassigned';
          if (!projectMap.has(projectName)) {
            projectMap.set(projectName, new Array(7).fill(0));
          }
          const hours = projectMap.get(projectName)!;
          hours[dayIndex] += duration;
          
          // Add to Totals
          dailyTotals[dayIndex] += duration;
          grandTotal += duration;
        }
      }
    });

    // Convert map to array and sort by project name
    const projectArray = Array.from(projectMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    return { 
      weekDates, 
      projectData: projectArray, 
      dailyTotals,
      grandTotal 
    };
  }, [currentDate, events]);

  const formatDateRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Weekly Timesheet</h2>
          <p className="text-sm text-slate-500">{formatDateRange()}</p>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm text-sm font-medium text-slate-700 flex items-center gap-2">
          <Clock size={16} className="text-indigo-600" />
          <span>Total: {grandTotal.toFixed(1)} hrs</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-w-[800px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200 backdrop-blur-sm">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm w-1/4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    Project
                  </div>
                </th>
                {weekDates.map((date, i) => (
                  <th key={i} className="p-4 font-semibold text-slate-600 text-sm text-center min-w-[80px]">
                    <div className="uppercase text-[10px] text-slate-400 font-bold tracking-wider mb-1">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-sm ${date.toDateString() === new Date().toDateString() ? 'text-indigo-600 font-bold bg-indigo-50 w-7 h-7 flex items-center justify-center rounded-full mx-auto' : 'text-slate-800'}`}>
                      {date.getDate()}
                    </div>
                  </th>
                ))}
                <th className="p-4 font-semibold text-slate-600 text-sm text-right bg-slate-50">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projectData.length === 0 ? (
                <tr>
                   <td colSpan={9} className="p-16 text-center text-slate-400 bg-slate-50/30">
                      <div className="flex flex-col items-center gap-3">
                        <Clock size={32} className="opacity-20" />
                        <p>No time logged for this week.</p>
                      </div>
                   </td>
                </tr>
              ) : (
                projectData.map(([project, hours]) => {
                  const projectTotal = hours.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={project} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4">
                        <div className="font-semibold text-slate-800 text-sm">{project}</div>
                      </td>
                      {hours.map((h, i) => (
                        <td key={i} className="p-2 text-center">
                          {h > 0 ? (
                            <div className="inline-flex items-center justify-center min-w-[2.5rem] py-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-sm">
                              {h.toFixed(1)}
                            </div>
                          ) : (
                            <span className="text-slate-200 text-sm group-hover:text-slate-300">-</span>
                          )}
                        </td>
                      ))}
                      <td className="p-4 text-right font-bold text-slate-800 bg-slate-50/50 text-sm">
                        {projectTotal.toFixed(1)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-700 text-sm">
              <tr>
                <td className="p-4">Daily Total</td>
                {dailyTotals.map((t, i) => (
                  <td key={i} className="p-4 text-center">
                    {t > 0 ? (
                      <span className="text-slate-800">{t.toFixed(1)}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                ))}
                <td className="p-4 text-right text-indigo-700">
                  {grandTotal.toFixed(1)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};