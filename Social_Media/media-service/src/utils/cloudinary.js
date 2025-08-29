const cloudinary = require("cloudinary").v2;
const logger = require("./logger");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadMediaToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          logger.error("Error while uploading media to cloudinary", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(file.buffer);
  });
};


const deleteMediaFromCloudinary=async (publicId)=>{
  try {
    const result=await cloudinary.uploader.destroy(publicId)
    logger.info("Media deleted successfully from cloudstorage",publicId);
    return result
  } catch (err) {
    logger.error("Error in deleting media from cloud",err);
    throw err
  }
}

module.exports={uploadMediaToCloudinary,deleteMediaFromCloudinary}