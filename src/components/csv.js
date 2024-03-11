const {stringify} = require('csv-stringify/sync');

function serialize(tags) {
    return stringify(tags)
}

module.exports = serialize;


