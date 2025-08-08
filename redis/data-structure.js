const redis = require("redis");

//create a client
const client = redis.createClient({
  host: "localhost", //redis server is hosted on local host
  port: 6379, //default port of redis server
});

//event listener
client.on("error", (error) => {
  console.log("Redis client error occured!", error);
});

async function redisDataStructure(){
try {
  await client.connect();
    //string ->set,get,mset,mget
    await client.set("user:name","Antaryami Nayak");
    const name=await client.get("user:name");
    //mset means setting multiple value at once
    console.log(name);

    await client.mSet(["user:email","nayak@gmail.com","user:age","53"]);
    const [email,age]=await client.mGet(["user:email","user:age"])
    console.log(email,age);

    //lists ->LPUSH push at begin,RPUSH push at begin,LRANGE,LPOP,RPOP
   //LRange means when we want to get elements from a specific range
    await client.lPush('notes',[])
    
} catch (e) {
    console.error(e);
}
finally{
    client.quit();
}
}
redisDataStructure();