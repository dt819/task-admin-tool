import { create } from 'zustand';
import { Task, TasksByStatus, TaskCreate, TaskUpdate } from '../types/task';
import { tasksApi } from '../services/api';

interface TaskStore {
  tasks: Task[];
  tasksByStatus: TasksByStatus;
  loading: boolean;
  error: string | null;

  // Actions
  fetchTasks: () => Promise<void>;
  fetchTasksByStatus: () => Promise<void>;
  createTask: (task: TaskCreate) => Promise<void>;
  updateTask: (id: number, task: TaskUpdate) => Promise<void>;
  updateTaskPosition: (id: number, status: string, position: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  tasksByStatus: {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  },
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const data = await tasksApi.getTasks();
      set({ tasks: data.tasks, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        loading: false 
      });
    }
  },

  fetchTasksByStatus: async () => {
    set({ loading: true, error: null });
    try {
      const data = await tasksApi.getTasksByStatus();
      set({ tasksByStatus: data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks by status',
        loading: false 
      });
    }
  },

  createTask: async (task: TaskCreate) => {
    set({ loading: true, error: null });
    try {
      await tasksApi.createTask(task);
      // タスク作成後、データを再取得
      await get().fetchTasksByStatus();
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create task',
        loading: false 
      });
    }
  },

  updateTask: async (id: number, task: TaskUpdate) => {
    set({ loading: true, error: null });
    try {
      await tasksApi.updateTask(id, task);
      await get().fetchTasksByStatus();
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update task',
        loading: false 
      });
    }
  },

  updateTaskPosition: async (id: number, status: string, position: number) => {
    try {
      await tasksApi.updateTaskPosition(id, status, position);
      await get().fetchTasksByStatus();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update task position'
      });
    }
  },

  deleteTask: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await tasksApi.deleteTask(id);
      await get().fetchTasksByStatus();
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete task',
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
