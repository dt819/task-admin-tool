import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { TASK_STATUS, TASK_PRIORITY, TASKS_PER_PAGE } from '../../utils/constants';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Loading from '../common/Loading';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

const TaskList: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError
  } = useTaskStore();

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    let filtered = [...tasks];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Assignee filter
    if (assigneeFilter) {
      filtered = filtered.filter(task => 
        task.assignee?.toLowerCase().includes(assigneeFilter.toLowerCase())
      );
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by created_at desc
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredTasks(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [tasks, statusFilter, priorityFilter, assigneeFilter, searchQuery]);

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(taskData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleEditTask = async (taskData: any) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('このタスクを削除しますか？')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const clearAllFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setAssigneeFilter('');
    setSearchQuery('');
  };

  // Get unique assignees for filter
  const uniqueAssignees = Array.from(
    new Set(tasks.map(task => task.assignee).filter(Boolean))
  ).sort();

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + TASKS_PER_PAGE);

  if (loading && tasks.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loading size="lg" text="タスクを読み込み中..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">タスク一覧</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          新しいタスク
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="ml-auto"
            >
              閉じる
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">検索</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="タイトル・説明で検索"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">すべて</option>
              {Object.entries(TASK_STATUS).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">すべて</option>
              {Object.entries(TASK_PRIORITY).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">担当者</label>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">すべて</option>
              {uniqueAssignees.map(assignee => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Clear */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredTasks.length} 件のタスク
            </span>
            {(statusFilter !== 'all' || priorityFilter !== 'all' || assigneeFilter || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
              >
                フィルターをクリア
              </Button>
            )}
          </div>
          
          {/* Active Filters */}
          <div className="flex items-center space-x-2">
            {statusFilter !== 'all' && (
              <Badge variant="status" status={statusFilter} />
            )}
            {priorityFilter !== 'all' && (
              <Badge variant="priority" priority={priorityFilter} />
            )}
            {assigneeFilter && (
              <Badge>{assigneeFilter}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {paginatedTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            onClick={setSelectedTask}
          />
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600">タスクが見つかりませんでした</p>
            <p className="text-sm text-gray-400 mt-1">フィルターを変更するか、新しいタスクを作成してください</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            前へ
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            次へ
          </Button>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="新しいタスクを作成"
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="タスクを編集"
        size="lg"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleEditTask}
          onCancel={() => setEditingTask(null)}
          loading={loading}
        />
      </Modal>

      {/* Task Detail Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title}
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="status" status={selectedTask.status} />
              <Badge variant="priority" priority={selectedTask.priority} />
            </div>
            
            {selectedTask.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">説明</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedTask.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              {selectedTask.assignee && (
                <div>
                  <span className="font-medium text-gray-900">担当者:</span>
                  <span className="ml-2 text-gray-600">{selectedTask.assignee}</span>
                </div>
              )}
              
              {selectedTask.due_date && (
                <div>
                  <span className="font-medium text-gray-900">期限:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(selectedTask.due_date).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-900">作成日:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(selectedTask.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
              
              <div>
                <span className="font-medium text-gray-900">更新日:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(selectedTask.updated_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingTask(selectedTask);
                  setSelectedTask(null);
                }}
              >
                編集
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteTask(selectedTask.id);
                  setSelectedTask(null);
                }}
              >
                削除
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TaskList;
