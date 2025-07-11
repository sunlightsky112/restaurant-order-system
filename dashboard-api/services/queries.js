const { getDB } = require("./db");

async function getRecentOrders(restaurantId) {
  return await getDB()
    .collection("orders_view")
    .find({ restaurant_id: restaurantId })
    .sort({ created_at: -1 })
    .limit(10)
    .toArray();
}

async function getOrderDetails(restaurantId, orderId) {
  return await getDB()
    .collection("orders_view")
    .findOne({ restaurant_id: restaurantId, _id: orderId });
}

async function getDailyAggregates(restaurantId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await getDB()
    .collection("orders_view")
    .aggregate([
      {
        $match: {
          restaurant_id: restaurantId,
          created_at: { $gte: today },
        },
      },
      {
        $group: {
          _id: "daily_aggregate",
          total_orders: { $sum: 1 },
          total_revenue: { $sum: "$order_value" },
        },
      },
    ])
    .toArray();
}

async function getMostPopularItems(startDate, endDate) {
  return await getDB()
    .collection("orders_view")
    .aggregate([
      {
        $match: {
          created_at: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.qty" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 10 },
    ])
    .toArray();
}

async function getOrderVolumeOverTime(startDate, endDate) {
  return await getDB()
    .collection("orders_view")
    .aggregate([
      {
        $match: {
          created_at: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "order_volume",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();
}

module.exports = {
  getRecentOrders,
  getOrderDetails,
  getDailyAggregates,
  getMostPopularItems,
  getOrderVolumeOverTime,
};
