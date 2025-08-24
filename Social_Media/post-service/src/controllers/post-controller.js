const Post = require("../models/Post");
const logger = require("../utils/logger");
const { validateCreatePosts } = require("../utils/validation");
const createPost = async (req, res) => {
  logger.info("Create Post Api end point hit");
  try {
    //validate the schema
    const { error } = validateCreatePosts(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { content, mediaIds } = req.body;
    const newPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });
    await newPost.save();
    logger.info("Post created successfully", newPost);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (err) {
    logger.error("Error in creating Post", err);
    res.status(500).json({
      success: false,
      message: "Error in creating Posts",
    });
  }
};

const getPost = async (req, res) => {
  try {
  } catch (err) {
    logger.error("Error in getting Post", err);
    res.status(500).json({
      success: false,
      message: "Error in getting Posts",
    });
  }
};

const deletePost = async (req, res) => {
  try {
  } catch (err) {
    logger.error("Error in deleting Post", err);
    res.status(500).json({
      success: false,
      message: "Error in deleting Posts",
    });
  }
};

module.exports = { createPost };
