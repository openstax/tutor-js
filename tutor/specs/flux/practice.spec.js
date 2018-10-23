import _ from 'lodash';

import { expect } from 'chai';
import { CoursePracticeActions, CoursePracticeStore } from '../../src/flux/practice';

const COURSE_ID = '1';
const PAGE_IDS_1 = ['1', '2', '3'];
const PAGE_IDS_2 = ['2', '3', '4'];

import COURSE_PRACTICE_1 from '../../api/courses/1/practice/POST.json';
const COURSE_PRACTICE_2 = _.extend({ id: 'Practice-Course-2' }, COURSE_PRACTICE_1);

const makePageIdParams = pageIds => ({ page_ids: pageIds });

const createPractice = function(pageIds, practice) {
  const args = { courseId: COURSE_ID, query: makePageIdParams(pageIds) };
  CoursePracticeActions.create(args);
  return CoursePracticeActions.created(practice, args);
};

const failToCreatePractice = function(pageIds) {
  const args = { courseId: COURSE_ID, query: makePageIdParams(pageIds) };
  CoursePracticeActions.create(args);
  return CoursePracticeActions._failed({}, args);
};

describe('CoursePractice Store', function() {

  afterEach(() => CoursePracticeActions.reset());

  it('can get course practice specific to params', function() {
    createPractice(PAGE_IDS_1, COURSE_PRACTICE_1);
    createPractice(PAGE_IDS_2, COURSE_PRACTICE_2);

    const params1 = makePageIdParams(PAGE_IDS_1);
    const params2 = makePageIdParams(PAGE_IDS_2);

    expect(CoursePracticeStore.get(COURSE_ID, params1).id)
      .to.be.equal(COURSE_PRACTICE_1.id);
    expect(CoursePracticeStore.get(COURSE_ID, params2).id)
      .to.be.equal(COURSE_PRACTICE_2.id);
    return undefined;
  });

  it('can get latest course practice specific to params', function() {
    createPractice(PAGE_IDS_1, COURSE_PRACTICE_1);
    createPractice(PAGE_IDS_1, COURSE_PRACTICE_2);

    const params1 = makePageIdParams(PAGE_IDS_1);

    expect(CoursePracticeStore.get(COURSE_ID, params1).id)
      .to.be.equal(COURSE_PRACTICE_2.id);
    return undefined;
  });

  it('is enabled for successfully created params', function() {
    createPractice(PAGE_IDS_1, COURSE_PRACTICE_1);
    createPractice(PAGE_IDS_2, COURSE_PRACTICE_2);

    const params1 = makePageIdParams(PAGE_IDS_1);
    const params2 = makePageIdParams(PAGE_IDS_2);

    expect(CoursePracticeStore.isDisabled(COURSE_ID, params1))
      .to.be.false;
    expect(CoursePracticeStore.isDisabled(COURSE_ID, params2))
      .to.be.false;
    return undefined;
  });

  return it('is disabled for failed params', function() {
    failToCreatePractice(PAGE_IDS_1);
    failToCreatePractice(PAGE_IDS_2);

    const params1 = makePageIdParams(PAGE_IDS_1);
    const params2 = makePageIdParams(PAGE_IDS_2);

    expect(CoursePracticeStore.isDisabled(COURSE_ID, params1))
      .to.be.true;
    expect(CoursePracticeStore.isDisabled(COURSE_ID, params2))
      .to.be.true;
    return undefined;
  });
});
