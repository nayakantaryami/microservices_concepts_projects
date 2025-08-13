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

async function redisDataStructure() {
  try {
    await client.connect();
    // //string ->set,get,mset,mget
    // await client.set("user:name", "Antaryami Nayak");
    // const name = await client.get("user:name");
    // //mset means setting multiple value at once
    // console.log(name);

    // await client.mSet(["user:email", "nayak@gmail.com", "user:age", "53"]);
    // const [email, age] = await client.mGet(["user:email", "user:age"]);
    // console.log(email, age);

    //   //lists ->LPUSH push at begin,RPUSH push at end,LRANGE -->iterate,LPOP-->remove and return first element,RPOP-->remove and return the last element
    //  //LRange means when we want to get elements from a specific range
    //   await client.lPush('notes',['note1','note2','note3']);
    //   // await client.del('notes');
    //   const extractAllNotes=await client.lRange('notes',0,-1);//notes is the key, 0 is range from start , -1 is range till end
    //   console.log(extractAllNotes);
    //   const firstNote=await client.lPop('notes');
    //   console.log(firstNote);

    //   const updatednotes=await client.lRange('notes',0,-1);
    //   console.log(updatednotes);

    //   const deletednotes2=await client.rPop('notes');
    //   console.log(deletednotes2)

    //   //sets->SADD add an element from set
    //   //  SMembers->return all the element of set,
    //   //SisMember->if an element is member of set
    //   //Srem-> remove an element from set
    //  await client.sAdd('user:nickName',['aditya','radha','amit']);
    //  const nickNames=await client.sMembers('user:nickName');
    //  console.log(nickNames);

    //  //check if aditya is one of nickname
    //  const isAdityamember=await client.sIsMember('user:nickName','aditya');
    //  console.log(isAdityamember);//true if present else false

    //  //remove amit from nickname;
    //  await client.sRem('user:nickName','amit');
    //  console.log(await client.sMembers('user:nickName'));

    //  //sorted sets
    //  // here in each elements are associated with a score that determines order
    //  //ZAdd add elements with the score
    //  //ZRange to retrieve the elements with the given range
    //  //ZRank give rank or position in sorted set
    //  //ZRem remove element from set

    //  await client.zAdd('items',[{
    //   score:120,value:'laptop'
    //  },
    //  {score:150,value:'smartTv'},
    //  {score:80,value:'phone'}
    // ]);
    // const getItems=await client.zRange('items',0,-1);
    // console.log(getItems);

    // const getItemsWithScore=await client.zRangeWithScores('items',0,-1);
    // console.log(getItemsWithScore);

    // const getRank=await client.zRank('items','smartTv');
    // console.log(getRank);

    //hashes->just like maps
    //HSet -> set the value
    //Hget-> get the value
    //HGETALL-> get all the values
    // HDEL-> Delete the value

    //key name is product1
    await client.hSet("product1", {
      name: "product 1",
      description: "this is product 1",
      rating: "5",
    });
    const getRating = await client.hGet("product1", "rating");
    console.log(getRating);

    const getAllData = await client.hGetAll("product1");
    console.log(getAllData);

    await client.hDel("product1", "rating");
    console.log(await client.hGetAll("product1"));

    
  } catch (e) {
    console.error(e);
  } finally {
    client.quit();
  }
}
redisDataStructure();
