import axiosInstance from './axiosInstance';
import { Board, Column, Task, DashboardSummary } from '../types';

export const authApi = {
  login: (data: any) => axiosInstance.post('/api/auth/login', data),
  register: (data: any) => axiosInstance.post('/api/auth/register', data),
};

export const boardApi = {
  getAll: () => axiosInstance.get<Board[]>('/api/boards'),
  getById: (id: number) => axiosInstance.get<Board>(`/api/boards/${id}`),
  create: (board: Partial<Board>) => axiosInstance.post<Board>('/api/boards', board),
  update: (id: number, board: Partial<Board>) => axiosInstance.put<Board>(`/api/boards/${id}`, board),
  delete: (id: number) => axiosInstance.delete(`/api/boards/${id}`),
};

export const columnApi = {
  create: (boardId: number, column: Partial<Column>) =>
    axiosInstance.post<Column>(`/api/boards/${boardId}/columns`, column),
  update: (id: number, column: Partial<Column>) =>
    axiosInstance.put<Column>(`/api/columns/${id}`, column),
  delete: (id: number) => axiosInstance.delete(`/api/columns/${id}`),
};

export const taskApi = {
  create: (columnId: number, task: Partial<Task>) =>
    axiosInstance.post<Task>(`/api/columns/${columnId}/tasks`, task),
  getById: (id: number) => axiosInstance.get<Task>(`/api/tasks/${id}`),
  update: (id: number, task: Partial<Task>) =>
    axiosInstance.put<Task>(`/api/tasks/${id}`, task),
  delete: (id: number) => axiosInstance.delete(`/api/tasks/${id}`),
  move: (id: number, targetColumnId: number, position: number) =>
    axiosInstance.put<Task>(`/api/tasks/${id}/move`, null, {
      params: { targetColumnId, position }
    }),
};

export const dashboardApi = {
  getSummary: () => axiosInstance.get<DashboardSummary>('/api/dashboard/summary'),
};
