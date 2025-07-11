package kafka

import (
	"os"
	"log"

	"github.com/Shopify/sarama"
)

var Producer sarama.SyncProducer

func InitProducer() {
	config := sarama.NewConfig()
	config.Producer.Return.Successes = true
	brokers := []string{os.Getenv("KAFKA_BROKER")}

	var err error
	Producer, err = sarama.NewSyncProducer(brokers, config)
	if err != nil {
		log.Fatalf("Error creating Kafka producer: %v", err)
	}
}

func Publish(topic string, message []byte) error {
	msg := &sarama.ProducerMessage{
		Topic: topic,
		Value: sarama.ByteEncoder(message),
	}
	_, _, err := Producer.SendMessage(msg)
	return err
}
