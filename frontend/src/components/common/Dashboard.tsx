import React, { useEffect } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';
import Loading from './Loading';
import Badge from './Badge';
import Button from './Button';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { tasks, tasksByStatus, loading, fetchTasks, fetchTasksByStatus } = useTaskStore();

  useEffect(() => {
    fetchTasks();
    fetchTasksByStatus();
  }, [fetchTasks, fetchTasksByStatus]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loading size="lg" text="ダッシュボードを読み込み中..." />
      </div>
    );
  }

  // Statistics
  const totalTasks = tasks.length;
  const statusCounts = Object.keys(TASK_STATUS).reduce((acc, status) => {
    acc[status] = tasksByStatus[status as keyof typeof tasksByStatus]?.length || 0;
    return acc;
  }, {} as Record<string, number>);

  const priorityCounts = Object.keys(TASK_PRIORITY).reduce((acc, priority) => {
    acc[priority] = tasks.filter(task => task.priority === priority).length;
    return acc;
  }, {} as Record<string, number>);

  // Recent tasks (last 5)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  // Overdue tasks
  const overdueTasks = tasks.filter(task => 
    task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
  );

  // Today's due tasks
  const today = new Date().toDateString();
  const todayDueTasks = tasks.filter(task => 
    task.due_date && new Date(task.due_date).toDateString() === today && task.status !== 'done'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600">プロジェクトの進捗状況を確認できます</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => onNavigate('/kanban')}>
          📋 カンバンボードを開く
        </Button>
        <Button variant="secondary" onClick={() => onNavigate('/tasks')}>
          📝 タスク一覧を表示
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総タスク数</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">進行中</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.in_progress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-semibold">⚠️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">期限切れ</p>
              <p className="text-2xl font-bold text-gray-900">{overdueTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">完了</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.done}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ステータス別タスク数</h3>
          <div className="space-y-3">
            {Object.entries(TASK_STATUS).map(([status, config]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${config.bgColor}`} />
                  <span className="text-sm font-medium text-gray-700">{config.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{statusCounts[status]}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${config.bgColor}`}
                      style={{ width: `${totalTasks > 0 ? (statusCounts[status] / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">優先度別タスク数</h3>
          <div className="space-y-3">
            {Object.entries(TASK_PRIORITY).map(([priority, config]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{config.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{config.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{priorityCounts[priority]}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${totalTasks > 0 ? (priorityCounts[priority] / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(overdueTasks.length > 0 || todayDueTasks.length > 0) && (
        <div className="space-y-4">
          {/* Overdue Tasks Alert */}
          {overdueTasks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800">期限切れのタスクがあります</h4>
                  <p className="text-sm text-red-700 mt-1">{overdueTasks.length}件のタスクが期限を過ぎています。</p>
                </div>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => onNavigate('/tasks')}
                >
                  確認する
                </Button>
              </div>
            </div>
          )}

          {/* Today's Due Tasks Alert */}
          {todayDueTasks.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-yellow-800">今日が期限のタスクがあります</h4>
                  <p className="text-sm text-yellow-700 mt-1">{todayDueTasks.length}件のタスクが今日期限です。</p>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onNavigate('/tasks')}
                >
                  確認する
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">最近更新されたタスク</h3>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('/tasks')}>
            すべて表示 →
          </Button>
        </div>
        
        {recentTasks.length > 0 ? (
          <div className="space-y-3">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="status" status={task.status} />
                    <Badge variant="priority" priority={task.priority} />
                    {task.assignee && (
                      <span className="text-xs text-gray-500">👤 {task.assignee}</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(task.updated_at).toLocaleDateString('ja-JP')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>タスクがありません</p>
            <Button 
              size="sm" 
              className="mt-2"
              onClick={() => onNavigate('/tasks')}
            >
              タスクを作成
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
