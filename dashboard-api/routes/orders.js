const express = require("express");
const router = express.Router();
const {
  getRecentOrders,
  getOrderDetails,
  getDailyAggregates,
  getMostPopularItems,
  getOrderVolumeOverTime,
} = require("../services/queries");

const { cacheWrapper } = require("../utils/cache");

/**
 * * Orders API Routes without cache
 */
// router.get('/recent/:restaurantId', async (req, res) => {
//   const data = await getRecentOrders(req.params.restaurantId);
//   res.json(data);
// });

// router.get('/:restaurantId/:orderId', async (req, res) => {
//   const data = await getOrderDetails(req.params.restaurantId, req.params.orderId);
//   res.json(data);
// });

// router.get('/daily-aggregates/:restaurantId', async (req, res) => {
//   const data = await getDailyAggregates(req.params.restaurantId);
//   res.json(data[0] || { total_orders: 0, total_revenue: 0 });
// });

// router.get('/popular-items', async (req, res) => {
//   const { start, end } = req.query;
//   const data = await getMostPopularItems(start, end);
//   res.json(data);
// });

// router.get('/volume', async (req, res) => {
//   const { start, end } = req.query;
//   const data = await getOrderVolumeOverTime(start, end);
//   res.json(data);
// });

// using Redis for caching recent orders
// router.get('/recent/:restaurantId', async (req, res) => {
//   const redis = getRedis();
//   const key = `recent_orders:${req.params.restaurantId}`;

//   const cached = await redis.get(key);
//   if (cached) return res.json(JSON.parse(cached));

//   const data = await getRecentOrders(req.params.restaurantId);
//   await redis.setEx(key, 60, JSON.stringify(data)); // cache 60 seconds
//   res.json(data);
// });





/**
 * * Orders API Routes with cache (Redis)
 */

// 1. Get Recent Orders: Input - restaurant_id; Output - list of latest orders.
router.get("/recent/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  const data = await cacheWrapper(
    `recent_orders:${restaurantId}`,
    60, // 1 minute
    () => getRecentOrders(restaurantId)
  );
  res.json(data);
});

// 2. Get Order Details: Input - order_id, restaurant_id; Output - full order info. (no cache recommended — real-time details)
router.get("/:restaurantId/:orderId", async (req, res) => {
  const data = await getOrderDetails(
    req.params.restaurantId,
    req.params.orderId
  );
  res.json(data);
});

// 3. Get Daily Aggregates: Input - restaurant_id; Output - total orders and revenue for the day.
router.get("/daily-aggregates/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  const data = await cacheWrapper(
    `daily_aggregates:${restaurantId}`,
    30, // 30 seconds
    () => getDailyAggregates(restaurantId)
  );
  res.json(data[0] || { total_orders: 0, total_revenue: 0 });
});

// 4. Get Most Popular Items: Input - date range; Output - top items by quantity.
router.get("/popular-items", async (req, res) => {
  const { start, end } = req.query;
  const key = `popular_items:${start}:${end}`;
  const data = await cacheWrapper(
    key,
    300, // 5 minutes
    () => getMostPopularItems(start, end)
  );
  res.json(data);
});

// 5. Get Order Volume Over Time: Input - date range; Output - time-series data.
router.get("/volume", async (req, res) => {
  const { start, end } = req.query;
  const key = `volume_over_time:${start}:${end}`;
  const data = await cacheWrapper(
    key,
    300, // 5 minutes
    () => getOrderVolumeOverTime(start, end)
  );
  res.json(data);
});

module.exports = router;
