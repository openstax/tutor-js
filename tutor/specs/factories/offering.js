const {
    Factory, sequence, fake, reference,
    TITLES, APPEARANCE_CODES,
} = require('./helpers');

const TITLE_KEYS = Object.keys(TITLES);

const moment = require('moment');

const TERMS = [ 'spring', 'summer', 'fall', 'winter' ];

Factory.define('OfferingTerm')
    .term(({ index }) => TERMS[index])
    .year(() => moment().year());

Factory.define('Offering')
    .id(sequence)
    .title(({ type = fake.random.arrayElement(TITLE_KEYS) }) => TITLES[type])
    .is_concept_coach(false)
    .is_tutor(true)
    .appearance_code(({ type = 'physics' }) => APPEARANCE_CODES[type])
    .default_course_name(({ type = 'physics' }) => TITLES[type])
    .does_cost(true)
    .active_term_years(reference('OfferingTerm', { count: 4 }))
    .is_available(true)
    .is_preview_available(true)
    .preview_message(fake.company.bsBuzz)
    .subject(fake.random.arrayElement(['science', 'math', 'high school']))
    .os_book_id(sequence);
