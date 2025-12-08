import api from './api';
import type { Task, TaskInput } from '../types/task';

const toFormData = (payload: TaskInput) => {
  const formData = new FormData();
  formData.set('title', payload.title);
  formData.set('dueDate', payload.dueDate);
  if (payload.status) {
    formData.set('status', payload.status);
  }
  if (payload.attachment) {
    formData.set('attachment', payload.attachment);
  }
  return formData;
};

export const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await api.get('/tasks');
  return data.data;
};

export const createTaskRequest = async (payload: TaskInput): Promise<Task> => {
  const { data } = await api.post('/tasks', toFormData(payload));
  return data.data;
};

export const updateTaskRequest = async (id: string, payload: TaskInput): Promise<Task> => {
  const { data } = await api.put(`/tasks/${id}`, toFormData(payload));
  return data.data;
};

export const deleteTaskRequest = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
