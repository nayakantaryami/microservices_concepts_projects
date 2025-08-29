require('dotenv').config();
const express=require("express");
const mongoose=require("mongoose");
const Redis=require("ioredis");
const cors=require("cors");
const helmet=require("helmet");
const postRoutes=require("./routes/post-route");
const errorHandler=require("./middleware/errorHandler");
const logger=require("./utils/logger");
const connectDB=require("./config/connectDB");
const { connectRabbitmq } = require('./utils/rabbitmq');
const app=express();
const PORT=process.env.PORT|| 3002;

connectDB();

const redisClient=new Redis(process.env.REDIS_URL);

//middle ware 
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req,res,next)=>{
    logger.info(`received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
});
//**later work to do create a sensitive end points for post services like get post limit is 100 but create post is 10 

//routes-> pass the redis client to routes 

app.use('/api/posts',(req,res,next)=>{
    req.redisClient=redisClient
    next();
},postRoutes)

app.use(errorHandler);

async function startServer(){
    try {
        await connectRabbitmq();
        app.listen(PORT,()=>{
            logger.info(`post-server is running on port ${PORT}`)
        });
    } catch (err) {
       logger.error("failed to connect to server",err) 
       process.exit(1)
    }
}
startServer();
//unhandled promise rejection  for safety

process.on("unhandledRejection",(reason,promise)=>{
    logger.error(`Unhandled Rejection at :${promise} , reason: ${promise}`)
})