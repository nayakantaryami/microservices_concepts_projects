const { error } = require("winston");
const User = require("../models/User");
const generateTokens = require("../utils/generateToken");
const logger = require("../utils/logger"); // Import the logger utility
const { validateRegistration, validateLogin } = require("../utils/validation"); // Import validation utility
const RefreshToken = require("../models/RefreshToken");

//user registration

const registerUser = async (req, res) => {
  logger.info("Registering user", { username: req.body.username });
  try {
    //validate the schema
    const { error } = validateRegistration(req.body);
    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password, username } = req.body;
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      logger.warn("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = new User({ username, email, password });
    await user.save();
    logger.warn("User registered successfully", user._id);

    const { accessToken, refreshToken } = await generateTokens(user);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (e) {
    logger.error("Error registering user", { error: e.message });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//user login
const loginUser = async (req, res) => {
  logger.info("Login user Api end point hit");
  try {
    const { error } = validateLogin(req.body);

    if (error) {
      logger.warn("Validation Error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    //check if password is valid or not

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn("Invalid Password");
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    res.json({
      accessToken,
      refreshToken,
      userId: user._id,
    });
  } catch (err) {
    logger.error("Error logging in user", { error: err.message });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//refresh token
const refreshTokenController=async (req,res)=>{
  logger.info("refresh token controller end point hit");
  try {
    const {refreshToken}=req.body;
    if(!refreshToken){
      logger.warn("refresh Token Missing");
      return res.status(400).json({
        success:false,
        message:"Refresh token missing"
      });
    }
    const storedToken=await RefreshToken.findOne({token:refreshToken});
    if(!storedToken){
      logger.warn("Invalid refresh token provided");
      return res.status(400).json({
        success:false,
        message:"Invalid refresh token"
      })
    }
    if(storedToken.expiresAt < new Date()){
      logger.warn("Invalid or expired refresh token");
      return res.status(401).json({
        success:false,
        message:"Invalid or expired refresh token"
      })
    }
    const user=await User.findById(storedToken.user);
    if(!user){
      logger.warn("User not found");
      return res.status(401).json({
        success:false,
        message:"User not found"
      })
    }
    const {accessToken:newAccessToken, refreshToken:newRefreshToken}=await generateTokens(user);
    
    //delete the old refresh token 
    await RefreshToken.deleteOne({_id:storedToken._id});
    res.json({
      accessToken:newAccessToken,
      refreshToken:newRefreshToken
    })


  } catch (err) {
    logger.error("Refresh Token error occured",err);
    res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}

//logout

const logoutUser=async (req,res)=>{
  logger.info("Logout endpoint hit");
  try {
    const {refreshToken}=req.body;
    if(!refreshToken){
      logger.warn("Refresh token is missing");
      return res.status(400).json({
        success:false,
        message:"Refresh token is missing"
      })
    }

    await RefreshToken.deleteOne({token:refreshToken});
    logger.info("Refresh Topken deleted on logout");
    res.json({
      success:true,
      message:"Logout Successful, Refresh token deleted"
    })


  } catch (err) {
    logger.error("Error while logging out",err);
    res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}

module.exports = { registerUser,loginUser,refreshTokenController,logoutUser};
