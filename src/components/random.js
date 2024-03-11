function nextInt(bound) {
    return Math.floor(Math.random() * bound);
}

function nextDouble(bound) {
    return Math.random() * bound;
}

module.exports = {
    nextInt, nextDouble
}
