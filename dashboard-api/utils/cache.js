const { getRedis } = require('../services/redis');

async function cacheWrapper(key, ttlSeconds, fetchFn) {
  const redis = getRedis();
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetchFn();
  await redis.setEx(key, ttlSeconds, JSON.stringify(data));
  return data;
}

module.exports = { cacheWrapper };
