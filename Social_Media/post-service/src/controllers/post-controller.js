const Post = require("../models/Post");
const invalidateCache = require("../utils/invalidateCache");
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
    //removing the stale data in the cache as we are adding new data to out database
    await invalidateCache(req,newPost._id.toString());

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
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey);
    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    
    const totalNoOfPosts=await Post.countDocuments();

    const result={
      posts,
      currentPage:page,
      totalPages:Math.ceil(totalNoOfPosts/limit),
      totalPosts:totalNoOfPosts
    }


    //save your posts in redis cache 
    //set key with expiry time here it is 300second of expiry time
    await req.redisClient.setex(cacheKey,300,JSON.stringify(result));

    res.json(result);


  } catch (err) {
    logger.error("Error in getting Post", err);
    res.status(500).json({
      success: false,
      message: "Error in getting Posts",
    });
  }
};

const getPost = async (req, res) => {
  try {
    const postId=req.params.id;
    const cacheKey=`posts:${postId}`;
    const cachedPost=await req.redisClient.get(cacheKey);
    if(cachedPost){
      return res.json(JSON.parse(cachedPost));
    }
    const singlePostDetails=await Post.findById(postId)
    if(!singlePostDetails){
      return res.status(404).json({
        success:false,
        message:"Post not found"
      })
    }
    await req.redisClient.setex(cacheKey,3600,JSON.stringify(singlePostDetails));
    res.json(singlePostDetails);

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
    const postId=req.params.id;
    const postToDelete=await Post.findById(postId);
    if(!postToDelete){
      logger.warn("Post not found");
      return res.status(404).json({
        success:false,
        message:"Post not found"
      })
    }

    if(req.user._id!==postToDelete.toString(user)){
      logger.warn("Unauthorized Access as user is not owner of post");
      return res.status(404).json({
        success:false,
        message:"Unauthorized User trying to access"
      })
    }

    await Post.deleteOne({_id:postId});
    await invalidateCache(req,postId);
    logger.info("Post deleted successfully");
    res.json({
      success:true,
      message:"Post deleted successfully"
    })
  } catch (err) {
    logger.error("Error in deleting Post", err);
    res.status(500).json({
      success: false,
      message: "Error in deleting Posts",
    });
  }
};

module.exports = { createPost ,getAllPosts,getPost,deletePost};
