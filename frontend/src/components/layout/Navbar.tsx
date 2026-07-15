import { Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  collapsed: boolean;
  setMobileOpen: (val: boolean) => void;
}

export default function Navbar({ collapsed, setMobileOpen }: NavbarProps) {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className={`fixed top-0 right-0 left-0 z-10 transition-all duration-300 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 h-16 ${collapsed ? 'md:left-20' : 'md:left-64'}`}>
      <div className="flex items-center justify-between h-full px-6">

        {/* Left: Mobile hamburger & welcome */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <span className="text-xl font-bold">☰</span>
          </button>

          <div className="hidden sm:flex items-center gap-2.5 bg-indigo-50 dark:bg-indigo-950/25 border border-indigo-100/50 dark:border-indigo-900/30 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">FlowBoard Workspace v1.0</span>
          </div>
        </div>

        {/* Right: Notifications & User profile avatar */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#0b0f19]" />
          </button>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

          {user && (
            <div className="flex items-center gap-3.5 pl-1">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {user.name}
                </span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {user.email}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-indigo-500 to-cyan-500 text-white flex items-center justify-center font-extrabold text-sm shadow-premium select-none border border-white/20">
                {getInitials(user.name)}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
