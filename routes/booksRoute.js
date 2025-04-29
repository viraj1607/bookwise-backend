const express = require("express");
const router = express.Router();
const User = require("../models/Books");



router.get("/:uid", async (req, res) => {
    const { uid } = req.params;
  
    try {
      const user = await User.findOne({ uid });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user.bookList);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error });
    }
  });

router.post("/register", async (req, res) => {
  const { uid } = req.body;

  if (!uid) return res.status(400).json({ error: "UID is required" });

  try {
    const userExists = await User.findOne({ uid });
    if (userExists) {
      return res.status(200).json({ message: "User already exists" });
    }

    const newUser = new User({ uid, bookList: [] });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered in MongoDB", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.post("/add-book", async (req, res) => {
  const { uid, newBook } = req.body;
  try {
    const updatedBook = await User.findOneAndUpdate(
      { uid },
      { $push: { bookList: newBook } },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Book added", bookList: updatedBook.bookList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
