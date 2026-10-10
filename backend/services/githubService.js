const axios = require('axios');
const GitHubStats = require('../models/GitHubStats');
const SyncLog = require('../models/SyncLog');
const SiteSettings = require('../models/SiteSettings');

const extractGitHubUsername = (urlOrUsername) => {
  if (!urlOrUsername) return '';
  const trimmed = urlOrUsername.trim();
  if (trimmed.includes('github.com')) {
    const parts = trimmed.replace(/\/$/, '').split('/');
    return parts[parts.length - 1];
  }
  return trimmed.replace(/^@/, '');
};

const syncGitHubData = async (usernameOverride) => {
  const startedAt = new Date();
  let username = usernameOverride;

  if (!username) {
    const settings = await SiteSettings.findOne();
    if (settings) {
      username = settings.githubUsername || extractGitHubUsername(settings.githubUrl);
    }
  }

  if (!username) {
    username = process.env.GITHUB_USERNAME || 'AnujNigam12';
  }

  username = extractGitHubUsername(username);

  try {
    const headers = {
      'User-Agent': 'Portfolio-App',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const userRes = await axios.get(`https://api.github.com/users/${username}`, {
      headers,
      timeout: 10000,
    });
    const user = userRes.data;

    const reposRes = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers, timeout: 10000 }
    );
    const repos = reposRes.data || [];

    let totalStars = 0;
    let totalForks = 0;
    const languageCounts = {};

    const topRepos = repos
      .map((repo) => {
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;

        if (repo.language) {
          languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        }

        return {
          name: repo.name,
          description: repo.description || '',
          htmlUrl: repo.html_url,
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          language: repo.language || 'Code',
          updatedAt: repo.updated_at,
        };
      })
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 6);

    const languages = Object.keys(languageCounts).map((name) => ({
      name,
      count: languageCounts[name],
    }));

    const statsData = {
      username,
      totalRepos: user.public_repos || repos.length,
      totalStars,
      totalForks,
      followers: user.followers || 0,
      following: user.following || 0,
      avatarUrl: user.avatar_url || '',
      bio: user.bio || '',
      languages,
      topRepos,
      lastSynced: new Date(),
    };

    await GitHubStats.deleteMany({});
    const stats = await GitHubStats.create(statsData);

    await SyncLog.create({
      source: 'github',
      status: 'success',
      recordsUpdated: repos.length,
      message: `Successfully synchronized ${repos.length} GitHub repositories for ${username}.`,
      startedAt,
      completedAt: new Date(),
    });

    return stats;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;

    await SyncLog.create({
      source: 'github',
      status: 'failed',
      recordsUpdated: 0,
      message: `Failed to sync GitHub data for ${username}: ${errorMsg}`,
      startedAt,
      completedAt: new Date(),
    });

    throw new Error(`GitHub sync failed for user '${username}': ${errorMsg}`);
  }
};

module.exports = { syncGitHubData };
