const Progress = require("../models/progressModel");

// Create a new progress record
exports.createProgress = async (req, res) => {
  const { userId, courseId, progressPercentage, completed, lastAccessed } = req.body;
  try {
    // Check if a progress record already exists for the same user and course
    const existingProgress = await Progress.findOne({ userId, courseId });
    if (existingProgress) {
      return res.status(409).json({ message: "Progress record already exists for this user and course , Please update if want to update" });
    }

    // Create a new progress record
    const progress = new Progress({ userId, courseId, progressPercentage, completed, lastAccessed });
    await progress.save();
    res.status(201).send(progress);
  } catch (error) {

    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation failed", errors: errorMessages });
    }
    res.status(500).send("Error creating progress record", error);
  }
};

// Get progress for a specific user and course in increasing order of last accessed
exports.getProgress = async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const progress = await Progress.find({ userId, courseId }).sort({ lastAccessed: 1 });
    if (!progress || progress.length === 0) {
      return res.status(404).send("Progress not found");
    }
    res.status(200).send(progress);
  } catch (error) {
    res.status(500).send("Error fetching progress record", error);
  }
};

// Update progress
exports.updateProgress = async (req, res) => {
  const { userId, courseId } = req.params;
  const { progressPercentage, completed, lastAccessed } = req.body;
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId, courseId },
      { progressPercentage, completed, lastAccessed },
      { new: true, runValidators: true }
    );
    if (!progress) {
      return res.status(404).send("Progress not found");
    }
    res.status(201).send(progress);
  } catch (error) {
    res.status(500).send("Error updating progress record", error);
  }
};

// Delete progress
exports.deleteProgress = async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const progress = await Progress.deleteMany({ userId, courseId });
    if (!progress) {
      return res.status(404).send("Progress not found");
    }
    res.status(204).send("Progress deleted");
  } catch (error) {
    res.status(500).send("Error deleting progress record", error);
  }
};


// Get all progress records for a specific user with pagination
exports.getAllProgressForUser = async (req, res) => {
  const { userId } = req.params;
  
  const rawPage = req.query.page;
  const rawLimit = req.query.limit;

  if (rawPage && (isNaN(rawPage) || rawPage <= 0)) {
    return res.status(400).json({ message: 'Invalid page value. Page must be a positive integer.' });
  }
  if (rawLimit && (isNaN(rawLimit) || rawLimit <= 0)) {
    return res.status(400).json({ message: 'Invalid limit value. Limit must be a positive integer.' });
  }

  const page = parseInt(rawPage) || 1;
  const limit = parseInt(rawLimit) || 10;

  try {
    const progressRecords = await Progress.find({ userId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      

    const totalRecords = await Progress.countDocuments({ userId });

    res.status(200).json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      progressRecords,
    });
  } catch (error) {
    res.status(500).json({ message: `Error fetching progress records: ${error.message}` });
  }
};


// Get all progress records for a specific course with pagination
exports.getAllProgressForCourse = async (req, res) => {
  const { courseId } = req.params;
  const rawPage = req.query.page;
  const rawLimit = req.query.limit;

  if (rawPage && (isNaN(rawPage) || rawPage <= 0)) {
    return res.status(400).json({ message: 'Invalid page value. Page must be a positive integer.' });
  }
  if (rawLimit && (isNaN(rawLimit) || rawLimit <= 0)) {
    return res.status(400).json({ message: 'Invalid limit value. Limit must be a positive integer.' });
  }

  const page = parseInt(rawPage) || 1;
  const limit = parseInt(rawLimit) || 10;
  
  try {
    const progressRecords = await Progress.find({ courseId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalRecords = await Progress.countDocuments({ courseId });

    res.status(200).json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      progressRecords,
    });
  } catch (error) {
    res.status(500).json({ message: `Error fetching progress records: ${error.message}` });
  }
};