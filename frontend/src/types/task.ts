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

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalTasks: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedTasksResponse {
  data: Task[];
  pagination: PaginationMeta;
}
