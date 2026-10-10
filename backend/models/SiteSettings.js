const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Anuj Nigam',
    },
    headline: {
      type: String,
      default: 'MERN Stack Developer | Full Stack Web Developer',
    },
    bio: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: 'anujnig.07@gmail.com',
    },
    phone: {
      type: String,
      default: '+91 9140499809',
    },
    location: {
      type: String,
      default: 'Lucknow, Uttar Pradesh, India',
    },
    githubUrl: {
      type: String,
      default: 'https://github.com/AnujNigam12',
    },
    githubUsername: {
      type: String,
      default: 'AnujNigam12',
    },
    linkedinUrl: {
      type: String,
      default: 'https://www.linkedin.com/in/anuj-nigam-715107277/',
    },
    leetcodeUsername: {
      type: String,
      default: 'AnujNigam12',
    },
    resumeUrl: {
      type: String,
      default: 'https://drive.google.com',
    },
    profileImageUrl: {
      type: String,
      default: '',
    },
    heroTitle: {
      type: String,
      default: 'Anuj Nigam',
    },
    heroSubtitle: {
      type: String,
      default: 'MERN Stack & Full Stack Web Developer',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
