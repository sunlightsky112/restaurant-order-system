const redis = require('redis');

let client;

async function connectRedis() {
  client = redis.createClient({ url: process.env.REDIS_URL });

  client.on('error', (err) => console.error('Redis Client Error', err));

  await client.connect();
  console.log('Connected to Redis');
}

function getRedis() {
  return client;
}

module.exports = { connectRedis, getRedis };
