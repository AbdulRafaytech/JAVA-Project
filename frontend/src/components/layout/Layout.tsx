import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b13] text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* Decorative ambient glowing circles */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[150px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-pink-500/5 dark:bg-pink-500/5 blur-[120px] pointer-events-none" />

      {/* Responsive Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Container */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 pt-16 ${collapsed ? 'md:pl-20' : 'md:pl-64'}`}>

        {/* Top Navbar */}
        <Navbar
          collapsed={collapsed}
          setMobileOpen={setMobileOpen}
        />

        {/* Content Outlet Section */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
