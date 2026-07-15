import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { authApi } from '../api/api';

export default function SignupPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (!name) {
      newErrors.name = 'Full name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await authApi.register({ name, email, password });
      showToast('Account created successfully! You can now log in.', 'success');
      navigate('/login');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Email is already taken. Please try another one.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-slate-50 dark:bg-[#070b13] overflow-hidden">

      {/* Mesh gradients for premium design */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-500/10 dark:bg-violet-500/15 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Unleash Your Productivity
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Create your <span className="gradient-text">FlowBoard</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Join thousands of teams working beautifully
          </p>
        </div>

        {/* Glassmorphism Auth Container */}
        <div className="glass-panel p-8 rounded-3xl premium-glow">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="John Doe"
                  className={`w-full pl-11 pr-4 py-3 border text-sm font-medium transition-all outline-none bg-slate-50/50 dark:bg-[#1e293b]/30 ${
                    errors.name
                      ? 'border-rose-500/50 focus:border-rose-500 ring-2 ring-rose-500/10'
                      : 'border-slate-200 dark:border-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-500 font-semibold mt-1.5 pl-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="name@company.com"
                  className={`w-full pl-11 pr-4 py-3 border text-sm font-medium transition-all outline-none bg-slate-50/50 dark:bg-[#1e293b]/30 ${
                    errors.email
                      ? 'border-rose-500/50 focus:border-rose-500 ring-2 ring-rose-500/10'
                      : 'border-slate-200 dark:border-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-semibold mt-1.5 pl-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 pl-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 border text-sm font-medium transition-all outline-none bg-slate-50/50 dark:bg-[#1e293b]/30 ${
                    errors.password
                      ? 'border-rose-500/50 focus:border-rose-500 ring-2 ring-rose-500/10'
                      : 'border-slate-200 dark:border-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-semibold mt-1.5 pl-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:bg-brand-400 text-white font-bold transition-all shadow-premium hover:shadow-premium-hover relative overflow-hidden group mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

          </form>

          {/* Prompt Login */}
          <div className="text-center mt-6">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
            </span>
            <Link
              to="/login"
              className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
