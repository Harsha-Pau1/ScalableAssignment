const express = require("express");
const mongoose = require("mongoose");
const courseRoutes = require("./routes/courseRoutes");


require('./models/courseModel');
require('../user-service/models/userModel');
require('../progress-service/models/progressModel');

require('dotenv').config();
const app = express();

// MongoDB connection
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Course Service connected to MongoDB"))
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
app.use("/api", courseRoutes);

// Start server
app.listen(5002, () => {
  console.log("Course Service running on port 5002");
});
