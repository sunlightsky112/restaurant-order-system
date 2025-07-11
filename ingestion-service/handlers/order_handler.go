package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/yourname/ingestion-service/kafka"
	"github.com/yourname/ingestion-service/models"
)

func HandleOrder(w http.ResponseWriter, r *http.Request) {
	var order models.Order
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if order.ID == "" || order.RestaurantID == "" || order.OrderValue <= 0 || len(order.Items) == 0 {
		http.Error(w, "Missing or invalid fields", http.StatusBadRequest)
		return
	}

	order.CreatedAt = time.Now().Unix()

	payload, err := json.Marshal(order)
	if err != nil {
		http.Error(w, "Failed to serialize", http.StatusInternalServerError)
		return
	}

	if err := kafka.Publish("orders", payload); err != nil {
		http.Error(w, "Failed to publish to Kafka", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
	w.Write([]byte(`{"status":"published"}`))
}
