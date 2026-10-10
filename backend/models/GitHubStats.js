const mongoose = require('mongoose');

const gitHubStatsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    totalRepos: {
      type: Number,
      default: 0,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    totalForks: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    languages: [
      {
        name: String,
        count: Number,
      },
    ],
    topRepos: [
      {
        name: String,
        description: String,
        htmlUrl: String,
        stars: Number,
        forks: Number,
        language: String,
        updatedAt: String,
      },
    ],
    lastSynced: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GitHubStats', gitHubStatsSchema);
