const mongoose = require('mongoose');

const syncLogSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ['github', 'leetcode'],
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      required: true,
    },
    recordsUpdated: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      default: '',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SyncLog', syncLogSchema);
