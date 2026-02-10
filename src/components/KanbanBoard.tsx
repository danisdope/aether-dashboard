'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: 'daniel' | 'aether' | 'surgeon';
  dueDate?: string;
}

interface Column {
  id: string;
  title: string;
  icon: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    icon: '📋',
    tasks: [
      { id: '1', title: 'Run test scenarios 2-12', priority: 'high', assignee: 'daniel', description: 'Happy paths + Personas + Resistance scenarios' },
      { id: '2', title: 'Send transcripts to Aether', priority: 'medium', assignee: 'daniel' },
      { id: '3', title: 'Review Surgeon fixes', priority: 'medium', assignee: 'daniel' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    icon: '🔄',
    tasks: [
      { id: '4', title: 'Dashboard upgrade', priority: 'high', assignee: 'aether', description: 'Interactive CEO View with Kanban' },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    icon: '👀',
    tasks: [],
  },
  {
    id: 'done',
    title: 'Done',
    icon: '✅',
    tasks: [
      { id: '5', title: 'Observatory cleanup', priority: 'medium', assignee: 'aether' },
      { id: '6', title: 'CEO Dashboard notes', priority: 'medium', assignee: 'aether' },
    ],
  },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedTask, setDraggedTask] = useState<{ task: Task; sourceColumnId: string } | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const handleDragStart = (task: Task, sourceColumnId: string) => {
    setDraggedTask({ task, sourceColumnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask) return;

    const { task, sourceColumnId } = draggedTask;
    if (sourceColumnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    setColumns(prev => prev.map(col => {
      if (col.id === sourceColumnId) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== task.id) };
      }
      if (col.id === targetColumnId) {
        return { ...col, tasks: [...col.tasks, task] };
      }
      return col;
    }));

    setDraggedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-500/5';
      case 'high': return 'border-l-orange-500 bg-orange-500/5';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/5';
      default: return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const getAssigneeEmoji = (assignee?: string) => {
    switch (assignee) {
      case 'daniel': return '👤';
      case 'aether': return '🦉';
      case 'surgeon': return '🔪';
      default: return '❓';
    }
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {columns.map(column => (
          <div
            key={column.id}
            className="w-72 flex-shrink-0"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-3 px-2">
              <span className="text-lg">{column.icon}</span>
              <h3 className="font-semibold text-gray-300">{column.title}</h3>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">
                {column.tasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-2 min-h-[200px] p-2 rounded-lg bg-gray-800/30 border border-gray-700/50">
              {column.tasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task, column.id)}
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  className={`p-3 rounded-lg border-l-4 border border-gray-700 cursor-pointer 
                    hover:border-gray-600 transition-all ${getPriorityColor(task.priority)}
                    ${draggedTask?.task.id === task.id ? 'opacity-50' : ''}
                    ${expandedTask === task.id ? 'ring-2 ring-indigo-500/50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white">{task.title}</p>
                    <span className="text-sm" title={task.assignee}>
                      {getAssigneeEmoji(task.assignee)}
                    </span>
                  </div>
                  
                  {/* Expanded details */}
                  {expandedTask === task.id && task.description && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-400">{task.description}</p>
                      <div className="flex gap-2 mt-2">
                        <button className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300">
                          Edit
                        </button>
                        <button className="text-xs px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400">
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {column.tasks.length === 0 && (
                <div className="flex items-center justify-center h-20 text-gray-500 text-sm">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
