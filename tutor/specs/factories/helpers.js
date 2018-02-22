const Factory = require('object-factory-bot');

const TITLES = {
  biology: 'Biology with Courseware',
  physics: 'College Physics',
  sociology: 'Sociology w Courseware',
  apush: 'AP US History',

};

const APPEARANCE_CODES = {
  biology: 'college_biology',
  physics: 'college_physics',
  sociology: 'intro_sociology',
  ap_ush: 'ap_us_history',
};

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
  Factory, uuid, sequence, reference,
  TITLES, APPEARANCE_CODES,
};
