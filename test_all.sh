#!/bin/bash

echo "⚙️ Running ingestion service test..."
./test_ingestion.sh

echo -e "\n⌛ Waiting 3 seconds for Kafka consumer to sync..."
sleep 3

echo -e "\n📊 Running dashboard API test..."
./test_dashboard.sh
