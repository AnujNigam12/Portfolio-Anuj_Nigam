const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    field: {
      type: String,
      default: '',
    },
    startYear: {
      type: String,
      required: [true, 'Start year is required'],
    },
    endYear: {
      type: String,
      default: 'Present',
    },
    description: {
      type: String,
      default: '',
    },
    // Grade value: a CGPA (0-10) or a percentage (0-100), depending on gradeType
    cgpa: {
      type: String,
      default: '',
    },
    gradeType: {
      type: String,
      enum: ['CGPA', 'Percentage'],
      default: 'CGPA',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Education', educationSchema);
