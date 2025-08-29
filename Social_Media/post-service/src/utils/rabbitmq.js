const amqp = require("amqplib");
const logger = require("./logger");

let connection = null;
let channel = null;

const EXCHANGE_NAME = "social_media_events";

async function connectRabbitmq() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
    logger.info("Connected to RabbitMq");
    return channel;
  } catch (err) {
    logger.error("Error connecting to RabbitMQ", err);
  }
}

async function publishEvent(routingKey,message){
  if(!channel){
    await connectRabbitmq();
  }
  channel.publish(EXCHANGE_NAME,routingKey,Buffer.from(JSON.stringify(message)));
  logger.info(`Event published: ${routingKey}`)
}

module.exports = { connectRabbitmq,publishEvent };
