import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Layout,
  Check,
  X,
  FileEdit,
  Trash2
} from 'lucide-react';
import { boardApi, columnApi, taskApi } from '../api/api';
import { Board, Column, Task } from '../types';
import { useToast } from '../hooks/useToast';
import ColumnView from '../components/board/ColumnView';
import TaskFilter from '../components/task/TaskFilter';
import TaskModal from '../components/task/TaskModal';

// @dnd-kit imports
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedLabel, setSelectedLabel] = useState('ALL');
  const [dueDateStatus, setDueDateStatus] = useState('ALL');

  // Inline board rename states
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDesc, setBoardDesc] = useState('');

  // Modals & triggers
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | null>(null);

  // New Column States
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fetchBoardDetails = async () => {
    try {
      const res = await boardApi.getById(boardId);
      setBoard(res.data);
      setBoardTitle(res.data.title);
      setBoardDesc(res.data.description || '');
      setColumns(res.data.columns || []);
    } catch (e) {
      showToast('Failed to load board details. It may have been deleted.', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchBoardDetails();
    }
  }, [boardId]);

  // Handle board editing/updates
  const handleSaveBoardDetails = async () => {
    if (!boardTitle.trim()) {
      showToast('Board title cannot be empty', 'error');
      return;
    }
    try {
      const res = await boardApi.update(boardId, {
        title: boardTitle.trim(),
        description: boardDesc.trim()
      });
      setBoard(res.data);
      showToast('Board workspace settings updated successfully', 'success');
      setIsEditingBoard(false);
    } catch (e) {
      showToast('Failed to update board details', 'error');
    }
  };

  const handleDeleteBoard = async () => {
    try {
      await boardApi.delete(boardId);
      showToast('Board workspace deleted successfully', 'success');
      navigate('/dashboard');
    } catch (e) {
      showToast('Failed to delete board', 'error');
    }
  };

  // Column CRUD
  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    try {
      const res = await columnApi.create(boardId, { title: newColumnTitle.trim() });
      setColumns([...columns, { ...res.data, tasks: [] }]);
      setNewColumnTitle('');
      setShowAddColumn(false);
      showToast(`Column "${res.data.title}" added successfully`, 'success');
    } catch (e) {
      showToast('Failed to create custom column', 'error');
    }
  };

  const handleRenameColumn = async (columnId: number, newTitle: string) => {
    try {
      await columnApi.update(columnId, { title: newTitle });
      setColumns(columns.map(c => c.id === columnId ? { ...c, title: newTitle } : c));
      showToast('Column renamed successfully', 'success');
    } catch (e) {
      showToast('Failed to rename column', 'error');
    }
  };

  const handleDeleteColumn = async (columnId: number) => {
    try {
      await columnApi.delete(columnId);
      setColumns(columns.filter(c => c.id !== columnId));
      showToast('Column deleted successfully', 'success');
    } catch (e) {
      showToast('Failed to delete column', 'error');
    }
  };

  // Task CRUD operations
  const handleAddTaskClick = (columnId: number) => {
    setActiveColumnId(columnId);
    setEditingTask(undefined);
    setShowTaskModal(true);
  };

  const handleEditTaskClick = (task: Task) => {
    setEditingTask(task);
    setActiveColumnId(null);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        // Edit flow
        const res = await taskApi.update(editingTask.id, taskData);
        setColumns(columns.map(c => ({
          ...c,
          tasks: c.tasks.map(t => t.id === editingTask.id ? { ...t, ...res.data } : t)
        })));
        showToast('Task updated successfully', 'success');
      } else if (activeColumnId) {
        // Create flow
        const res = await taskApi.create(activeColumnId, taskData);
        setColumns(columns.map(c => c.id === activeColumnId ? { ...c, tasks: [...c.tasks, res.data] } : c));
        showToast('Task created successfully', 'success');
      }
      setShowTaskModal(false);
    } catch (e) {
      showToast('Failed to persist task details', 'error');
    }
  };

  const handleDeleteTaskTrigger = (id: number) => {
    setTaskToDeleteId(id);
  };

  const handleConfirmDeleteTask = async () => {
    if (!taskToDeleteId) return;
    try {
      await taskApi.delete(taskToDeleteId);
      setColumns(columns.map(c => ({
        ...c,
        tasks: c.tasks.filter(t => t.id !== taskToDeleteId)
      })));
      showToast('Task card removed permanently', 'success');
    } catch (e) {
      showToast('Failed to delete task', 'error');
    } finally {
      setTaskToDeleteId(null);
    }
  };

  // Drag and Drop implementation with dnd-kit
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as number;
    const overId = over.id as number;

    // Retrieve active task
    let activeTask: Task | undefined;
    let sourceColumnId = -1;
    for (const col of columns) {
      const t = col.tasks.find(tk => tk.id === taskId);
      if (t) {
        activeTask = t;
        sourceColumnId = col.id;
        break;
      }
    }

    if (!activeTask) return;

    // Check if over a column or another task card
    let targetColumnId = -1;
    let targetPosition = 0;

    // Check if over a column directly
    const targetCol = columns.find(c => c.id === overId);
    if (targetCol) {
      targetColumnId = targetCol.id;
      targetPosition = targetCol.tasks.length;
    } else {
      // Over another task
      for (const col of columns) {
        const idx = col.tasks.findIndex(tk => tk.id === overId);
        if (idx !== -1) {
          targetColumnId = col.id;
          targetPosition = idx;
          break;
        }
      }
    }

    if (targetColumnId === -1) return;

    // Instantly reflect changes visually on frontend
    setColumns((prevColumns) => {
      const updated = prevColumns.map(c => ({ ...c, tasks: [...c.tasks] }));
      const sCol = updated.find(c => c.id === sourceColumnId);
      const tCol = updated.find(c => c.id === targetColumnId);

      if (!sCol || !tCol) return prevColumns;

      const [movedTask] = sCol.tasks.splice(sCol.tasks.findIndex(tk => tk.id === taskId), 1);

      // Update target positions
      tCol.tasks.splice(targetPosition, 0, movedTask);

      // Sync positions inside column lists
      sCol.tasks.forEach((t, i) => t.position = i);
      tCol.tasks.forEach((t, i) => t.position = i);

      return updated;
    });

    // Persist position and column shift to backend API
    try {
      await taskApi.move(taskId, targetColumnId, targetPosition);
    } catch (e) {
      showToast('Failed to sync card position with server', 'error');
      fetchBoardDetails(); // Revert state on error
    }
  };

  // Immediate filtering computation
  const getFilteredTasks = (tasks: Task[]) => {
    return tasks.filter((t) => {
      // 1. Text Search
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // 2. Priority Filter
      if (selectedPriority !== 'ALL' && t.priority.toUpperCase() !== selectedPriority.toUpperCase()) {
        return false;
      }
      // 3. Label Filter
      if (selectedLabel !== 'ALL') {
        const hasLabel = t.labels?.some(lbl => lbl.name.toLowerCase() === selectedLabel.toLowerCase());
        if (!hasLabel) return false;
      }
      // 4. Relative Due-Date Filter
      if (dueDateStatus !== 'ALL' && t.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);

        if (dueDateStatus === 'OVERDUE' && (due >= today || t.columnId === columns.find(c => c.title.toLowerCase() === 'done')?.id)) {
          return false;
        }
        if (dueDateStatus === 'TODAY' && due.getTime() !== today.getTime()) {
          return false;
        }
        if (dueDateStatus === 'UPCOMING' && due <= today) {
          return false;
        }
      }
      return true;
    });
  };

  // Compile unique lists of labels for the Filter select options
  const getAllAvailableLabels = () => {
    const labelSet = new Set<string>();
    columns.forEach(col => {
      col.tasks.forEach(t => {
        t.labels?.forEach(lbl => labelSet.add(lbl.name));
      });
    });
    return Array.from(labelSet);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="flex gap-6 overflow-x-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 w-72 bg-slate-200 dark:bg-slate-800 rounded-2xl flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">

      {/* Upper Navigation Backline & delete controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-indigo-500 transition-colors uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Workspace
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all border border-rose-500/10"
          >
            <Trash2 className="w-4 h-4" />
            Delete Workspace
          </button>
        </div>
      </div>

      {/* Board workspace title settings panel (with inline rename support) */}
      <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 border border-white/20 bg-gradient-to-r ${board?.color || 'from-purple-500 to-indigo-500'} text-white shadow-premium premium-glow`}>
        {isEditingBoard ? (
          <div className="space-y-4 max-w-xl">
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="w-full bg-white/15 border border-white/20 rounded-xl px-4 py-2.5 font-extrabold text-2xl outline-none focus:bg-white/20 text-white"
              placeholder="Board Name"
            />
            <textarea
              value={boardDesc}
              onChange={(e) => setBoardDesc(e.target.value)}
              className="w-full bg-white/15 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:bg-white/20 text-white resize-none"
              placeholder="Board Description..."
              rows={2}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveBoardDetails}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-brand-700 text-xs font-bold rounded-xl shadow-premium hover:bg-slate-50 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditingBoard(false)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white hover:bg-white/20 text-xs font-bold rounded-xl transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight">
                  {board?.title}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  <Layout className="w-3 h-3" />
                  Premium Board
                </span>
              </div>
              <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">
                {board?.description || 'No description provided for this board. Click Edit to add details.'}
              </p>
            </div>

            <button
              onClick={() => setIsEditingBoard(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/10 self-start sm:self-auto"
            >
              <FileEdit className="w-4 h-4" />
              Edit Settings
            </button>
          </div>
        )}
      </div>

      {/* Advanced Reactive Filtering and search controls */}
      <TaskFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
        dueDateStatus={dueDateStatus}
        setDueDateStatus={setDueDateStatus}
        availableLabels={getAllAvailableLabels()}
      />

      {/* Horizontal Kanban columns scrollable board section */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex items-start gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth">
          {columns.map((col) => (
            <ColumnView
              key={col.id}
              column={col}
              tasks={getFilteredTasks(col.tasks || [])}
              onAddTaskClick={handleAddTaskClick}
              onEditTask={handleEditTaskClick}
              onDeleteTask={handleDeleteTaskTrigger}
              onRenameColumn={handleRenameColumn}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}

          {/* Quick Create Column Card inside the horizontal scrollbar */}
          {showAddColumn ? (
            <form
              onSubmit={handleAddColumn}
              className="w-[300px] bg-white dark:bg-[#131b2e] border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 shadow-premium flex-shrink-0 flex flex-col gap-3.5 animate-slide-in"
            >
              <input
                type="text"
                required
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Column name (e.g. Backlog)"
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-xs font-semibold focus:border-brand-500 bg-transparent text-slate-800 dark:text-white"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors"
                >
                  Create Column
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddColumn(false)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddColumn(true)}
              className="w-[300px] h-[160px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800/80 hover:border-brand-500 hover:bg-white/10 dark:hover:bg-slate-900/10 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-brand-500 flex-shrink-0 smooth-all"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Add Custom Column</span>
            </button>
          )}
        </div>
      </DndContext>

      {/* Reusable Task Modals */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />

      {/* Confirmation Modal: Delete Workspace */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-6 border border-white/20 shadow-premium-hover animate-slide-in text-center">
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
              Delete entire Workspace?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete board "{board?.title}"? This will delete all custom columns, tasks and label counts permanently.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteBoard}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Task Card */}
      {taskToDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-6 border border-white/20 shadow-premium-hover animate-slide-in text-center">
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
              Delete Task Card?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete this task card? This action is non-reversible.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setTaskToDeleteId(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTask}
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
