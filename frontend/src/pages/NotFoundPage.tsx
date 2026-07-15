import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-[#070b13]">
      <div className="w-24 h-24 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 animate-bounce">
        <HelpCircle className="w-12 h-12" />
      </div>
      <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
        404
      </h1>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
        Lost in space?
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The page you are looking for doesn't exist, was renamed, or has drifted out of orbit. Let's get you back to your workspace.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all duration-200 shadow-premium hover:shadow-premium-hover"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
