const { program, Option } = require('commander');
const logger = require("./logger");

function parse() {
    program
        .helpOption('-h, --help', 'Displays help information')
        .addOption(new Option('-d, --dry-run', 'Performs a dry run by not send messages to Kafka.').env('DRY_RUN'))
        .addOption(new Option('-t --tags <string>', 'Location of tags configuration file.').env('TAGS'))
        .addOption(new Option('--kafka-brokers <string...>', 'List of Kafka brokers.').default(['data-gen-agent-kafka-bootstrap:9092']).env('KAFKA_BROKERS'))
        .addOption(new Option('--kafka-client-id <string>', 'Kafka producer client id.').default('data-gen-agent').env('KAFKA_CLIENT_ID'))
        .addOption(new Option('--kafka-topic <string>', 'Kafka topic.').default('timeseries').env('KAFKA_TOPIC'))
        .addOption(new Option('-l, --loop <int>', 'Number of milliseconds to wait between invocations.').default(30000, '30000 miliseconds').env('LOOP_MS'));

    program.parse();

    const options = program.opts();

    const isDryRun = !!options.dryRun;
    const tagsConfigPath = options.tags;
    const loop = options.loop;
    const kafkaBrokers = options.kafkaBrokers;
    const kafkaClientId = options.kafkaClientId;
    const kafkaTopic = options.kafkaTopic;

    logger.info(
        "dry-run: %s, tags: %s, loop: %d, kafka brokers: %j, kafka client id: %s, kafka topic: %s",
        isDryRun, tagsConfigPath, loop, kafkaBrokers, kafkaClientId, kafkaTopic
    )
    return {
        isDryRun: isDryRun,
        tagsConfigPath: tagsConfigPath,
        loop: loop,
        kafkaBrokers: kafkaBrokers,
        kafkaClientId: kafkaClientId,
        kafkaTopic: kafkaTopic
    };
}

module.exports = parse;

