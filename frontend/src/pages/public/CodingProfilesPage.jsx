import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Github, Code2, ExternalLink, Star, GitFork, BookOpen, Trophy } from 'lucide-react';

const CodingProfilesPage = () => {
  const [githubStats, setGithubStats] = useState(null);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ghRes, lcRes] = await Promise.allSettled([
          API.get('/github'),
          API.get('/leetcode'),
        ]);

        if (ghRes.status === 'fulfilled' && ghRes.value.data.success) setGithubStats(ghRes.value.data.data);
        if (lcRes.status === 'fulfilled' && lcRes.value.data.success) setLeetcodeStats(lcRes.value.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Coding <span className="gradient-text">Profiles</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Live statistics automatically synchronized from GitHub and LeetCode.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GitHub Detailed Card */}
        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-gray-800 text-white">
                <Github className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">GitHub Activity</h2>
                <p className="text-xs text-gray-400">@{githubStats?.username || 'AnujNigam12'}</p>
              </div>
            </div>
            <a
              href={`https://github.com/${githubStats?.username || 'AnujNigam12'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <span>View GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800/60">
              <BookOpen className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">{githubStats?.totalRepos || 0}</span>
              <span className="text-xs text-gray-500 font-medium">Public Repos</span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800/60">
              <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">{githubStats?.totalStars || 0}</span>
              <span className="text-xs text-gray-500 font-medium">Stars</span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800/60">
              <GitFork className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">{githubStats?.totalForks || 0}</span>
              <span className="text-xs text-gray-500 font-medium">Forks</span>
            </div>
          </div>

          {githubStats?.topRepos?.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Highlighted Repositories</h3>
              <div className="space-y-3">
                {githubStats.topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{repo.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{repo.description || 'No description provided'}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-400">
                      <span>{repo.language}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{repo.stars}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LeetCode Detailed Card */}
        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Code2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">LeetCode Metrics</h2>
                <p className="text-xs text-gray-400">@{leetcodeStats?.username || 'AnujNigam12'}</p>
              </div>
            </div>
            <a
              href={`https://leetcode.com/${leetcodeStats?.username || 'AnujNigam12'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <span>View LeetCode</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 text-center space-y-2">
            <span className="block text-5xl font-black text-amber-500">{leetcodeStats?.totalSolved || 0}</span>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest block">
              Total Problems Solved
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-500">Easy ({leetcodeStats?.easySolved || 0})</span>
                <span className="text-gray-400">Easy Category</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-500">Medium ({leetcodeStats?.mediumSolved || 0})</span>
                <span className="text-gray-400">Medium Category</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-rose-500">Hard ({leetcodeStats?.hardSolved || 0})</span>
                <span className="text-gray-400">Hard Category</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingProfilesPage;
