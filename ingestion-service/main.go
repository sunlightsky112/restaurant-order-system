package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"ingestion-service/kafka"
	"ingestion-service/mongo"
	"ingestion-service/routes"
)

func main() {
	_ = godotenv.Load()

	mongo.InitMongo()
	kafka.InitProducer()

	// Start Kafka consumer in background
	go kafka.StartConsumer(
		strings.Split(os.Getenv("KAFKA_BROKER"), ","),
		os.Getenv("KAFKA_CONSUMER_GROUP"),
		os.Getenv("KAFKA_TOPIC"),
	)

	// Start HTTP API
	mux := http.NewServeMux()
	routes.RegisterRoutes(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("✅ Ingestion service listening on port", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
