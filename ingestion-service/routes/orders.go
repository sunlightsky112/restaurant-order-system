package routes

import (
	"encoding/json"
	"net/http"
	"time"

	"ingestion-service/kafka"
	"ingestion-service/models"
)

func RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/orders", HandleOrder)
}

func HandleOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var order models.Order

	err := json.NewDecoder(r.Body).Decode(&order)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if order.ID == "" || order.RestaurantID == "" || order.OrderValue <= 0 || len(order.Items) == 0 {
		http.Error(w, "Missing or invalid fields", http.StatusBadRequest)
		return
	}

	order.CreatedAt = time.Now()
	payload, err := json.Marshal(order)
	if err != nil {
		http.Error(w, "Failed to serialize", http.StatusInternalServerError)
		return
	}

	err = kafka.PublishMessage("orders", payload)
	if err != nil {
		http.Error(w, "Failed to publish to Kafka", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
	w.Write([]byte(`{"status":"published"}`))
}
