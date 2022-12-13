const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      lowercase: true,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: false,
    },
    description: {
      type: String,
    },
    avatar: {
      type: String,
    },
    works: {
      type: String,
    },
    skills: {
      type: String,
    },
    location: {
      type: String,
    },
    learning: {
      type: String,
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
    },
    reset_token: {
      type: String,
    },
    reset_token_ttl: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;
