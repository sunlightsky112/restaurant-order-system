#!/bin/bash

echo "Starting Ingestion Service..."
gnome-terminal -- bash -c "cd ingestion-service && go run main.go; exec bash"

echo "Starting Dashboard API..."
gnome-terminal -- bash -c "cd dashboard-api && npm run dev; exec bash"
