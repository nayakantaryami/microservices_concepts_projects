const invalidateCache=async (req,input)=>{
    const cachedKey=`posts:${input}`;
    await req.redisClient.del(cachedKey);

    const keys=await req.redisClient.keys("posts:*");
    if(keys.length>0){
        await req.redisClient.del(keys);
    }
}
module.exports=invalidateCache