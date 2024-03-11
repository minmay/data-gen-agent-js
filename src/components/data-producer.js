const { Kafka, Partitioners } = require('kafkajs')

class DataProducer {
    constructor(brokers, clientId, topic) {
        this.kafka = new Kafka({
            clientId: clientId,
            brokers: brokers,
        });
        this.producer = this.kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
        this.topic = topic;

    }

    async connect() {
        await this.producer.connect();
    }

    async send(message) {
        await this.producer.send({
            topic: this.topic,
            messages: [
                { value: message }
            ],
        })
    }

    async disco() {
        await this.producer.disconnect();
    }
}

module.exports = DataProducer;



