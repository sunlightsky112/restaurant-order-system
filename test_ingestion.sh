#!/bin/bash

echo "🚀 Sending test orders to ingestion service..."

API_URL="http://localhost:8080/orders"

for i in {1..5}; do
  if [[ $i -eq 1 ]]; then
    ORDER_ID="test_order_1"
    RESTAURANT_ID="r001"
  else
    ORDER_ID="test_order_$((RANDOM % 1000 + 1))"  # Random order ID
    RESTAURANT_ID="r00$(( (RANDOM % 3) + 1 ))"
  fi

  ORDER_VALUE=$((RANDOM % 50 + 10))            # 10–59

  PAYLOAD=$(cat <<EOF
{
  "id": "$ORDER_ID",
  "restaurant_id": "$RESTAURANT_ID",
  "order_value": $ORDER_VALUE,
  "items": [
    { "name": "burger", "qty": 1 },
    { "name": "fries", "qty": 2 }
  ]
}
EOF
)

  echo "➡️  Sending order $ORDER_ID to $RESTAURANT_ID (value: $ORDER_VALUE)"
  curl -s -o /dev/null -w "[$i] Status: %{http_code}\n" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD"
done
