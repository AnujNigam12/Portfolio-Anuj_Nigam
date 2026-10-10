const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { uploadProjectImage } = require('../middleware/upload');
const {
  getDashboardMetrics,
  createProject,
  updateProject,
  deleteProject,
  createSkill,
  updateSkill,
  deleteSkill,
  createExperience,
  updateExperience,
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation,
  createCertification,
  updateCertification,
  deleteCertification,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getMessages,
  markMessageRead,
  deleteMessage,
  triggerGitHubSync,
  triggerLeetCodeSync,
  getSyncLogs,
  updateSiteSettings,
} = require('../controllers/adminController');

// All routes require protection and admin role
router.use(protect);
router.use(admin);

// Dashboard metrics
router.get('/metrics', getDashboardMetrics);

// Projects
router.post('/projects', uploadProjectImage, createProject);
router.put('/projects/:id', uploadProjectImage, updateProject);
router.delete('/projects/:id', deleteProject);

// Skills
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Experience
router.post('/experience', createExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

// Education
router.post('/education', createEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Certifications
router.post('/certifications', createCertification);
router.put('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);

// Achievements
router.post('/achievements', createAchievement);
router.put('/achievements/:id', updateAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Messages
router.get('/messages', getMessages);
router.put('/messages/:id/read', markMessageRead);
router.delete('/messages/:id', deleteMessage);

// Sync
router.post('/sync/github', triggerGitHubSync);
router.post('/sync/leetcode', triggerLeetCodeSync);
router.get('/sync-logs', getSyncLogs);

// Settings
router.put('/settings', updateSiteSettings);

module.exports = router;
