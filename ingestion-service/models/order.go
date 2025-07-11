package models

type Item struct {
	Name string `json:"name"`
	Qty  int    `json:"qty"`
}

type Order struct {
	ID          string  `json:"id"`
	RestaurantID string  `json:"restaurant_id"`
	OrderValue  float64 `json:"order_value"`
	Items       []Item  `json:"items"`
	CreatedAt   int64   `json:"created_at"` // timestamp (optional)
}
