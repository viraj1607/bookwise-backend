const express = require("express");
const router = express.Router();
const Post = require("../models/Posts");

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
    // console.log(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts." });
    // console.log(err)
  }
});

router.post("/posts", async (req, res) => {
  const { user, uid, content } = req.body;

  console.log(req.body);
  if (!user || !uid || !content) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newPost = new Post({ user, uid, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post." });
    // console.log(err);
  }
});

router.post("/posts/:postId/comments", async (req, res) => {
  const { user, text } = req.body;
  const { postId } = req.params;

  if (!user || !text) {
    return res.status(400).json({ message: "User and text are required" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user, comment:text });
    await post.save();

    res.status(200).json(post.comments); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment" });
  }
});

router.post("/posts/:postId/like", async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.includes(uid);

    if (liked) {
      post.likes = post.likes.filter((id) => id !== uid);
    } else {
      post.likes.push(uid);
    }

    await post.save();
    res.status(200).json(post.likes); 
  } catch (err) {
    res.status(500).json({ message: "Error toggling like" });
  }
}); 

module.exports = router;
