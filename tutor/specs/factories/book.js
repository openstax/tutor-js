import { cloneDeep } from 'lodash';
const {
  Factory, sequence, uuid, reference,
  TITLES,
} = require('./helpers');

const physics = require('../../api/ecosystems/1/readings.json')[0];
const biology = require('../../api/ecosystems/2/readings.json')[0];
const TYPES = { biology, physics };

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
