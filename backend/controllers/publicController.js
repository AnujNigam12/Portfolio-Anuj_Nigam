const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const Achievement = require('../models/Achievement');
const Message = require('../models/Message');
const GitHubStats = require('../models/GitHubStats');
const LeetCodeStats = require('../models/LeetCodeStats');
const SiteSettings = require('../models/SiteSettings');
const { contactSchema } = require('../validators/schemas');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ featured: -1, order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single project by ID or Slug
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    let project = await Project.findOne({ slug: id });
    if (!project) {
      project = await Project.findById(id).catch(() => null);
    }
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all skills
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 });
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all experience
const getExperience = async (req, res) => {
  try {
    const experience = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all education
const getEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: education });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all certifications
const getCertifications = async (req, res) => {
  try {
    const certs = await Certification.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: certs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all achievements
const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: achievements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get GitHub stats from DB cache
const getGitHubStats = async (req, res) => {
  try {
    const stats = await GitHubStats.findOne().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: stats || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get LeetCode stats from DB cache
const getLeetCodeStats = async (req, res) => {
  try {
    const stats = await LeetCodeStats.findOne().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: stats || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get site settings
const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public contact endpoint
const postContact = async (req, res) => {
  try {
    const parseResult = contactSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.errors,
      });
    }

    const newMessage = await Message.create({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });

    // Send async email notification via Nodemailer (non-blocking)
    const { sendContactNotification } = require('../services/emailService');
    sendContactNotification({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    }).catch((err) => console.error('[Contact Controller] Email trigger error:', err));

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
