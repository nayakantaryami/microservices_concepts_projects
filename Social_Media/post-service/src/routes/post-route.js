const { createPost, getAllPosts, getPost, deletePost } = require("../controllers/post-controller");
const {authenticateRequest}=require("../middleware/authMiddleware");
const { create } = require("../models/Post");
const express=require("express");
const router=express.Router();

router.use(authenticateRequest);

router.post('/create-post',createPost);
router.get('/all-posts',getAllPosts)
router.get('/:id',getPost);
router.delete('/:id',deletePost);
module.exports=router;
