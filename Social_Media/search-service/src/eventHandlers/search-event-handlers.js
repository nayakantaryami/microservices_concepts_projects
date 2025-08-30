
const Search = require("../models/Search");
const logger = require("../utils/logger");

async function handlePostCreated(event){
    try {
        const newSearchPost=new Search({
            postId:event.postId,
            userId:event.userId,
            content:event.content,
            createdAt:event.createdAt
        })

        await newSearchPost.save();

        logger.info(`Search post created : ${event.postId}, ${newSearchPost._id.toString()}`)
    } catch (err) {
        logger.error("Error handling the post creating consume event",err)
    }
}

async function handlePostDeleted(event){
    try {
        await Search.findOneAndDelete({postId:event.postId});
        logger.info(`Search Post deleted : ${event.postId}`)
    } catch (err) {
                logger.error("Error handling the post creating consume event",err)

    }
}

module.exports={handlePostCreated,handlePostDeleted}