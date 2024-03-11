const { faker } = require('@faker-js/faker');
const random = require("./random")


function identity(v) {
    return v;
}
class Generator {
    constructor(tags) {
        this.tags = tags;
    }

    map() {
        return this.tags.map(tag => {
            var tag;
            switch (tag.type) {
                case "string":
                    tag = this.mapString(tag);
                    break;
                case "int":
                    tag = this.mapInt(tag)
                    break;
                case "double":
                    tag = this.mapDouble(tag)
                    break;
            }
            const step = this.buildStep();
            tag.step = step.toISOString();

            return tag;
        });
    }

    mapString(tag) {
        let value = faker.lorem.word();
        tag.value = this.fn(tag, value);
        return tag;
    }

    mapInt(tag) {
        let value = random.nextInt(100);
        tag.value = this.fn(tag, value);
        return tag;
    }

    mapDouble(tag) {
        let value = random.nextDouble(100)
        tag.value = this.fn(tag, value);
        return tag;
    }

    buildStep() {
        const epoch = Date.now() - random.nextInt(15 * 1000 * 60);
        const step = new Date(epoch);
        return step;
    }

    fn(tag, value) {
        if (tag.fn === "identity") {
            return identity(value);
        } else {
            const fn = new Function("v", tag.fn);
            return fn(value);
        }
    }
}

module.exports = Generator;
