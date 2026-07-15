import { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Sparkles,
  Moon,
  Sun,
  Compass
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setNewConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !newPassword || !confirmPassword) {
      showToast('All password fields are required', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      showToast('Password updated successfully (demonstration)', 'success');
      setPassword('');
      setNewPassword('');
      setNewConfirmPassword('');
    }, 1500);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          My <span className="gradient-text">Profile</span>
        </h1>
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
          Manage your personal account settings, preferences, and user interface options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Card: Summary Avatar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-premium text-center relative overflow-hidden group">
            {/* Ambient accent banner */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-600 to-indigo-600" />

            <div className="space-y-4 pt-4">
              {/* Initials avatar circle */}
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-brand-500 via-indigo-500 to-cyan-500 text-white flex items-center justify-center font-black text-2xl shadow-premium border border-white/20 select-none">
                {getInitials(user?.name)}
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-white leading-tight">
                  {user?.name}
                </h3>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                  Active Workspace Member
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Account
              </div>

              {/* General account details */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-left">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider">Workspaces</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">Standard Cloud</span>
                </div>
              </div>

            </div>
          </div>

          {/* Theme Preferences card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-premium space-y-4">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-500" />
              Theme Settings
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Toggle the user interface to dark theme for night-time clarity, or light theme for standard workspace brightness.
            </p>

            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#131b2e]/30 hover:bg-slate-100 dark:hover:bg-[#1e293b]/50 smooth-all"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <>
                    <Moon className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-300">Dark Mode Active</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-700">Light Mode Active</span>
                  </>
                )}
              </div>
              <span className="text-[10px] font-extrabold uppercase text-indigo-500 dark:text-brand-400">Toggle</span>
            </button>
          </div>

        </div>

        {/* Right Card: Settings Forms */}
        <div className="lg:col-span-2 space-y-8">

          {/* Account Details card */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-premium space-y-6">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-500" />
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">
                General Profile Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    disabled
                    value={user?.name || ''}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-100/50 dark:bg-slate-800/20 text-xs font-bold text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-100/50 dark:bg-slate-800/20 text-xs font-bold text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>

            <p className="text-[10px] font-bold text-indigo-500 flex items-center gap-1.5 pl-1 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Profile changes are locked in cloud environment
            </p>
          </div>

          {/* Change Password Card */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-premium">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">
                Update Workspace Password
              </h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                {/* Current Password */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-xs font-semibold outline-none focus:border-brand-500 text-slate-800 dark:text-white"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-xs font-semibold outline-none focus:border-brand-500 text-slate-800 dark:text-white"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-xs font-semibold outline-none focus:border-brand-500 text-slate-800 dark:text-white"
                  />
                </div>

              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:bg-brand-400 text-white text-xs font-bold transition-all shadow-premium"
                >
                  {updating ? 'Updating Password...' : 'Save New Password'}
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
