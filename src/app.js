const loadTag = require('./components/tags')
const Selector = require('./components/selector')
const Generator = require('./components/generator')
const logger = require('./components/logger')
const parse = require('./components/cli')
const serialize = require('./components/csv')
const DataProducer = require('./components/data-producer')

function loop(isDryRun, dataProducer) {
    let selectedTags = selector.select();
    let generator = new Generator(selectedTags);
    let generatedTags = generator.map().map(tag => {
        return {
            step: tag.step,
            name: tag.name,
            value: tag.value
        }
    })
    // logger.info("Generated tags: %j", generatedTags);
    const csv = serialize(generatedTags);
    logger.info("timeseries: \n%s", csv)
    if (!isDryRun) {
       dataProducer.send(csv)
    }

}

function calcOffset() {
    let epoch =Date.now();
    let start = 60000 - epoch % 60000 - 1000;
    return start;
}

let cliOptions = parse();

const tags = loadTag(cliOptions.tagsConfigPath);
logger.debug("Using tag config: %j", tags )
const selector = new Selector(tags)

const dataProducer = new DataProducer(cliOptions.kafkaBrokers, cliOptions.kafkaClientId, cliOptions.kafkaTopic)

if (!cliOptions.isDryRun) {
    dataProducer.connect();
}

setTimeout(
    () => {
        setInterval(loop, cliOptions.loop, cliOptions.isDryRun, dataProducer)
    },
    calcOffset()
);



