const cron = require('node-cron');
const { syncGitHubData } = require('../services/githubService');
const { syncLeetCodeData } = require('../services/leetcodeService');

const initCronJobs = () => {
  console.log('[Cron Jobs] Initializing scheduled background tasks...');

  // Sync GitHub stats every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('[Cron] Running scheduled GitHub sync...');
    try {
      await syncGitHubData();
      console.log('[Cron] GitHub sync completed successfully.');
    } catch (err) {
      console.error('[Cron] GitHub sync error:', err.message);
    }
  });

  // Sync LeetCode stats every 12 hours
  cron.schedule('0 */12 * * *', async () => {
    console.log('[Cron] Running scheduled LeetCode sync...');
    try {
      await syncLeetCodeData();
      console.log('[Cron] LeetCode sync completed successfully.');
    } catch (err) {
      console.error('[Cron] LeetCode sync error:', err.message);
    }
  });
};

module.exports = { initCronJobs };
