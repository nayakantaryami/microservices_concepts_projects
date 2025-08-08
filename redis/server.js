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

async function testRedisConnection() {
  try {
    await client.connect();
    console.log("connected to Redis server");

    await client.set("name", "Antaryami");

    const extractValue = await client.get("name");
    console.log(extractValue);

    const deleteCount = await client.del("name");
    console.log(deleteCount);

    const extractUpdatedValue = await client.get("name");
    console.log(extractUpdatedValue);

    await client.set("count", "100");
    const incrementCount = await client.incr("count");
    console.log(incrementCount);

    const decrementCount = await client.decr("count");
    console.log(decrementCount);
  } catch (error) {
    console.error(error);
  } finally {
    //sometimes connection remain open so close them
    await client.quit();
  }
}
testRedisConnection();
