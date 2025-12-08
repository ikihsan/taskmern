import type { TaskStatus } from '../types/task';

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' }
];

export const formatStatusLabel = (status: TaskStatus) =>
  STATUS_OPTIONS.find((option) => option.value === status)?.label || status;
