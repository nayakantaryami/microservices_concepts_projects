const { createPost } = require("../controllers/post-controller");
const {authenticateRequest}=require("../middleware/authMiddleware");
const { create } = require("../models/Post");
const express=require("express");
const router=express.Router();

router.use(authenticateRequest);

router.post('/create-post',createPost);
module.exports=router;
