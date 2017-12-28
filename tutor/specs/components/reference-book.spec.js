import _ from 'underscore';
import React from 'react';
import { Promise } from 'es6-promise';
import { TimeActions } from '../../src/flux/time';
import ReactTestUtils from 'react-addons-test-utils';
import { routerStub, commonActions } from './helpers/utilities';

import { CourseActions, CourseStore } from '../../src/flux/course';
import { ReferenceBookActions, ReferenceBookStore } from '../../src/flux/reference-book';
import { ReferenceBookPageActions, ReferenceBookPageStore } from '../../src/flux/reference-book-page';
import ReferenceBook from '../../src/components/reference-book/reference-book';
import Page from '../../src/components/reference-book/page';

const COURSE_ID = '1';
const ECOSYSTEM_ID = '1';
import COURSE from '../../api/user/courses/1.json';
import TOC from '../../api/ecosystems/1/readings.json';
const FIRST_PAGE_ID = '0e58aa87-2e09-40a7-8bf3-269b2fa16509';
const FIRST_PAGE  = '1.1';
const SECOND_PAGE = '1.2';
const SECOND_PAGE_ID = '0e58aa87-2e09-40a7-8bf3-269b2fa16510';
const THIRD_PAGE  = '1.3';
const THIRD_PAGE_ID = '0e58aa87-2e09-40a7-8bf3-269b2fa16511';

import PAGE from '../../api/pages/0e58aa87-2e09-40a7-8bf3-269b2fa16509.json';


const ECO_ID = '3';
import ECO_TOC from '../../api/ecosystems/3/readings.json';
const ECO_PAGES = {};
ECO_PAGES['334f8b61-30eb-4475-8e05-5260a4866b4b@4.68'] = require('../../api/pages/334f8b61-30eb-4475-8e05-5260a4866b4b@4.68.json');
ECO_PAGES['d419f72d-3349-4449-ab34-c705409df4aa@5'] = require('../../api/pages/d419f72d-3349-4449-ab34-c705409df4aa@5.json');
ECO_PAGES['17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12'] = require('../../api/pages/17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12.json');
const ECO_FIRST_PAGE = '1';
const ECO_SECOND_PAGE = '1.1';
const ECO_SECOND_PAGE_ID = 'd419f72d-3349-4449-ab34-c705409df4aa@5';

const TOCS = {
  '1': TOC,
  '3': ECO_TOC,
};


const renderBook = function(section, ecosystemId) {
  if (ecosystemId == null) { ecosystemId = __guard__(CourseStore.get(COURSE_ID), x => x.ecosystem_id); }

  return new Promise(function(resolve, reject) {
    let url = `/books/${COURSE_ID}`;
    if (section) { url += `/section/${section}`; }
    if (ecosystemId !== __guard__(CourseStore.get(COURSE_ID), x1 => x1.ecosystem_id)) { url += `?ecosystemId=${ecosystemId}`; }

    return routerStub.goTo(url).then( result =>
      resolve(_.extend({
        book: ReactTestUtils.findRenderedComponentWithType(result.component, ReferenceBook),
      }, result))

      , err => console.err(err));
  });
};

