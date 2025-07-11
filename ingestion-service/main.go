package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/gorilla/mux"

	"github.com/sunlightsky112/ingestion-service/kafka"
	"github.com/sunlightsky112/ingestion-service/handlers"
)

func main() {
	_ = godotenv.Load()
	kafka.InitProducer()

	r := mux.NewRouter()
	r.HandleFunc("/orders", handlers.HandleOrder).Methods("POST")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Ingestion Service listening on port", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
