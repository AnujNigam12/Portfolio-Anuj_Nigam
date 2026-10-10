const axios = require('axios');
const LeetCodeStats = require('../models/LeetCodeStats');
const SyncLog = require('../models/SyncLog');
const SiteSettings = require('../models/SiteSettings');

const syncLeetCodeData = async (usernameOverride) => {
  const startedAt = new Date();
  let username = usernameOverride;

  if (!username) {
    const settings = await SiteSettings.findOne();
    if (settings && settings.leetcodeUsername) {
      username = settings.leetcodeUsername;
    }
  }

  if (!username) {
    username = process.env.LEETCODE_USERNAME || 'AnujNigam12';
  }

  username = username.trim().replace(/^@/, '');

  let statsData = {
    username,
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    acceptanceRate: 0,
    contestRating: 0,
    ranking: 0,
    totalQuestions: 3000,
    lastSynced: new Date(),
  };

  let fetched = false;
  let fetchMessage = '';

  // Method 1: Official LeetCode GraphQL API
  try {
    const query = `
      query userProblemsSolved($username: String!) {
        matchedUser(username: $username) {
          username
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
            reputation
          }
        }
      }
    `;

    const res = await axios.post(
      'https://leetcode.com/graphql',
      { query, variables: { username } },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Referer: `https://leetcode.com/${username}/`,
        },
        timeout: 8000,
      }
    );

    if (res.data && res.data.data && res.data.data.matchedUser) {
      const user = res.data.data.matchedUser;
      const submissionStats = user.submitStatsGlobal?.acSubmissionNum || [];

      statsData.totalSolved = submissionStats.find((s) => s.difficulty === 'All')?.count || 0;
      statsData.easySolved = submissionStats.find((s) => s.difficulty === 'Easy')?.count || 0;
      statsData.mediumSolved = submissionStats.find((s) => s.difficulty === 'Medium')?.count || 0;
      statsData.hardSolved = submissionStats.find((s) => s.difficulty === 'Hard')?.count || 0;
      statsData.ranking = user.profile?.ranking || 0;

      fetched = true;
      fetchMessage = `Fetched directly via official LeetCode GraphQL. Total solved: ${statsData.totalSolved}.`;
    }
  } catch (graphQLErr) {
    console.warn(`[LeetCode Service] Official GraphQL failed for ${username}: ${graphQLErr.message}`);
  }

  // Method 2: Public Proxy Fallback (FaisalShohag)
  if (!fetched) {
    try {
      const primaryUrl = process.env.LEETCODE_DATA_SOURCE || 'https://leetcode-api-faisalshohag.vercel.app';
      const res = await axios.get(`${primaryUrl}/${username}`, { timeout: 8000 });
      if (res.data && (res.data.totalSolved !== undefined || res.data.solvedProblem !== undefined)) {
        statsData.totalSolved = res.data.totalSolved || res.data.solvedProblem || 0;
        statsData.easySolved = res.data.easySolved || res.data.easySolvedCount || 0;
        statsData.mediumSolved = res.data.mediumSolved || res.data.mediumSolvedCount || 0;
        statsData.hardSolved = res.data.hardSolved || res.data.hardSolvedCount || 0;
        statsData.acceptanceRate = res.data.acceptanceRate || 0;
        statsData.ranking = res.data.ranking || 0;
        fetched = true;
        fetchMessage = `Fetched via FaisalShohag LeetCode Proxy. Total solved: ${statsData.totalSolved}.`;
      }
    } catch (proxyErr) {
      console.warn(`[LeetCode Service] FaisalShohag proxy failed: ${proxyErr.message}`);
    }
  }

  // Method 3: Public Proxy Fallback (Alfa LeetCode API)
  if (!fetched) {
    try {
      const fallbackUrl = `https://alfa-leetcode-api.onrender.com/userProfile/${username}`;
      const res = await axios.get(fallbackUrl, { timeout: 8000 });
      if (res.data && res.data.totalSolved !== undefined) {
        statsData.totalSolved = res.data.totalSolved || 0;
        statsData.easySolved = res.data.easySolved || 0;
        statsData.mediumSolved = res.data.mediumSolved || 0;
        statsData.hardSolved = res.data.hardSolved || 0;
        statsData.ranking = res.data.ranking || 0;
        fetched = true;
        fetchMessage = `Fetched via Alfa LeetCode API. Total solved: ${statsData.totalSolved}.`;
      }
    } catch (alfaErr) {
      console.warn(`[LeetCode Service] Alfa proxy failed: ${alfaErr.message}`);
    }
  }

  // If user does not exist or APIs returned no user data, preserve existing database stats or initialize
  const existingStats = await LeetCodeStats.findOne({});
  if (!fetched && existingStats) {
    statsData.totalSolved = existingStats.totalSolved;
    statsData.easySolved = existingStats.easySolved;
    statsData.mediumSolved = existingStats.mediumSolved;
    statsData.hardSolved = existingStats.hardSolved;
    statsData.acceptanceRate = existingStats.acceptanceRate;
    statsData.ranking = existingStats.ranking;
  }

  await LeetCodeStats.deleteMany({});
  const stats = await LeetCodeStats.create(statsData);

  const logStatus = fetched ? 'success' : 'failed';
  const logMsg = fetched
    ? `Successfully synchronized LeetCode data for username '${username}'. ${fetchMessage}`
    : `Could not fetch LeetCode data for user '${username}'. Please verify the LeetCode username in Admin Settings.`;

  await SyncLog.create({
    source: 'leetcode',
    status: logStatus,
    recordsUpdated: fetched ? 1 : 0,
    message: logMsg,
    startedAt,
    completedAt: new Date(),
  });

  if (!fetched) {
    throw new Error(`LeetCode profile '${username}' was not found or public API was unreachable.`);
  }

  return stats;
};

module.exports = { syncLeetCodeData };
