package mongo

import (
	"context"
	"log"
	"os"
	"time"

	"ingestion-service/models"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var collection *mongo.Collection

func InitMongo() {
	client, err := mongo.NewClient(options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := client.Connect(ctx); err != nil {
		log.Fatal(err)
	}

	db := client.Database(os.Getenv("MONGO_DB"))
	collection = db.Collection("orders_view")
}

func InsertOrder(order models.Order) error {
	_, err := collection.InsertOne(context.TODO(), order)
	return err
}
