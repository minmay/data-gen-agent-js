const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;


const log4j = printf(({ level, message, timestamp }) => {
    return `[${level}] ${timestamp} : ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.colorize(),
        format.simple(),
        log4j
    ),
    defaultMeta: { service: 'your-service-name' },
    transports: [
        new transports.Console()
    ]
});

module.exports = logger;
