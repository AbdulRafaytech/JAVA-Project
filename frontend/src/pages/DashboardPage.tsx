import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Activity,
  AlertTriangle,
  Plus,
  Folder,
  Clock,
  ArrowRight,
  BrainCircuit
} from 'lucide-react';
import { dashboardApi, boardApi } from '../api/api';
import { DashboardSummary } from '../types';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const MOTIVATIONAL_MESSAGES = [
  { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
  { text: "Simplicity is the key to brilliance.", author: "SaaS Wisdom" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Small progress is still progress. Keep going!", author: "Workspace Coach" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Your daily actions determine your future self.", author: "Atomic Habits" }
];

const GRADIENT_PRESETS = [
  { name: 'Sunset Glow', value: 'from-orange-400 to-rose-500' },
  { name: 'Purple Haze', value: 'from-purple-500 to-indigo-600' },
  { name: 'Ocean Breeze', value: 'from-cyan-400 to-blue-600' },
  { name: 'Rose Gold', value: 'from-pink-500 to-rose-600' },
  { name: 'Aurora Forest', value: 'from-teal-400 to-indigo-600' }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Board Creator States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDesc, setBoardDesc] = useState('');
  const [selectedColor, setSelectedColor] = useState(GRADIENT_PRESETS[1].value);
  const [creatingBoard, setCreatingBoard] = useState(false);

  // Motivational Message
  const [motivation, setMotivation] = useState(MOTIVATIONAL_MESSAGES[0]);

  const fetchSummary = async () => {
    try {
      const res = await dashboardApi.getSummary();
      setSummary(res.data);
    } catch (e) {
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const randomQuote = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    setMotivation(randomQuote);
  }, []);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle.trim()) {
      showToast('Board title is required', 'error');
      return;
    }

    setCreatingBoard(true);
    try {
      const res = await boardApi.create({
        title: boardTitle,
        description: boardDesc,
        color: selectedColor
      });
      showToast(`Board "${res.data.title}" created!`, 'success');
      setShowCreateModal(false);
      setBoardTitle('');
      setBoardDesc('');
      fetchSummary(); // Refresh list & counts
      navigate(`/boards/${res.data.id}`);
    } catch (err) {
      showToast('Failed to create board', 'error');
    } finally {
      setCreatingBoard(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Formatting chart data safely
  const statusChartData = summary ? Object.entries(summary.taskStatusCounts).map(([name, value]) => ({
    name,
    value
  })) : [];

  const priorityChartData = summary ? Object.entries(summary.taskPriorityCounts).map(([name, value]) => ({
    name,
    value
  })) : [];

  // Recharts colors
  const STATUS_COLORS = {
    'To Do': '#818CF8',      // Indigo
    'In Progress': '#F59E0B',// Orange/Yellow
    'Review': '#22D3EE',     // Cyan
    'Done': '#10B981'        // Emerald
  };

  const PRIORITY_COLORS = {
    'LOW': '#10B981',
    'MEDIUM': '#F59E0B',
    'HIGH': '#EF4444'
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-brand-500/10 dark:border-slate-800 bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-xl shadow-premium premium-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <Sparkles className="w-6 h-6 text-indigo-500 animate-bounce" />
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Let's make today incredibly creative and focused.
          </p>
        </div>

        {/* Motivational Productivity Message */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-50/50 dark:bg-[#1e1b4b]/20 border border-brand-100/50 dark:border-brand-950/20 max-w-sm">
          <BrainCircuit className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 italic">
              "{motivation.text}"
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">
              — {motivation.author}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks */}
        <div className="glass-panel rounded-2xl p-6 flex items-center gap-5 border border-slate-200/50 dark:border-slate-800/50 hover:shadow-premium-hover smooth-all group">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Tasks
            </span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary?.totalTasks || 0}
            </span>
          </div>
        </div>

        {/* In Progress */}
        <div className="glass-panel rounded-2xl p-6 flex items-center gap-5 border border-slate-200/50 dark:border-slate-800/50 hover:shadow-premium-hover smooth-all group">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              In Progress
            </span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary?.inProgressTasks || 0}
            </span>
          </div>
        </div>

        {/* Completed */}
        <div className="glass-panel rounded-2xl p-6 flex items-center gap-5 border border-slate-200/50 dark:border-slate-800/50 hover:shadow-premium-hover smooth-all group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Completed
            </span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary?.completedTasks || 0}
            </span>
          </div>
        </div>

        {/* Overdue */}
        <div className="glass-panel rounded-2xl p-6 flex items-center gap-5 border border-slate-200/50 dark:border-slate-800/50 hover:shadow-premium-hover smooth-all group">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overdue Tasks
            </span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary?.overdueTasks || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Doughnut Chart of Column Status */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Task Status Distribution
            </h3>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              By Columns
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            {statusChartData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#818CF8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400 dark:text-slate-500 space-y-2">
                <p className="text-sm italic">No tasks created yet</p>
                <p className="text-xs">Create columns and add tasks to populate charts</p>
              </div>
            )}
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Task Priority Analysis
            </h3>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Urgency level
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            {priorityChartData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityChartData}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {priorityChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] || '#F59E0B'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400 dark:text-slate-500 space-y-2">
                <p className="text-sm italic">No priority metrics yet</p>
                <p className="text-xs">Task urgency ranges from low, medium to high</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Boards Section (Show recent boards and a visual Create Board card) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              My Workspaces / Boards
            </h2>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-premium hover:shadow-premium-hover"
          >
            <Plus className="w-4 h-4" />
            New Workspace
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Create Board Trigger Card */}
          <div
            onClick={() => setShowCreateModal(true)}
            className="group cursor-pointer rounded-2xl p-6 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-400 flex flex-col items-center justify-center text-center space-y-3 min-h-[160px] smooth-all bg-white/10"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-500 group-hover:text-white text-slate-400 dark:text-slate-500 flex items-center justify-center transition-all duration-300">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                Create a Board
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Initially contains To Do, In Progress, Review, Done
              </p>
            </div>
          </div>

          {/* Active Boards List */}
          {summary?.recentBoards && summary.recentBoards.map((board) => (
            <div
              key={board.id}
              onClick={() => navigate(`/boards/${board.id}`)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-[#131b2e] hover:shadow-premium-hover hover:-translate-y-1 smooth-all"
            >
              {/* Gradient Banner Accent top */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${board.color || 'from-purple-500 to-indigo-500'}`} />

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-base text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 smooth-all line-clamp-1">
                    {board.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 smooth-all" />
                </div>

                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 line-clamp-2 min-h-[32px]">
                  {board.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Workspace Active</span>
                  </div>
                  <span className="uppercase font-extrabold text-brand-600 dark:text-brand-400">View Board</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Create Board Popup Dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-8 border border-white/20 shadow-premium-hover animate-slide-in relative">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
              Launch new <span className="gradient-text">Board</span>
            </h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
              Establish a new board to map tasks, assignees and custom label metrics.
            </p>

            <form onSubmit={handleCreateBoard} className="space-y-6">

              {/* Board Title Input */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                  Board Title
                </label>
                <input
                  type="text"
                  required
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-semibold focus:border-brand-500 dark:focus:border-brand-400 bg-transparent"
                />
              </div>

              {/* Board Description Area */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                  Description
                </label>
                <textarea
                  value={boardDesc}
                  onChange={(e) => setBoardDesc(e.target.value)}
                  placeholder="Summarize board objectives, milestones and goals"
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-semibold focus:border-brand-500 dark:focus:border-brand-400 bg-transparent resize-none"
                />
              </div>

              {/* Gradient Palette Selection */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 pl-1">
                  Gradient Palette Accent
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setSelectedColor(preset.value)}
                      className={`h-11 rounded-xl bg-gradient-to-r ${preset.value} transition-all relative ${
                        selectedColor === preset.value
                          ? 'ring-4 ring-offset-2 ring-brand-500 scale-105'
                          : 'hover:scale-105'
                      }`}
                      title={preset.name}
                    >
                      {selectedColor === preset.value && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingBoard}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition-all shadow-premium disabled:bg-brand-400"
                >
                  {creatingBoard ? 'Launching...' : 'Launch Board'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
