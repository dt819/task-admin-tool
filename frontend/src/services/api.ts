import axios from 'axios';
import type { Task, TaskCreate, TaskUpdate, TasksByStatus } from '../types/task';

// 開発環境ではViteのプロキシを使用、本番環境では環境変数を使用
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tasksApi = {
  // 全タスク取得
  getTasks: async (): Promise<{ tasks: Task[]; total: number }> => {
    const response = await api.get('/api/tasks/');
    return response.data;
  },

  // ステータス別タスク取得
  getTasksByStatus: async (): Promise<TasksByStatus> => {
    const response = await api.get('/api/tasks/by-status');
    return response.data;
  },

  // タスク詳細取得
  getTask: async (id: number): Promise<Task> => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  // タスク作成
  createTask: async (task: TaskCreate): Promise<Task> => {
    const response = await api.post('/api/tasks/', task);
    return response.data;
  },

  // タスク更新
  updateTask: async (id: number, task: TaskUpdate): Promise<Task> => {
    const response = await api.put(`/api/tasks/${id}`, task);
    return response.data;
  },

  // タスク位置更新（ドラッグ&ドロップ用）
  updateTaskPosition: async (
    id: number, 
    status: string, 
    position: number
  ): Promise<Task> => {
    const response = await api.patch(`/api/tasks/${id}/position`, {
      status,
      position,
    });
    return response.data;
  },

  // タスク削除
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
  },
};

export default api;
