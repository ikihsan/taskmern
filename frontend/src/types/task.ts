export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'overdue';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  attachmentPath?: string | null;
  attachmentUrl?: string | null;
}

export interface TaskInput {
  title: string;
  dueDate: string;
  status?: TaskStatus;
  attachment?: File | null;
}
