const {
    Factory, fake, reference, OFFERINGS,
} = require('./helpers');

const TITLE_KEYS = Object.keys(OFFERINGS);

const moment = require('moment');

const TERMS = [ 'spring', 'summer', 'fall', 'winter' ];

Factory.define('OfferingTerm')
    .term(({ index }) => TERMS[index])
    .year(() => moment().year());

Factory.define('Offering')
    .id(({ type = 'physics' }) => OFFERINGS[type].id)
    .title(({ type = fake.random.arrayElement(TITLE_KEYS) }) => OFFERINGS[type].title)
    .is_concept_coach(false)
    .is_tutor(true)
    .appearance_code(({ type = 'physics' }) => OFFERINGS[type].appearance_code)
    .default_course_name(({ type = 'physics' }) => OFFERINGS[type].title)
    .does_cost(true)
    .active_term_years(reference('OfferingTerm', { count: 4 }))
    .is_available(true)
    .is_preview_available(true)
    .preview_message(fake.company.bsBuzz);
