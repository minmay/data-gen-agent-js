let random = require("./random")
const logger = require("./logger")

class Selector {
    constructor(tagConfig) {
        this.tagConfig = tagConfig;
    }

    select() {
        let numericQuantity = this.tagConfig.selection.numeric;
        let stringQuantity = this.tagConfig.selection.string;
        let groupsQuantity = this.tagConfig.selection.groups;

        logger.debug("numeric: %d, string: %d, group: %d", numericQuantity, stringQuantity, groupsQuantity)

        let tags = new Set();
        // copy the array
        let groups = [ ... this.tagConfig.groups ]
        // shuffle array
        this.shuffleArray(groups);
        // select group
        for (let i = 0; i < groupsQuantity; i++) {
            let group = groups[i];
            for (let tag of group) {
                tags.add(tag)
            }
        }

        // extract strings
        let strings = this.tagConfig.tags.filter(tag => tag.type === "string")
            .filter(tag => !tags.has(tag.name))
            .map(tag => tag.name)
        this.shuffleArray(strings);
        for (let i = 0; i < stringQuantity; i++) {
            let tag = strings[i]
            tags.add(tag)
        }

        // extract numerics
        let numerics = this.tagConfig.tags.filter(tag => tag.type === "int" || tag.type === "double")
            .filter(tag => !tags.has(tag.name))
            .map(tag => tag.name)
        this.shuffleArray(numerics);
        for (let i = 0; i < numericQuantity; i++) {
            let tag = numerics[i]
            tags.add(tag)
        }

        // pull tags
        let selectedTags = this.tagConfig.tags.filter(tag => tags.has(tag.name));
        this.shuffleArray(selectedTags)
        logger.debug("tags: %j", selectedTags)

        return selectedTags;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = random.nextInt(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

module.exports = Selector
