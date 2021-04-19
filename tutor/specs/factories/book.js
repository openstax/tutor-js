const { cloneDeep } = require('lodash');
const {
    Factory, sequence, uuid,
    TITLES, fake,
} = require('./helpers');

const physics = require('../../api/ecosystems/1/readings.json')[0];
const biology = require('../../api/ecosystems/2/readings.json')[0];

const TYPES = { biology, physics };


Factory.define('Page')
    .id(sequence)
    .uuid(uuid)
    .title(fake.company.catchPhraseDescriptor)
    .type('page')
    .cnx(() => `${uuid()}@1`)
    .short_id('sYerTSma')
    .chapter_section(({ chapter, section }) => [
        chapter || fake.random.number({ min: 1, max: 10 }),
        section || fake.random.number({ min: 1, max: 5 }),
    ])
    .content_html(() => fake.lorem.paragraphs())


Factory.define('Book')
    .id(sequence)
    .uuid(uuid)
    .children(({ type = 'physics' }) => cloneDeep(TYPES[type].children))
    .archive_url('https://archive.cnx.org')
    .chapter_section(() => [])
    .cnx_id(uuid)
    .short_id('GFy_h8cu')
    .title(({ type = 'physics' }) => TITLES[type])
    .type('part')
    .webview_url('https://cnx.org');
