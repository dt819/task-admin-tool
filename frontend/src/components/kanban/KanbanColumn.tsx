import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '../../types/task';
import { TASK_STATUS } from '../../utils/constants';
import TaskCard from '../tasks/TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  onEditTask,
  onDeleteTask
}) => {
  const statusConfig = TASK_STATUS[status];

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${statusConfig.bgColor}`} />
          <h2 className="font-semibold text-gray-900">{statusConfig.label}</h2>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color} ${statusConfig.bgColor}`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 p-2 rounded-lg transition-colors ${
              snapshot.isDraggingOver 
                ? 'bg-blue-50 border-2 border-blue-200 border-dashed' 
                : 'bg-gray-50 border-2 border-transparent'
            }`}
            style={{ minHeight: '200px' }}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transition-transform ${
                      snapshot.isDragging 
                        ? 'transform rotate-2 shadow-xl' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      draggable
                      className={snapshot.isDragging ? 'opacity-90' : ''}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {/* Empty State */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>タスクなし</p>
                  <p className="text-xs">ここにドラッグ</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
