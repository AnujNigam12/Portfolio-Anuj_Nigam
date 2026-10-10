const Project = require('../models/Project');
const { isConfigured, uploadImage, deleteImage } = require('../config/cloudinary');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const Achievement = require('../models/Achievement');
const Message = require('../models/Message');
const SyncLog = require('../models/SyncLog');
const SiteSettings = require('../models/SiteSettings');
const GitHubStats = require('../models/GitHubStats');
const LeetCodeStats = require('../models/LeetCodeStats');
const { syncGitHubData } = require('../services/githubService');
const { syncLeetCodeData } = require('../services/leetcodeService');

// Dashboard metrics
const getDashboardMetrics = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalExperience = await Experience.countDocuments();
    const unreadMessages = await Message.countDocuments({ status: 'unread' });
    const githubStats = await GitHubStats.findOne();
    const leetcodeStats = await LeetCodeStats.findOne();

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalSkills,
        totalExperience,
        unreadMessages,
        github: githubStats,
        leetcode: leetcodeStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Projects CRUD
// Project requests may be JSON or multipart/form-data (when an image is attached).
// The image fields are owned by the server: clients only send a file ("image") or removeImage=true.
const parseProjectBody = (body) => {
  const data = { ...body };
  delete data.imageUrl;
  delete data.imagePublicId;
  delete data.removeImage;

  if (typeof data.technologies === 'string') {
    try {
      const parsed = JSON.parse(data.technologies);
      data.technologies = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      data.technologies = data.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }
  if (typeof data.featured === 'string') data.featured = data.featured === 'true';
  if (typeof data.order === 'string') data.order = Number(data.order) || 0;
  return data;
};

const toClientProject = (doc) => {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj.imagePublicId;
  return obj;
};

const wantsImageRemoved = (body) => body.removeImage === true || body.removeImage === 'true';

const createProject = async (req, res) => {
  let uploaded = null;
  try {
    const data = parseProjectBody(req.body);
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (req.file) {
      if (!isConfigured()) {
        return res.status(500).json({
          success: false,
          message: 'Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.',
        });
      }
      uploaded = await uploadImage(req.file.buffer);
      data.imageUrl = uploaded.url;
      data.imagePublicId = uploaded.publicId;
    }

    const project = await Project.create(data);
    res.status(201).json({ success: true, data: toClientProject(project) });
  } catch (error) {
    if (uploaded) await deleteImage(uploaded.publicId); // don't leave an orphaned upload behind
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  let uploaded = null;
  try {
    const project = await Project.findById(req.params.id).select('+imagePublicId');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const data = parseProjectBody(req.body);
    const oldPublicId = project.imagePublicId;
    const removeImage = wantsImageRemoved(req.body);

    if (req.file) {
      if (!isConfigured()) {
        return res.status(500).json({
          success: false,
          message: 'Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.',
        });
      }
      uploaded = await uploadImage(req.file.buffer);
      data.imageUrl = uploaded.url;
      data.imagePublicId = uploaded.publicId;
    } else if (removeImage) {
      data.imageUrl = '';
      data.imagePublicId = '';
    }

    project.set(data);
    await project.save();

    // Only after the DB save succeeded, remove the replaced / removed image from Cloudinary
    if ((uploaded || removeImage) && oldPublicId) await deleteImage(oldPublicId);

    res.status(200).json({ success: true, data: toClientProject(project) });
  } catch (error) {
    if (uploaded) await deleteImage(uploaded.publicId);
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).select('+imagePublicId');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const publicId = project.imagePublicId;
    await project.deleteOne();
    await deleteImage(publicId);
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Skills CRUD
const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.status(200).json({ success: true, data: skill });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.status(200).json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Experience CRUD
const createExperience = async (req, res) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json({ success: true, data: exp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.status(200).json({ success: true, data: exp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.status(200).json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Education CRUD
// Grade is either a CGPA (0-10) or a Percentage (0-100). Returns an error message, or '' if fine.
const normalizeGrade = (body, gradeType) => {
  if (body.cgpa === undefined || body.cgpa === null) return '';
  const raw = String(body.cgpa).trim().replace(/%$/, '');
  body.cgpa = raw;
  if (raw === '') return '';
  const value = Number(raw);
  const max = gradeType === 'Percentage' ? 100 : 10;
  if (Number.isNaN(value) || value < 0 || value > max) {
    return gradeType === 'Percentage'
      ? 'Percentage must be a number between 0 and 100'
      : 'CGPA must be a number between 0 and 10';
  }
  return '';
};

const createEducation = async (req, res) => {
  try {
    const gradeError = normalizeGrade(req.body, req.body.gradeType || 'CGPA');
    if (gradeError) return res.status(400).json({ success: false, message: gradeError });
    const edu = await Education.create(req.body);
    res.status(201).json({ success: true, data: edu });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateEducation = async (req, res) => {
  try {
    let gradeType = req.body.gradeType;
    if (!gradeType) {
      const existing = await Education.findById(req.params.id);
      gradeType = existing?.gradeType || 'CGPA';
    }
    const gradeError = normalizeGrade(req.body, gradeType);
    if (gradeError) return res.status(400).json({ success: false, message: gradeError });
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!edu) return res.status(404).json({ success: false, message: 'Education entry not found' });
    res.status(200).json({ success: true, data: edu });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const edu = await Education.findByIdAndDelete(req.params.id);
    if (!edu) return res.status(404).json({ success: false, message: 'Education entry not found' });
    res.status(200).json({ success: true, message: 'Education deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Certifications CRUD
const createCertification = async (req, res) => {
  try {
    const cert = await Certification.create(req.body);
    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCertification = async (req, res) => {
  try {
    const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cert) return res.status(404).json({ success: false, message: 'Certification not found' });
    res.status(200).json({ success: true, data: cert });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCertification = async (req, res) => {
  try {
    const cert = await Certification.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certification not found' });
    res.status(200).json({ success: true, message: 'Certification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Achievements CRUD
const createAchievement = async (req, res) => {
  try {
    const ach = await Achievement.create(req.body);
    res.status(201).json({ success: true, data: ach });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const ach = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ach) return res.status(404).json({ success: false, message: 'Achievement not found' });
    res.status(200).json({ success: true, data: ach });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const ach = await Achievement.findByIdAndDelete(req.params.id);
    if (!ach) return res.status(404).json({ success: false, message: 'Achievement not found' });
    res.status(200).json({ success: true, message: 'Achievement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Messages Management
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markMessageRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Manual Sync Triggers
const triggerGitHubSync = async (req, res) => {
  try {
    const stats = await syncGitHubData();
    res.status(200).json({
      success: true,
      message: 'GitHub statistics synchronized successfully.',
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const triggerLeetCodeSync = async (req, res) => {
  try {
    const stats = await syncLeetCodeData();
    res.status(200).json({
      success: true,
      message: 'LeetCode statistics synchronized successfully.',
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sync Logs
const getSyncLogs = async (req, res) => {
  try {
    const logs = await SyncLog.find().sort({ startedAt: -1 }).limit(50);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Site Settings Update
const updateSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    // Trigger background sync for GitHub and LeetCode with new usernames/URLs asynchronously
    syncGitHubData().catch((err) => console.warn('[Settings Update] Auto GitHub sync warning:', err.message));
    syncLeetCodeData().catch((err) => console.warn('[Settings Update] Auto LeetCode sync warning:', err.message));

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
