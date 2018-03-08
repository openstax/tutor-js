const {
  Factory,
  uuid,
  sequence,
  reference,
  fake,
} = require('shared/specs/factories/helpers');

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


module.exports = {
  Factory, uuid, sequence, reference,
  TITLES, APPEARANCE_CODES, fake,
};
