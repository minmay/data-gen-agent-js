const fs = require('fs');
const YAML = require('yaml');

function loadTag(path) {
    if (!path) {
        const message = `Path required.`;
        throw Error(message)
    } else if (fs.existsSync(path)) {
        const tag_config_file = fs.readFileSync(path, 'utf8');
        const tag_config = YAML.parse(tag_config_file);
        return tag_config;
    } else {
        const message = `tags configuration file does not exist at path: ${path}`;
        throw Error(message)
    }
}

module.exports = loadTag;


