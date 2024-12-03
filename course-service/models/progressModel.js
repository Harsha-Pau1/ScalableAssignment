const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'User ID is required'], // Ensures userId is provided
    },
    courseId: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Course ID is required'], // Ensures courseId is provided
    },
    progressPercentage: {
      type: Number,
      default: 0, // Progress percentage
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware to set completed to true if progressPercentage is 100%
progressSchema.pre('save', function (next) {
  if (this.progressPercentage >= 100) {
    this.completed = true;
  } else {
    this.completed = false;
  }
  next();
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;