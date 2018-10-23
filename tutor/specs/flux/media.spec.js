import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'underscore';

import { MediaActions, MediaStore } from '../../src/flux/media';
import { TaskActions, TaskStore } from '../../src/flux/task';
import { bootstrapCoursesList } from '../courses-test-data';

import TASK_DATA from '../../api/tasks/4.json';
import REFERENCE_BOOK from '../../api/ecosystems/1/readings.json';
import REFERENCE_BOOK_PAGE_DATA from '../../api/pages/17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12.json';

const TEST_MEDIA_ID = 'test-media';
const TEST_MEDIA = `<figure id=\"${TEST_MEDIA_ID}\"><figcaption>This is some test media.</figcaption></figure>`;
const TEST_SECOND_MEDIA = `<table id=\"${TEST_MEDIA_ID}\"><thead><th>Test Table</th></thead></table>`;
const TEST_HTML = `<p>Hello hi! This is pretend HTML for \
<a href=\"#${TEST_MEDIA_ID}\">testing media stuff</a></p> \
<h1>hello this is other stuff</h1>${TEST_MEDIA}`;
const TEST_SECOND_HTML = `<p>Hello hi! This is pretend HTML for \
<a href=\"#${TEST_MEDIA_ID}\">testing media stuff</a></p> \
<h1>hello this is other stuff</h1>${TEST_SECOND_MEDIA}`;
const TEST_BOTH_HTML = `<p>Hello hi! This is pretend HTML for \
<a href=\"#${TEST_MEDIA_ID}\">testing media stuff</a></p> \
<h1>hello this is other stuff</h1>${TEST_MEDIA}${TEST_SECOND_MEDIA}`;

const expectedActions = [
  'parse',
  'reset',
];

const expectedStore = [
  'get',
  'getMediaIds',
];

describe('Media flux', function() {

  afterEach(function() {
    MediaActions.reset();
    return TaskActions.reset();
  });

  it('should have expected functions', function() {

    _.each(expectedActions, action =>
      expect(MediaActions)
        .to.have.property(action).that.is.a('function')
    );

    _.each(expectedStore, storeAsker =>
      expect(MediaStore)
        .to.have.property(storeAsker).that.is.a('function')
    );
    return undefined;
  });

  it('should be able to parse HTML with links and pick out targeted media', function() {
    MediaActions.parse(TEST_HTML);
    const media = MediaStore.get(TEST_MEDIA_ID);

    expect(media)
      .to.have.property('name').and.equal('figure');
    expect(media)
      .to.have.property('html').and.equal(TEST_MEDIA);
    return undefined;
  });

  it('should be able to parse over a stored media', function() {
    MediaActions.parse(TEST_HTML);
    MediaActions.parse(TEST_SECOND_HTML);
    const media = MediaStore.get(TEST_MEDIA_ID);

    expect(media)
      .to.have.property('name').and.equal('table');
    expect(media)
      .to.have.property('html').and.equal(TEST_SECOND_MEDIA);
    return undefined;
  });

  it('should pick first matching element', function() {
    MediaActions.parse(TEST_BOTH_HTML);
    const media = MediaStore.get(TEST_MEDIA_ID);

    expect(media)
      .to.have.property('name').and.equal('figure');
    expect(media)
      .to.have.property('html').and.equal(TEST_MEDIA);
    return undefined;
  });

  it('should be able to parse HTML from tasks, even across steps and in questions', function() {
    TaskActions.loaded(TASK_DATA);
    const mediaIds = MediaStore.getMediaIds();

    expect(mediaIds)
      .to.include('figure-from-another-step').and.to.include('fig25-3');
    return undefined;
  });

  return it('should be able to parse HTML from reference book pages', function() {
    const course = bootstrapCoursesList().get(1);
    course.referenceBook.onApiRequestComplete({ data: REFERENCE_BOOK });
    course.referenceBook.pages.byChapterSection.get('1.2').onContentFetchComplete({ data: REFERENCE_BOOK_PAGE_DATA });
    const mediaIds = MediaStore.getMediaIds();

    expect(mediaIds)
      .to.have.length(10);
    return undefined;
  });
});
