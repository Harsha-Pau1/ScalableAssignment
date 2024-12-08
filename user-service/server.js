const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

require("dotenv").config();

require("./models/userModel");
require("./models/progressModel");
require("./models/courseModel.js");

const app = express();

// MongoDB connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("User Service connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Log database connection status
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully");
});

mongoose.connection.on("error", (err) => {
  console.error(`Failed to connect to MongoDB: ${err.message}`);
});

app.use(cors());
// Middleware
app.use(express.json());

// Routes
app.use("/api", userRoutes);

// Start server
app.listen(5001, () => {
  console.log("User Service running on port 5001");
});
