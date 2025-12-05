import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Table2 } from 'lucide-react';
import { ViewType, ProjectTask, CalendarEvent } from './types';
import { MOCK_TASKS, HOURS } from './constants';
import { Sidebar } from './components/Sidebar';
import { MonthView } from './components/MonthView';
import { DayView } from './components/DayView';
import { TimesheetView } from './components/TimesheetView';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>(ViewType.MONTH);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Load some demo events initially if empty
  useEffect(() => {
    // Only run once
    if (events.length === 0) {
        // Add a demo event for today
        const today = new Date();
        setEvents([
            {
                id: 'demo-1',
                title: 'Project Kickoff',
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
                project: 'Global Library',
                description: 'Initial meeting',
                type: 'manual'
            }
        ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const multiplier = direction === 'next' ? 1 : -1;

    if (view === ViewType.MONTH) {
      newDate.setMonth(currentDate.getMonth() + multiplier);
    } else if (view === ViewType.TIMESHEET) {
      // Move by 7 days for timesheet
      newDate.setDate(currentDate.getDate() + (multiplier * 7));
    } else {
      // Move by 1 day for Day view
      newDate.setDate(currentDate.getDate() + multiplier);
    }
    setCurrentDate(newDate);
  };

  const handleTaskDragStart = (e: React.DragEvent, task: ProjectTask) => {
    e.dataTransfer.setData('task', JSON.stringify(task));
  };

  const handleDropOnDay = (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData('task');
    if (!taskData) return;

    const task: ProjectTask = JSON.parse(taskData);
    
    const start = new Date(currentDate);
    start.setHours(hour, 0, 0, 0);
    
    const end = new Date(start);
    end.setHours(hour + 1, 0, 0, 0); // Default 1 hour duration

    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: task.description, // Using description as title for calendar
      project: task.project,
      description: task.taskType,
      start,
      end,
      type: 'manual'
    };

    setEvents([...events, newEvent]);
  };

  const renderContent = () => {
    switch(view) {
      case ViewType.MONTH:
        return <MonthView currentDate={currentDate} events={events} />;
      case ViewType.DAY:
        return <DayView currentDate={currentDate} events={events} onDrop={handleDropOnDay} />;
      case ViewType.TIMESHEET:
        return <TimesheetView currentDate={currentDate} events={events} />;
      default:
        return <MonthView currentDate={currentDate} events={events} />;
    }
  };

  return (
    <div className="flex h-screen bg-white text-slate-800">
      {/* Sidebar */}
      <Sidebar 
        tasks={MOCK_TASKS} 
        onTaskDragStart={handleTaskDragStart} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                {view === ViewType.MONTH 
                    ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : view === ViewType.TIMESHEET 
                        ? 'Weekly Timesheet'
                        : 'Daily Schedule'
                }
            </h1>
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => navigateDate('prev')}
                className="p-1 hover:bg-white rounded-md transition-colors text-slate-600 shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                 onClick={() => setCurrentDate(new Date())}
                 className="px-3 text-sm font-medium text-slate-600 hover:text-indigo-600"
              >
                Today
              </button>
              <button 
                onClick={() => navigateDate('next')}
                className="p-1 hover:bg-white rounded-md transition-colors text-slate-600 shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                    onClick={() => setView(ViewType.MONTH)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        view === ViewType.MONTH 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <CalendarIcon size={16} />
                    Month
                </button>
                <button
                    onClick={() => setView(ViewType.DAY)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        view === ViewType.DAY
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Clock size={16} />
                    Hourly
                </button>
                <button
                    onClick={() => setView(ViewType.TIMESHEET)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        view === ViewType.TIMESHEET
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Table2 size={16} />
                    Timesheet
                </button>
             </div>
             <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg shadow-sm transition-colors">
                <Plus size={20} />
             </button>
          </div>
        </header>

        {/* Calendar Grid/List */}
        <main className="flex-1 overflow-hidden">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;