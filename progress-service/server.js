const express = require("express");
const mongoose = require("mongoose");
const progressRoutes = require("./routes/progressRoutes");
require('dotenv').config();
require('../course-service/models/courseModel');
require('../user-service/models/userModel');
require('./models/progressModel');

const app = express();

// MongoDB connection
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Progress Service connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));


// Log database connection status
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB successfully');
});

mongoose.connection.on('error', (err) => {
  console.error(`Failed to connect to MongoDB: ${err.message}`);
});



// Middleware
app.use(express.json());
// Routes
app.use("/api", progressRoutes);

// Start server
app.listen(5003, () => {
  console.log("Progress Service running on port 5003");
});
