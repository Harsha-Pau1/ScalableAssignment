const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'], // Required field with custom error message
      minlength: [3, 'Course title must be at least 3 characters long'], // Minimum length validation
      maxlength: [100, 'Course title must not exceed 100 characters'], // Maximum length validation
    },
    description: {
      type: String,
      required: [true, 'Course description is required'], // Required field with custom error message
    },
    instructor: {
      type: mongoose.Schema.Types.Mixed
    },
    duration: {
      type: Number,
      required: [true, 'Course duration is required'], // Duration must be provided
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.Mixed
      },
    ],
    thumbnail: {
      type: String,
    },
    language: {
      type: String,
      required: [true, 'Course language is required'], // Required field
      enum: {
        values: ['English', 'Spanish', 'French', 'German', 'Chinese'],
        message: 'Language must be one of: English, Spanish, French, German, Chinese',
      },
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;