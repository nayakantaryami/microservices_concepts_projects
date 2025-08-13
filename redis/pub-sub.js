//pub/sub->
// ->publisher will send message to a channel
// subscriber will consume these messages

const redis = require("redis");
const client = redis.createClient({
  host: "localhost",
  port: "6379",
});

client.on("error", (error) => {
  console.log("redis Error occured", error);
});

async function testFeatures() {
  try {
    await client.connect();

    // const subscriber=client.duplicate();
    // await subscriber.connect();

    // await subscriber.subscribe('channel',(msg)=>{
    //     console.log(`Received message: ${msg}`);

    // });

    // client.publish('channel', 'Hello, Redis!');
    // client.publish('channel', 'This is a test message.');

    // //publish message to dummy-client

    // await client .publish('dummy-channel',"some dummy data from publisher");
    // await client .publish('dummy-channel','some new message is being sent to subscriber from publisher');

    // await new Promise.resolve((resolve)=>setTimeout(resolve, 1000));

    // await subscriber.unsubscribe('dummy-channel');
    // await subscriber.quit();

    // //pipeline and transaction
    // const multi=client.multi();
    // multi.set('key-transaction-1', 'value1');
    // multi.set('key-transaction-2', 'value2');
    // multi.set('key-transaction-3', 'value3');
    // multi.get('key-transaction-1');
    // const res= await multi.exec();
    // console.log(res);
    // //multi.exec() will execute all the commands in the pipeline atomically

    //  const pipeline=client.multi();
    // pipeline.set('key-pipeline-1', 'value1');
    // pipeline.set('key-pipeline-2', 'value2');
    // pipeline.get('key-pipeline-1');
    // pipeline.get('key-pipeline-2');
    // const pipelineRes= await pipeline.exec();
    // console.log(pipelineRes);

    // //batch data operations
    // const pipelineOne=client.multi();

    // for(let i=0;i<100;i++){
    //     pipelineOne.set(`key-${i}`, `value-${i}`);
    // }
    // // console.log(await pipelineOne.exec());

    // const multi = client.multi();
    // multi.set("key1", "value1");
    // multi.incr("counter");
    // multi.incr("counter");

    // console.log(await multi.exec());

    // const dummyexample=client.multi();
    // dummyexample.decrBy('balance',100);
    // dummyexample.incrBy('balance',200);
    // dummyexample.get('balance');

    //  const finalresult=await dummyexample.exec();
    //  console.log(finalresult);

    //  await client.del('balance');
     
    //another example of using in real life cartsystem
    // const cartexample=client.multi();
    // await client.hSet('account:1234','item_count',5);
    // await client.hSet('account:1234','price',100);

    // console.log(await client.hGetAll('account:1234'));
    
    // cartexample.hIncrBy('account:1234','item_count',1);
    // cartexample.hIncrBy('account:1234','price',-10);
    // const cartresult=await cartexample.exec();
    // console.log(cartresult);



    //testing time and performance
    console.log("Performance test");

    console.time("without pipeline");
    for(let i=0;i<100;i++){
        await client.set(`user ${i}`, `value ${i}`);    
    }
    console.timeEnd("without pipeline");


    console.time("with pipeline");
    const Pipeline=client.multi();
    for(let i=0;i<100;i++){
         Pipeline.set(`user_pipeline ${i}`, `value_pipeline ${i}`);
    }
    await Pipeline.exec();
    console.timeEnd("with pipeline")

  } catch (err) {
    console.error(err);
  } finally {
    client.quit();
  }
}
testFeatures();
