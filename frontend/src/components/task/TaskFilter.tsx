import { Search, Filter, Calendar, Sparkles } from 'lucide-react';

interface TaskFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedPriority: string;
  setSelectedPriority: (val: string) => void;
  selectedLabel: string;
  setSelectedLabel: (val: string) => void;
  dueDateStatus: string;
  setDueDateStatus: (val: string) => void;
  availableLabels: string[];
}

export default function TaskFilter({
  searchQuery,
  setSearchQuery,
  selectedPriority,
  setSelectedPriority,
  selectedLabel,
  setSelectedLabel,
  dueDateStatus,
  setDueDateStatus,
  availableLabels
}: TaskFilterProps) {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-5 shadow-premium">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by title..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs font-semibold focus:border-brand-500 bg-transparent text-slate-800 dark:text-white"
        />
      </div>

      {/* Select Filter Controls */}
      <div className="grid grid-cols-2 sm:flex items-center gap-4 w-full md:w-auto">

        {/* Priority Filter */}
        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60 px-3 py-1.5 rounded-xl">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 dark:text-slate-300 pr-2 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Label Filter */}
        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 dark:text-slate-300 pr-2 cursor-pointer"
          >
            <option value="ALL">All Labels</option>
            {availableLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date Relative Filter */}
        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60 px-3 py-1.5 rounded-xl col-span-2 sm:col-span-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={dueDateStatus}
            onChange={(e) => setDueDateStatus(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 dark:text-slate-300 pr-2 cursor-pointer"
          >
            <option value="ALL">All Deadlines</option>
            <option value="OVERDUE">Overdue Warnings</option>
            <option value="TODAY">Due Today</option>
            <option value="UPCOMING">Upcoming Tasks</option>
          </select>
        </div>

        {/* Clear Filters button */}
        {(searchQuery || selectedPriority !== 'ALL' || selectedLabel !== 'ALL' || dueDateStatus !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPriority('ALL');
              setSelectedLabel('ALL');
              setDueDateStatus('ALL');
            }}
            className="text-xs font-extrabold text-brand-600 dark:text-brand-400 hover:underline px-2 col-span-2 sm:col-span-1 text-center"
          >
            Clear Filters
          </button>
        )}

      </div>
    </div>
  );
}
