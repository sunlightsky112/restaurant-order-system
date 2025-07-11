package kafka

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/Shopify/sarama"
	"ingestion-service/models"
	"ingestion-service/mongo"
)

type consumerGroupHandler struct{}

func (consumerGroupHandler) Setup(sarama.ConsumerGroupSession) error   { return nil }
func (consumerGroupHandler) Cleanup(sarama.ConsumerGroupSession) error { return nil }

func (consumerGroupHandler) ConsumeClaim(sess sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	for msg := range claim.Messages() {
		var order models.Order
		if err := json.Unmarshal(msg.Value, &order); err != nil {
			log.Println("Failed to unmarshal:", err)
			continue
		}

		fmt.Printf("✅ Consumed order: %s\n", order)
		if err := mongo.InsertOrder(order); err != nil {
			log.Println("Mongo insert error:", err)
			continue
		}

		sess.MarkMessage(msg, "")
	}
	return nil
}

func StartConsumer(brokers []string, groupID, topic string) {
	config := sarama.NewConfig()
	config.Consumer.Offsets.Initial = sarama.OffsetNewest

	consumerGroup, err := sarama.NewConsumerGroup(brokers, groupID, config)
	if err != nil {
		log.Fatalf("Error creating consumer group: %v", err)
	}

	handler := consumerGroupHandler{}
	for {
		err := consumerGroup.Consume(context.Background(), []string{topic}, handler)
		if err != nil {
			log.Printf("Consumer error: %v", err)
		}
	}
}
