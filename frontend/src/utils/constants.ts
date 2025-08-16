import { TaskStatus, TaskPriority } from '../types/task';

// タスクステータス定義
export const TASK_STATUS: Record<TaskStatus, { label: string; color: string; bgColor: string }> = {
  todo: {
    label: 'TODO',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100'
  },
  in_progress: {
    label: '進行中',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100'
  },
  review: {
    label: 'レビュー',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100'
  },
  done: {
    label: '完了',
    color: 'text-green-700',
    bgColor: 'bg-green-100'
  }
};

// タスク優先度定義
export const TASK_PRIORITY: Record<TaskPriority, { label: string; color: string; icon: string }> = {
  low: {
    label: '低',
    color: 'text-green-600',
    icon: '↓'
  },
  medium: {
    label: '中',
    color: 'text-yellow-600',
    icon: '→'
  },
  high: {
    label: '高',
    color: 'text-orange-600',
    icon: '↑'
  },
  urgent: {
    label: '緊急',
    color: 'text-red-600',
    icon: '⚠'
  }
};

// カンバンボードのカラム順序
export const KANBAN_COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

// タスク表示制限
export const TASKS_PER_PAGE = 20;
export const MAX_TITLE_LENGTH = 255;
export const MAX_DESCRIPTION_LENGTH = 1000;
