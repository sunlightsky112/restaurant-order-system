#!/bin/bash

echo "🚀 Sending test orders to ingestion service..."

API_URL="http://localhost:8080/orders"

for i in {1..5}; do
  ORDER_ID="test_order_$i"
  curl -s -o /dev/null -w "[$i] Status: %{http_code}\n" -X POST $API_URL \
    -H "Content-Type: application/json" \
    -d "{
      \"id\": \"$ORDER_ID\",
      \"restaurant_id\": \"r001\",
      \"order_value\": $((RANDOM % 50 + 10)),
      \"items\": [
        {\"name\": \"burger\", \"qty\": 1},
        {\"name\": \"fries\", \"qty\": 2}
      ]
    }"
done
