const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    uid: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: [String], default: [] }, 
    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
