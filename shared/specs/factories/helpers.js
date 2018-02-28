const Factory = require('object-factory-bot');
const fake = require('faker');
const { sequence, reference } = Factory;

function uuid_s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function uuid() {
  return uuid_s4() + uuid_s4() + '-' + uuid_s4() + '-' + uuid_s4() + '-' +
    uuid_s4() + '-' + uuid_s4() + uuid_s4() + uuid_s4();
}

module.exports = {
  Factory,
  uuid,
  sequence,
  reference,
  fake,
};
