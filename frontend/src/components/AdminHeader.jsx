import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ExternalLink, UserCheck, Menu } from 'lucide-react';
import { useAdminNav } from '../layouts/AdminLayout';
import { Link } from 'react-router-dom';

const AdminHeader = ({ title }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { setOpen } = useAdminNav();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
        <h1 className="text-lg sm:text-2xl font-bold truncate text-gray-900 dark:text-white">{title}</h1>
        <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
          Welcome back, {user?.name || 'Administrator'}
        </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-1.5 p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Public Site</span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2.5 sm:p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-gray-900 dark:text-white">{user?.name}</span>
            <span className="block text-[10px] text-gray-400">{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
