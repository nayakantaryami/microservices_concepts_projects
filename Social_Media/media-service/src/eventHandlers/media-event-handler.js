const Media = require("../models/Media")
const { deleteMediaFromCloudinary } = require("../utils/cloudinary")
const logger = require("../utils/logger")

const handlePostDeleted=async(event)=>{
    console.log(event,"events consumed on deletion")
    const {postId,mediaIds}=event
    try {
        const mediaToDelete=await Media.find({_id:{$in:mediaIds}});
        for(const media of mediaToDelete){
            await deleteMediaFromCloudinary(media.publicId);
            await Media.findByIdAndDelete(media._id);

            logger.info(`Delted Media ${media._id} associated with the delted post ${postId}`);
        }

        logger.info(`completed deletion of media for postId : ${postId} `)
    } catch (err) {
        logger.error("error occur while media deltetion ")
    }
}
module.exports={handlePostDeleted}