const express = require("express");
const router = express.Router();
const User = require("../models/Books");

// POST: Add a post to user's postList
router.post("/add-post", async (req, res) => {
  const { uid, content } = req.body;

  if (!uid || !content) {
    return res.status(400).json({ message: "UID and content are required." });
  }

  const newPost = {
    content,
    createdAt: new Date(),
    likes: 0,
    comments: [],
  };

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { $push: { postList: newPost } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({
        message: "Post added successfully",
        postList: updatedUser.postList,
      });
  } catch (err) {
    console.error("Error adding post:", err);
    res.status(500).json({ message: "Failed to add post." });
  }
});

// GET: Fetch all posts of a user
router.get("/posts/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user.postList);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch user posts." });
  }
});

module.exports = router;
