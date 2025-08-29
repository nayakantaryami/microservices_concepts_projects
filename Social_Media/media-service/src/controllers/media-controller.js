const Media = require("../models/Media");
const { uploadMediaToCloudinary } = require("../utils/cloudinary");
const logger = require("../utils/logger");
const uploadMedia = async (req, res) => {
  logger.info("Starting media Upload");
  try {
    if (!req.file) {
      logger.error("No file found .Please add a file and try again");
      return res.status(400).json({
        success: false,
        message: "NO file found . Plead add a file and try again",
      });
    }
    // console.log("file", req.file);
    const { originalname, mimetype, buffer } = req.file;
    const userId = req.user.userId;

    logger.info(`File details: name=${originalname}, type=${mimetype}`);
    logger.info(" uploading to cloudinary starting");

    const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file);
    logger.info(
      `Cloudinary upload successful. public Id: - ${cloudinaryUploadResult.public_id}`
    );

    const newlyCreatedMedia = new Media({
      publicId: cloudinaryUploadResult.public_id,
      originalName:originalname,
      mimeType:mimetype,
      url: cloudinaryUploadResult.secure_url,
      userId,
    });
    await newlyCreatedMedia.save();
    res.status(201).json({
      success: true,
      mediaId: newlyCreatedMedia._id,
      url: newlyCreatedMedia.url,
      message: "Media uploaded successfully",
    });
  } catch (err) {
    logger.info("error in uploading media",err) ;
    res.status(500).json({
      success:false,
      message:"Error in uploading media"
    })
  }
};

const getAllMedia=async (req,res)=>{
  try {
    const results=await Media.find({});
    return res.status(201).json({results});
  } catch (err) {
    logger.info("error in fetching media",err) ;
    res.status(500).json({
      success:false,
      message:"Error in fetching media"
    })
  }
}
module.exports={uploadMedia,getAllMedia}
