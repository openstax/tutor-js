const {
  Factory, sequence, reference,
  fake, APPEARANCE_CODES,
} = require('./helpers');
const moment = require('moment');
const { ordinal } = require('../../src/helpers/number');


Factory.define('Note')
  .id(sequence)
  .page_id(sequence)
  .anchor('p-1234')
  .chapter_section(() => [
    fake.random.number({ min: 1, max: 10 }),
    fake.random.number({ min: 1, max: 5 }),
  ])
  .contents({
    endOffset: 254,
    startOffset: 226,
    type: 'XpathRangeSelector',
    content: 'plants and animals appeared.',
    endContainer: "./*[name()='p'][1]/text()[1]",
    startContainer: "./*[name()='p'][1]/text()[1]"
  })
