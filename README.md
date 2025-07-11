# Scalable Restaurant Order System

This project is a scalable, event-driven backend system for ingesting and analyzing multi-restaurant orders. It is built using Golang, Kafka, MongoDB, Node.js, and Redis, and designed to support operational dashboard queries in near real-time.



## 📁 Project Structure
```bash
├── ingestion-service/ # Golang API: receives orders and publishes to Kafka
├── dashboard-api/ # Node.js API: serves dashboard queries from MongoDB (with optional Redis cache)
├── start_all.sh # Start both services
├── test_all.sh # Test runner for both services
├── .env.example # Sample environment config
```

## ⚙️ Prerequisites

- Go 1.21+
- Node.js 18+
- MongoDB
- Apache Kafka + Zookeeper
- Redis
- Bash (for test scripts)
- `curl` and `jq` (for testing output)


## 🚀 Setup Instructions

### 1. Install MongoDB, Kafka, Zookeeper, and Redis

Start the following services (each in a separate terminal/tab):

```bash
# Zookeeper
kafka/bin/zookeeper-server-start.sh kafka/config/zookeeper.properties

# Kafka
kafka/bin/kafka-server-start.sh kafka/config/server.properties

# MongoDB
mongod --dbpath ~/data/db

# Redis
redis-server

# Create Kafka Topic
kafka/bin/kafka-topics.sh --create \
  --topic orders \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1

# Check created kafka topic
kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092

```

### 2. Set up environment variables

#### ingestion-service/.env
```bash
PORT=8080
KAFKA_BROKERS=localhost:9092
KAFKA_TOPIC=orders
KAFKA_CONSUMER_GROUP=order-consumer
MONGO_URI=mongodb://localhost:27017
MONGO_DB=orders_db
```

#### dashboard-api/.env
```bash
PORT=3001
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=orders_db
REDIS_URL=redis://127.0.0.1:6379
```

### 3. Start services (Dashboard API & Ingestion)
```bash
chmod -x start_all.sh
./start_all.sh
```

### 4. Test system
```baseh
chmod +x test_all.sh
./test_all.sh
```