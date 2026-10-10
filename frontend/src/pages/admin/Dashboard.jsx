import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  FolderGit2,
  Cpu,
  Briefcase,
  MessageSquare,
  Github,
  Code2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubSyncing, setGithubSyncing] = useState(false);
  const [leetcodeSyncing, setLeetcodeSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  const fetchMetrics = async () => {
    try {
      const res = await API.get('/admin/metrics');
      if (res.data.success) {
        setMetrics(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSyncGitHub = async () => {
    setGithubSyncing(true);
    setSyncStatusMsg('');
    try {
      const res = await API.post('/admin/sync/github');
      if (res.data.success) {
        setSyncStatusMsg('GitHub synchronized successfully!');
        fetchMetrics();
      }
    } catch (err) {
      setSyncStatusMsg(`GitHub sync error: ${err.response?.data?.message || err.message}`);
    } finally {
      setGithubSyncing(false);
    }
  };

  const handleSyncLeetCode = async () => {
    setLeetcodeSyncing(true);
    setSyncStatusMsg('');
    try {
      const res = await API.post('/admin/sync/leetcode');
      if (res.data.success) {
        setSyncStatusMsg('LeetCode synchronized successfully!');
        fetchMetrics();
      }
    } catch (err) {
      setSyncStatusMsg(`LeetCode sync error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLeetcodeSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    { name: 'Total Projects', value: metrics?.totalProjects || 0, icon: FolderGit2, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Total Skills', value: metrics?.totalSkills || 0, icon: Cpu, color: 'text-indigo-500 bg-indigo-500/10' },
    { name: 'Experience Entries', value: metrics?.totalExperience || 0, icon: Briefcase, color: 'text-purple-500 bg-purple-500/10' },
    { name: 'Unread Messages', value: metrics?.unreadMessages || 0, icon: MessageSquare, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'GitHub Repositories', value: metrics?.github?.totalRepos || 0, icon: Github, color: 'text-gray-400 bg-gray-800' },
    { name: 'LeetCode Solved', value: metrics?.leetcode?.totalSolved || 0, icon: Code2, color: 'text-amber-500 bg-amber-500/10' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader title="Executive Overview" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 overflow-y-auto">
        {syncStatusMsg && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold flex items-center justify-between">
            <span>{syncStatusMsg}</span>
            <button onClick={() => setSyncStatusMsg('')} className="text-xs hover:underline">Dismiss</button>
          </div>
        )}

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.name}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex items-center justify-between shadow-sm"
              >
                <div>
                  <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {card.name}
                  </span>
                  <span className="block text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                    {card.value}
                  </span>
                </div>
                <div className={`p-4 rounded-2xl ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* INTEGRATION CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* GitHub Integration Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gray-800 text-white">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">GitHub Integration</h3>
                  <p className="text-xs text-gray-500">
                    Last synced: {metrics?.github?.lastSynced ? new Date(metrics.github.lastSynced).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSyncGitHub}
                disabled={githubSyncing}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${githubSyncing ? 'animate-spin' : ''}`} />
                <span>{githubSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <span className="block font-bold text-lg text-gray-900 dark:text-white">{metrics?.github?.totalRepos || 0}</span>
                <span className="text-gray-500">Repos</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <span className="block font-bold text-lg text-gray-900 dark:text-white">{metrics?.github?.totalStars || 0}</span>
                <span className="text-gray-500">Stars</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <span className="block font-bold text-lg text-gray-900 dark:text-white">{metrics?.github?.totalForks || 0}</span>
                <span className="text-gray-500">Forks</span>
              </div>
            </div>
          </div>

          {/* LeetCode Integration Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">LeetCode Integration</h3>
                  <p className="text-xs text-gray-500">
                    Last synced: {metrics?.leetcode?.lastSynced ? new Date(metrics.leetcode.lastSynced).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSyncLeetCode}
                disabled={leetcodeSyncing}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center gap-2 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${leetcodeSyncing ? 'animate-spin' : ''}`} />
                <span>{leetcodeSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <span className="block font-bold text-lg text-amber-500">{metrics?.leetcode?.totalSolved || 0}</span>
                <span className="text-gray-500">Total</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                <span className="block font-bold text-lg">{metrics?.leetcode?.easySolved || 0}</span>
                <span className="text-gray-500">Easy</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                <span className="block font-bold text-lg">{metrics?.leetcode?.mediumSolved || 0}</span>
                <span className="text-gray-500">Medium</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
                <span className="block font-bold text-lg">{metrics?.leetcode?.hardSolved || 0}</span>
                <span className="text-gray-500">Hard</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
