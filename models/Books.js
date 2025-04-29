const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  summary: String,
  rating: Number,
});

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: [String], default: [] },
    comments: [
      {
        user: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { _id: false } // optional: prevents Mongoose from creating a separate `_id` for each post
);

const user = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  bookList: [bookSchema],
  postList: [postSchema],
});

module.exports = mongoose.model("User", user);
