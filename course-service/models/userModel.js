const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    // Personal Details
    name: {
      type: String,
      required: [true, 'Name is required'], // Ensure name is provided
      trim: true, // Automatically removes leading and trailing whitespaces
      minlength: [3, 'Name must be at least 3 characters long'], // Minimum length of name
      maxlength: [50, 'Name must be less than or equal to 50 characters'], // Maximum length of name
    },

    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'], // Username length check
      maxlength: [30, 'Username must be less than or equal to 30 characters'], // Username length check
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores'], // Regex to allow only alphanumeric and underscores
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Ensure the email is unique
      trim: true,
      lowercase: true, // Ensure email is always stored in lowercase
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'], // Regular expression for valid email format
    },
    password: {
      type: String,
      required: function () {
        // Only required if the document is being created
        return this.isNew;
      },
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "Student"],
      default: "Student",
    },
    completedCourses: [{
      type: mongoose.Schema.Types.Mixed
    }],
    contactNumber: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid contact number'], // Basic regex to validate phone numbers
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address must be less than or equal to 200 characters'], // Limit address length
    },
    coursesEnrolled: [{
      type: mongoose.Schema.Types.Mixed
    }],
  },

  { timestamps: true }
);



// Method to generate auth token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET, // Replace with a strong secret key
    { expiresIn: '1h' }
  );
  return token;
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  return user;
};

// Method to update password
userSchema.methods.updatePassword = async function(newPassword) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(newPassword, salt);
  await this.save();
};

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model("User", userSchema);

module.exports = User;
