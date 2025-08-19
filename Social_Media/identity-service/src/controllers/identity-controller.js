const User = require("../models/User");
const generateTokens = require("../utils/generateToken");
const logger = require("../utils/logger"); // Import the logger utility
const { validateRegistration } = require("../utils/validation"); // Import validation utility

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
    if(user){
        logger.warn("User already exists");
        return res.status(400).json({
            success: false,
            message: "User already exists",
        });
    }

    user=new User({username,email,password});
    await user.save();
    logger.warn("User registered successfully",user._id);

    const {accessToken,refreshToken}=await generateTokens(user);
    return res.status(201).json({
        success:true,
        message:"User registered successfully",
        data:{
            accessToken,
            refreshToken
        }
    })

  } catch (e) {
    logger.error("Error registering user", { error: e.message });
    res.status(500).json({
        success:false,
        message:"Internal server error"
    })
  }
};

//user login

//refresh token

//logout


module.exports={registerUser}