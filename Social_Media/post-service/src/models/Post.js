const mongoose =require("mongoose");

const postSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    content:{
       type:String,
       required:true,
    
    },
    mediaIds:[
        {
            type:String
        }
    ]
},
{timestamps:true});

//we will be having a different service for search
//so indexing is not necessary 
postSchema.index({content:'text'})

const Post=mongoose.model('Post',postSchema);
module.exports=Post