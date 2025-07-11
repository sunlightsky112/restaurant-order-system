const express = require('express');
const router = express.Router();
const {
  getRecentOrders,
  getOrderDetails,
  getDailyAggregates,
  getMostPopularItems,
  getOrderVolumeOverTime
} = require('../services/queries');

router.get('/recent/:restaurantId', async (req, res) => {
  const data = await getRecentOrders(req.params.restaurantId);
  res.json(data);
});

router.get('/:restaurantId/:orderId', async (req, res) => {
  const data = await getOrderDetails(req.params.restaurantId, req.params.orderId);
  res.json(data);
});

router.get('/daily-aggregates/:restaurantId', async (req, res) => {
  const data = await getDailyAggregates(req.params.restaurantId);
  res.json(data[0] || { total_orders: 0, total_revenue: 0 });
});

router.get('/popular-items', async (req, res) => {
  const { start, end } = req.query;
  const data = await getMostPopularItems(start, end);
  res.json(data);
});

router.get('/volume', async (req, res) => {
  const { start, end } = req.query;
  const data = await getOrderVolumeOverTime(start, end);
  res.json(data);
});

module.exports = router;
