import { cloneDeep } from 'lodash';
const {
  Factory, sequence, uuid, reference,
  TITLES,
} = require('./helpers');

const physics = require('../../api/ecosystems/1/readings.json')[0];
const biology = require('../../api/ecosystems/2/readings.json')[0];

const TYPES = { biology, physics };

function mapPages(page, pages) {
  if (page.isPage) {

  }
  (page.children || []).forEach(child => {
    mapPages(child, pages);
  });
  return pages;
}

// Factory.define('Book').page_ids(({ type }) => getPages(book));
