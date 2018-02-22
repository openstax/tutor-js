const {
  Factory, sequence, uuid, reference,
  TITLES, APPEARANCE_CODES,
} = require('./helpers');
const moment = require('moment');

const TERMS = [ 'spring', 'summer', 'fall', 'winter' ];

Factory.define('OfferingTerm')
  .term(({ index }) => TERMS[index])
  .year(() => moment().year());

Factory.define('Offering')
  .id(sequence)
  .title(({ type = 'physics' }) => TITLES[type])
  .is_concept_coach(false)
  .is_tutor(true)
  .appearance_code(({ type = 'physics' }) => APPEARANCE_CODES[type])
  .default_course_name(({ type = 'physics' }) => TITLES[type])
  .does_cost(true)
  .active_term_years(reference('OfferingTerm', { count: 4 }));
