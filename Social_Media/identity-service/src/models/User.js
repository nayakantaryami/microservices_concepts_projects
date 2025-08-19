const mongoose = require("mongoose");
const argon2 = require("argon2");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, //this will remove leading and trailing whitespace
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // about: {
    //   type: String,
    //   trim: true,
    // },
  },
  {
    timestamps: true,
  }
);

// The pre function is used to define middleware that executes before a specific event (like "save", "validate", "remove", etc.).
// In this case, pre("save", ...) lets you run custom logic (such as hashing a password) before the document is actually saved.
// This helps enforce security, validation, or other business rules automatically whenever a document is saved
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await argon2.hash(this.password);
    } catch (error) {
      return next(error);
    }
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    throw error;
  }
};

userSchema.index({ username: "text" });

const User = mongoose.model("User", userSchema);

module.exports = User;
