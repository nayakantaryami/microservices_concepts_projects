//in the project we will be using io redis library
//because it has more feature and scalable
const Redis = require("ioredis");
//it is a redis client library for nodejs
//it provides a more powerful and flexible API compared to the built-in redis library

const redis = new Redis({
  host: "localhost",
  port: 6379,
});
async function testdemo() {
  try {
    await redis.set("key", "value");

    const val = await redis.get("key");
    console.log(val);
  } catch (error) {
    console.error(error);
  } finally {
    redis.quit();
  }
}
testdemo();
