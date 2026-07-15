import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Plus, Trash, Edit3, Check, X } from 'lucide-react';
import { Column, Task } from '../../types';
import TaskCard from '../task/TaskCard';

interface ColumnViewProps {
  column: Column;
  tasks: Task[];
  onAddTaskClick: (columnId: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  onRenameColumn: (columnId: number, newTitle: string) => void;
  onDeleteColumn: (columnId: number) => void;
}

export default function ColumnView({
  column,
  tasks,
  onAddTaskClick,
  onEditTask,
  onDeleteTask,
  onRenameColumn,
  onDeleteColumn
}: ColumnViewProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleSaveRename = () => {
    if (titleInput.trim() && titleInput.trim() !== column.title) {
      onRenameColumn(column.id, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCancelRename = () => {
    setTitleInput(column.title);
    setIsEditingTitle(false);
  };

  return (
    <div className="flex flex-col w-[300px] max-h-[75vh] flex-shrink-0 bg-slate-100/50 dark:bg-[#111827]/40 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl overflow-hidden shadow-premium">

      {/* Column Title Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 bg-white/20 dark:bg-black/10 backdrop-blur-sm">

        {isEditingTitle ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="px-2 py-1 border border-brand-500 rounded-lg text-xs font-bold outline-none flex-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRename();
                if (e.key === 'Escape') handleCancelRename();
              }}
            />
            <button onClick={handleSaveRename} className="p-1 rounded text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleCancelRename} className="p-1 rounded text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group flex-1">
            <h4 className="font-extrabold text-sm text-slate-700 dark:text-slate-300 tracking-tight truncate max-w-[160px]">
              {column.title}
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800/60 text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
              {tasks.length}
            </span>
            <button
              onClick={() => setIsEditingTitle(true)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
              title="Rename Column"
            >
              <Edit3 className="w-3" />
            </button>
          </div>
        )}

        {/* Delete Column button */}
        {!isEditingTitle && (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Delete Column"
          >
            <Trash className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Task Stack Droppable Area */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200/50 dark:border-slate-800/30 rounded-xl">
            <span className="text-xs italic font-medium">Empty column</span>
          </div>
        )}
      </div>

      {/* Quick Add Task button at base */}
      <button
        onClick={() => onAddTaskClick(column.id)}
        className="p-3 bg-white/40 dark:bg-black/10 hover:bg-slate-100 dark:hover:bg-slate-800/30 text-xs font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center justify-center gap-1.5 border-t border-slate-200/30 dark:border-slate-800/30 transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        Add Task Card
      </button>

      {/* Confirmation modal on Delete Column */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-6 border border-white/20 shadow-premium-hover animate-slide-in text-center">
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
              Delete Column?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete column "{column.title}"? All inside tasks will be lost permanently.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteColumn(column.id);
                  setShowConfirmDelete(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
