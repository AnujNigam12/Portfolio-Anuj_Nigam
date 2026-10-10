import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  MessageSquare,
  RefreshCw,
  FileSpreadsheet,
  Settings,
  LogOut,
  Code2,
  X,
} from 'lucide-react';

const AdminSidebar = ({ open = false, onClose = () => {} }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Skills', path: '/admin/skills', icon: Cpu },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Education', path: '/admin/education', icon: GraduationCap },
    { name: 'Certifications', path: '/admin/certifications', icon: Award },
    { name: 'Achievements', path: '/admin/achievements', icon: Trophy },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Integrations', path: '/admin/integrations', icon: RefreshCw },
    { name: 'Sync Logs', path: '/admin/sync-logs', icon: FileSpreadsheet },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 max-w-[85vw] bg-gray-900 border-r border-gray-800 flex flex-col justify-between h-screen transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto lg:shrink-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div>
        <div className="p-5 lg:p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-extrabold text-white text-base tracking-wide">Admin Portal</h2>
            <p className="text-xs text-gray-400">Portfolio CMS</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
