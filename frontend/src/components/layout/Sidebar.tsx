import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  Plus
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { boardApi } from '../../api/api';
import { Board } from '../../types';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    if (user) {
      boardApi.getAll()
        .then((res) => setBoards(res.data))
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: UserIcon },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0f172a] border-r border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
      {/* Brand Logo Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-premium">
            F
          </div>
          {!collapsed && (
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-200">
              FlowBoard
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        <div className="space-y-1.5">
          <p className={`text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-3 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? 'Core' : 'Workspace'}
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold smooth-all ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-l-4 border-brand-500'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1e293b]/50 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </div>

        {/* Dynamic Board Links */}
        <div className="space-y-1.5">
          <div className={`flex items-center justify-between mb-2 px-3 ${collapsed ? 'justify-center' : ''}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {collapsed ? 'Boards' : 'My Boards'}
            </p>
            {!collapsed && (
              <button
                onClick={() => navigate('/dashboard')}
                className="p-1 rounded bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/30 text-slate-400 hover:text-brand-500 transition-colors"
                title="Create a Board"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-[220px] overflow-y-auto">
            {boards.map((board) => (
              <NavLink
                key={board.id}
                to={`/boards/${board.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium smooth-all ${
                    isActive
                      ? 'bg-slate-100 dark:bg-[#1e293b] text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1e293b]/30'
                  }`
                }
              >
                <div className={`w-3.5 h-3.5 rounded-md bg-gradient-to-r ${board.color || 'from-purple-500 to-indigo-500'} flex-shrink-0`} />
                {!collapsed && <span className="truncate">{board.title}</span>}
              </NavLink>
            ))}
            {boards.length === 0 && !collapsed && (
              <p className="text-xs text-slate-400 dark:text-slate-500 px-3 italic py-2">
                No boards yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Themes & Logout */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1e293b]/50 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
        >
          {theme === 'dark' ? (
            <>
              <span className="text-amber-400">☀️</span>
              {!collapsed && <span>Switch to Light</span>}
            </>
          ) : (
            <>
              <span className="text-indigo-500">🌙</span>
              {!collapsed && <span>Switch to Dark</span>}
            </>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block h-screen fixed top-0 left-0 z-20 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          {/* Drawer Body */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-[#0f172a] focus:outline-none animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
