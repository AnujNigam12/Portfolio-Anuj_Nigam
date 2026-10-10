const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  getProjects,
  getProjectById,
  getSkills,
  getExperience,
  getEducation,
  getCertifications,
  getAchievements,
  getGitHubStats,
  getLeetCodeStats,
  getSiteSettings,
  postContact,
} = require('../controllers/publicController');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 contact requests per windowMs
  message: {
    success: false,
    message: 'Too many contact messages sent from this IP, please try again after 15 minutes.',
  },
});

router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.get('/skills', getSkills);
router.get('/experience', getExperience);
router.get('/education', getEducation);
router.get('/certifications', getCertifications);
router.get('/achievements', getAchievements);
router.get('/github', getGitHubStats);
router.get('/leetcode', getLeetCodeStats);
router.get('/settings', getSiteSettings);
router.post('/contact', contactLimiter, postContact);

module.exports = router;
