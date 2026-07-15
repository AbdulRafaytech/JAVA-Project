import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Task, Label } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  task?: Task; // If provided, we are editing
}

const PRESET_LABEL_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Rose
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];

export default function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Custom label management state
  const [labels, setLabels] = useState<Label[]>([]);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState(PRESET_LABEL_COLORS[0]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'MEDIUM');
      setAssignee(task.assignee || '');
      setDueDate(task.dueDate || '');
      setLabels(task.labels || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setAssignee('');
      setDueDate('');
      setLabels([]);
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleAddLabel = () => {
    if (!newLabelName.trim()) return;
    setLabels([...labels, { name: newLabelName.trim(), color: newLabelColor }]);
    setNewLabelName('');
  };

  const handleRemoveLabel = (index: number) => {
    setLabels(labels.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      assignee: assignee.trim() || undefined,
      dueDate: dueDate || undefined,
      labels
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-8 border border-white/20 shadow-premium-hover animate-slide-in relative max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          {task ? 'Edit' : 'Create'} <span className="gradient-text">Task</span>
        </h3>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
          Set titles, descriptions, due dates, assignee lists and customizable colored labels.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title Input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement API validation"
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-xs font-semibold focus:border-brand-500 dark:focus:border-brand-400 bg-transparent text-slate-800 dark:text-white"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify requirements, sub-tasks and goals"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-xs font-semibold focus:border-brand-500 dark:focus:border-brand-400 bg-transparent text-slate-800 dark:text-white resize-none"
            />
          </div>

          {/* Priority & Assignee Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Priority Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-xs font-bold focus:border-brand-500 bg-transparent text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <option value="LOW">Low (Green)</option>
                <option value="MEDIUM">Medium (Yellow)</option>
                <option value="HIGH">High (Red)</option>
              </select>
            </div>

            {/* Assignee Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                Assignee Name
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="e.g. Alice Mercer"
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-xs font-semibold focus:border-brand-500 bg-transparent text-slate-800 dark:text-white"
              />
            </div>

          </div>

          {/* Due date Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
              Due Date Deadline
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-xs font-semibold focus:border-brand-500 bg-transparent text-slate-800 dark:text-white cursor-pointer"
            />
          </div>

          {/* Dynamic Labels Creator */}
          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
              Task Labels
            </label>

            {/* Render Current Labels */}
            {labels.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-100/50 dark:bg-[#1e293b]/20 rounded-xl border border-slate-100 dark:border-slate-800/50">
                {labels.map((lbl, idx) => (
                  <span
                    key={idx}
                    style={{ backgroundColor: `${lbl.color}15`, color: lbl.color, borderColor: `${lbl.color}40` }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border"
                  >
                    {lbl.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveLabel(idx)}
                      className="hover:scale-125 transition-transform"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Label Controls */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Label name (e.g. Bug)"
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-xs font-semibold focus:border-brand-500 bg-transparent text-slate-800 dark:text-white"
              />
              <div className="flex items-center gap-2">
                {/* Palette choice */}
                <div className="flex gap-1.5 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
                  {PRESET_LABEL_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewLabelColor(col)}
                      style={{ backgroundColor: col }}
                      className={`w-6 h-6 rounded-md transition-all ${
                        newLabelColor === col ? 'ring-2 ring-offset-1 ring-slate-400 scale-105' : 'hover:scale-105'
                      }`}
                    />
                  ))}
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={handleAddLabel}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-premium"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
