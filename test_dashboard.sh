#!/bin/bash

BASE_URL="http://localhost:3001/orders"
RESTAURANT_ID="r001"
ORDER_ID="test_order_1"

echo "🔍 Get recent orders"
curl -s "$BASE_URL/recent/$RESTAURANT_ID" | jq


echo "📦 Get order details"
curl -s "$BASE_URL/$RESTAURANT_ID/$ORDER_ID" | jq

echo "📊 Get daily aggregates"
curl -s "$BASE_URL/daily-aggregates/$RESTAURANT_ID" | jq

echo "🔥 Get most popular items"
START=$(date -I -d "yesterday")
END=$(date -I)
curl -s "$BASE_URL/popular-items?start=$START&end=$END" | jq

echo "📈 Get order volume over time"
curl -s "$BASE_URL/volume?start=$START&end=$END" | jq
