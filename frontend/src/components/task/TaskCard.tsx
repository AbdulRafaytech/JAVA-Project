import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getAssigneeInitials = (assigneeName?: string) => {
    if (!assigneeName) return '?';
    return assigneeName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white dark:bg-[#131b2e] border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4 relative touch-none select-none"
    >

      {/* Header dragging helper listener & actions */}
      <div className="flex items-start justify-between gap-4">
        {/* Priority Badge */}
        <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${getPriorityStyles(task.priority)}`}>
          {task.priority}
        </span>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Edit Task"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-600 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dragging Trigger Title */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing space-y-1.5 flex-1">
        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 tracking-tight leading-snug line-clamp-2">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Custom colored pills for Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.labels.map((lbl, idx) => (
            <span
              key={idx}
              style={{ backgroundColor: `${lbl.color}15`, color: lbl.color, borderColor: `${lbl.color}30` }}
              className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border"
            >
              {lbl.name}
            </span>
          ))}
        </div>
      )}

      {/* Card Footer: Due Date warning & assignee avatar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-1">

        {/* Due Date Indicator */}
        {task.dueDate ? (
          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${
            isOverdue()
              ? 'text-rose-500 dark:text-rose-400'
              : 'text-slate-400 dark:text-slate-500'
          }`}>
            {isOverdue() ? (
              <AlertCircle className="w-3.5 h-3.5 animate-pulse text-rose-500" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span>
              {formatDueDate(task.dueDate)} {isOverdue() && '(Overdue)'}
            </span>
          </div>
        ) : (
          <div className="w-4 h-4" /> // empty spacer
        )}

        {/* Assignee Initial Circle */}
        {task.assignee && (
          <div
            className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-500 text-white flex items-center justify-center text-[10px] font-black shadow-premium select-none border border-white/10"
            title={`Assigned to ${task.assignee}`}
          >
            {getAssigneeInitials(task.assignee)}
          </div>
        )}
      </div>

    </div>
  );
}