describe('Reference Book Component', function() {

  beforeEach(function() {
    CourseActions.loaded(COURSE, COURSE_ID);
    ReferenceBookActions.loaded(TOC, ECOSYSTEM_ID);
    ReferenceBookPageActions.loaded(PAGE, FIRST_PAGE_ID);
    return renderBook(FIRST_PAGE).then(state => {
      return this.state = state;
    });
  });

  it('renders the section title on the navbar', function() {
    return expect(this.state.div.querySelector('.section-title').textContent)
      .to.match(/1\.1/);
  });

  it('renders page html', function() {
    return expect(this.state.div.querySelector('.book-content').textContent)
      .to.equal('A bunch of html');
  });

  it('toggles menu when navbar control is clicked', function() {
    const toggle = this.state.div.querySelector('.menu-toggle');

    expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.contain('menu-open');

    commonActions.click(toggle);
    expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.not.contain('menu-open');

    commonActions.click(toggle);
    return expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.contain('menu-open');
  });

  it('navigates forward and back between pages', function() {
    const prevControl = this.state.div.querySelector('.paging-control.prev');
    expect(prevControl.attributes.disabled).to.exist; // on first page

    const nextControl = this.state.div.querySelector('.paging-control.next');
    expect(nextControl.attributes.disabled).not.to.exist;
    expect(nextControl.href).to.contain(SECOND_PAGE);
    const page = ReactTestUtils.findRenderedComponentWithType(this.state.book, Page);

    ReferenceBookPageActions.loaded(PAGE, SECOND_PAGE_ID);
    // button:0 is a mystery argument needed by ReactRouter, taken from their specs
    commonActions.click(nextControl, { button: 0 });

    expect(page.context.router.getCurrentParams().section)
      .to.equal(SECOND_PAGE);

    expect(this.state.div.querySelector('.paging-control.next').href)
      .to.contain(THIRD_PAGE);

    return expect(this.state.div.querySelector('.paging-control.prev').href)
      .to.contain(FIRST_PAGE);
  });

  it('preserves menu toggle when navigating forward and back between pages', function() {
    const toggle = this.state.div.querySelector('.menu-toggle');
    const nextControl = this.state.div.querySelector('.paging-control.next');

    const page = ReactTestUtils.findRenderedComponentWithType(this.state.book, Page);
    ReferenceBookPageActions.loaded(PAGE, SECOND_PAGE_ID);

    commonActions.click(toggle);
    expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.not.contain('menu-open');
    // button:0 is a mystery argument needed by ReactRouter, taken from their specs
    commonActions.click(nextControl, { button: 0 });
    expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.not.contain('menu-open');

    ReferenceBookPageActions.loaded(PAGE, THIRD_PAGE_ID);
    commonActions.click(nextControl, { button: 0 });
    expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.not.contain('menu-open');

    commonActions.click(toggle);
    expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.contain('menu-open');

    const prevControl = this.state.div.querySelector('.paging-control.prev');
    commonActions.click(prevControl, { button: 0 });
    return expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.contain('menu-open');
  });

  it('sets the menu item to be active based on the current page', function() {
    const selection = this.state.div.querySelector(`.menu [data-section='${FIRST_PAGE}'] a`);
    expect(selection).not.to.be.null;
    return expect(_.toArray(selection.classList)).to.include('active');
  });

  return it('closes TOC when using TOC to nav and window is small', function(done) {
    expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.contain('menu-open');

    const nextSelection = this.state.div.querySelector(`.menu [data-section='${SECOND_PAGE}'] a`);
    ReferenceBookPageActions.loaded(PAGE, SECOND_PAGE_ID);

    commonActions.click(nextSelection);
    expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.not.contain('menu-open');
    return done();
  });
});


describe('Reference Book Component for a non-default ecosystem', function() {

  beforeEach(function() {
    CourseActions.loaded(COURSE, COURSE_ID);
    ReferenceBookActions.loaded(ECO_TOC, ECO_ID);
    _.each(ECO_PAGES, (page, cnx_id) => ReferenceBookPageActions.loaded(page, cnx_id));

    return renderBook(ECO_FIRST_PAGE, ECO_ID).then(state => {
      return this.state = state;
    });
  });

  it('renders the section title on the navbar', function() {
    return expect(this.state.div.querySelector('.section-title').textContent)
      .to.match(/1/);
  });

  it('sets the menu item to be active based on the current page', function() {
    const selection = this.state.div.querySelector(`.menu [data-section='${ECO_FIRST_PAGE}'] a`);
    expect(selection).not.to.be.null;
    return expect(_.toArray(selection.classList)).to.include('active');
  });

  it('navigates forward and back between pages, maintaining ecosystem id', function() {
    const prevControl = this.state.div.querySelector('.paging-control.prev');
    expect(prevControl.attributes.disabled).to.exist; // on first page

    const nextControl = this.state.div.querySelector('.paging-control.next');
    expect(nextControl.attributes.disabled).not.to.exist;
    expect(nextControl.href).to.contain(ECO_SECOND_PAGE);
    const page = ReactTestUtils.findRenderedComponentWithType(this.state.book, Page);

    ReferenceBookPageActions.loaded(ECO_PAGES[ECO_SECOND_PAGE_ID], ECO_SECOND_PAGE_ID);
    // button:0 is a mystery argument needed by ReactRouter, taken from their specs
    commonActions.click(nextControl, { button: 0 });

    expect(page.context.router.getCurrentParams().section)
      .to.equal(ECO_SECOND_PAGE);

    expect(page.context.router.getCurrentQuery())
      .to.have.property('ecosystemId').and.equal(ECO_ID);

    expect(this.state.div.querySelector('.paging-control.next').href)
      .to.contain(`?ecosystemId=${ECO_ID}`);

    return expect(this.state.div.querySelector('.paging-control.prev').href)
      .to.contain(`?ecosystemId=${ECO_ID}`);
  });

  return it('keeps ecosystem id in table of contents links', function() {
    const tocLinks = _.toArray(this.state.div.querySelectorAll('.menu a'));
    const linkAddresses = _.pluck(tocLinks, 'href');

    return _.each(linkAddresses, linkAddress => expect(linkAddress).to.contain(`?ecosystemId=${ECO_ID}`));
  });
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
