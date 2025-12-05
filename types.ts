export enum ViewType {
  MONTH = 'MONTH',
  DAY = 'DAY',
  TIMESHEET = 'TIMESHEET'
}

export interface ProjectTask {
  id: string;
  project: string;
  taskType: string;
  description: string;
  color?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  project: string;
  type: 'manual' | 'ai-generated';
  description?: string;
}

export interface AIScheduleRequest {
  tasks: ProjectTask[];
  targetDate: Date;
}