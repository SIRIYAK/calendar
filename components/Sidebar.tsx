import React from 'react';
import { ProjectTask } from '../types';
import { Plus, GripVertical, Sparkles } from 'lucide-react';

interface SidebarProps {
  tasks: ProjectTask[];
  onTaskDragStart: (e: React.DragEvent, task: ProjectTask) => void;
  onAutoSchedule: () => void;
  isGenerating: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ tasks, onTaskDragStart, onAutoSchedule, isGenerating }) => {
  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
          Backlog
        </h2>
        <p className="text-xs text-slate-500 mt-1">Drag items to calendar</p>
      </div>

      <div className="p-4 bg-slate-50/50">
        <button
          onClick={onAutoSchedule}
          disabled={isGenerating}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            isGenerating 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-md hover:from-indigo-700 hover:to-violet-700'
          }`}
        >
          {isGenerating ? (
             <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Sparkles size={16} />
          )}
          {isGenerating ? 'AI Scheduling...' : 'Auto-Schedule with AI'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => onTaskDragStart(e, task)}
            className={`group p-3 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all bg-white border-slate-200 hover:border-indigo-300`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${task.color}`}>
                {task.project.split(' ')[0]}
              </span>
              <GripVertical size={14} className="text-slate-300 group-hover:text-slate-500" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm leading-tight">{task.description}</h3>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                {task.taskType}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
