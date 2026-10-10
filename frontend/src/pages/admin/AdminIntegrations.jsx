import React, { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import API from '../../services/api';
import { Github, Code2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminIntegrations = () => {
  const [githubSyncing, setGithubSyncing] = useState(false);
  const [leetcodeSyncing, setLeetcodeSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleGitHubSync = async () => {
    setGithubSyncing(true);
    setStatusMsg('');
    try {
      const res = await API.post('/admin/sync/github');
      if (res.data.success) {
        setStatusMsg('GitHub data successfully synchronized and cached!');
      }
    } catch (err) {
      setStatusMsg(`GitHub sync error: ${err.response?.data?.message || err.message}`);
    } finally {
      setGithubSyncing(false);
    }
  };

  const handleLeetCodeSync = async () => {
    setLeetcodeSyncing(true);
    setStatusMsg('');
    try {
      const res = await API.post('/admin/sync/leetcode');
      if (res.data.success) {
        setStatusMsg('LeetCode data successfully synchronized and cached!');
      }
    } catch (err) {
      setStatusMsg(`LeetCode sync error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLeetcodeSyncing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader title="Integrations & Sync" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold flex items-center justify-between">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg('')} className="text-xs hover:underline">Dismiss</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gray-800 text-white">
                <Github className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">GitHub API</h3>
                <p className="text-xs text-gray-500">Syncs public repos, stars, forks & top languages</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              Synchronizes public repositories and aggregate metrics from GitHub into MongoDB. Background cron job runs every 6 hours automatically.
            </p>

            <button
              onClick={handleGitHubSync}
              disabled={githubSyncing}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${githubSyncing ? 'animate-spin' : ''}`} />
              <span>{githubSyncing ? 'Synchronizing GitHub...' : 'Trigger GitHub Sync Now'}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Code2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">LeetCode API</h3>
                <p className="text-xs text-gray-500">Syncs total solved, easy, medium, hard counts</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              Fetches public statistics from LeetCode data sources into MongoDB. Background cron job runs every 12 hours automatically.
            </p>

            <button
              onClick={handleLeetCodeSync}
              disabled={leetcodeSyncing}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${leetcodeSyncing ? 'animate-spin' : ''}`} />
              <span>{leetcodeSyncing ? 'Synchronizing LeetCode...' : 'Trigger LeetCode Sync Now'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminIntegrations;
