const Factory = require('object-factory-bot');
const fake = require('faker');
const { sequence, reference } = Factory;

function uuid() {
    return fake.random.uuid();
}

module.exports = {
    Factory,
    uuid,
    sequence,
    reference,
    fake,

};
