import { ProjectTask } from './types';

export const MOCK_TASKS: ProjectTask[] = [
  { id: '1', project: 'EIK1003-001', taskType: 'Development', description: 'ECRF design', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: '2', project: 'EIK1003-001', taskType: 'Testing', description: 'UAT Script Generation', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: '3', project: 'EIK1003-001', taskType: 'Development', description: 'Programming Activities', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: '4', project: 'EIK1003-001', taskType: 'Deployment', description: 'Promotion to UAT instance', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: '5', project: 'EIK1004-001', taskType: 'Documentation', description: 'Document Review/Spec update', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: '6', project: 'EIK1004-001', taskType: 'Training', description: 'Client Training', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: '7', project: 'EIK1001-005', taskType: 'Development', description: 'Dynamic Rules', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: '8', project: 'EIK1001-005', taskType: 'Deployment', description: 'Pre-Deployment activities', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: '9', project: 'Global Library', taskType: 'Development', description: 'Library Development', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: '10', project: 'Klinera', taskType: 'Training', description: 'Safety & Medical Monitoring Induction', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { id: '11', project: 'Klinera', taskType: 'Meetings', description: 'Team Call', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { id: '12', project: 'Eikon General', taskType: 'Development', description: 'LNMT-backend tables', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { id: '13', project: 'Eikon General', taskType: 'Development', description: 'LNMT-New features', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { id: '14', project: 'Eikon General', taskType: 'Holiday', description: 'Client Holiday/Holiday in India', color: 'bg-red-100 text-red-700 border-red-200' },
];

export const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM
