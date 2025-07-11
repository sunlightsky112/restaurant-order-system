package models

type Item struct {
	Name string `json:"name" bson:"name"`
	Qty  int    `json:"qty" bson:"qty"`
}

type Order struct {
	ID           string  `json:"id" bson:"_id"`
	RestaurantID string  `json:"restaurant_id" bson:"restaurant_id"`
	OrderValue   float64 `json:"order_value" bson:"order_value"`
	Items        []Item  `json:"items" bson:"items"`
	CreatedAt    int64   `json:"created_at" bson:"created_at"`
}
