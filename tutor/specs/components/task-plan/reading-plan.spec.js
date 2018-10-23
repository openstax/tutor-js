let React, sinon, Testing;
import _ from 'underscore';
import moment from 'moment-timezone';

import { TaskPlanActions, TaskPlanStore } from '../../../src/flux/task-plan';
import Courses from '../../../src/models/courses-map';

import { TimeStore } from '../../../src/flux/time';
import TimeHelper from '../../../src/helpers/time';

import { ReadingPlan } from '../../../src/components/task-plan/reading';
import Factory from '../../factories';
(((({ Testing, sinon, _, React } = require('../helpers/component-testing')))));
import { ExtendBasePlan, PlanRenderHelper } from '../helpers/task-plan';

const yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(TimeHelper.ISO_DATE_FORMAT);
const tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT);

// COURSE_ID = '1'
// COURSE = require '../../../api/user/courses/1.json'
// COURSE_ECOSYSTEM_ID = COURSE.ecosystem_id


const helper = model => PlanRenderHelper(model, ReadingPlan);

xdescribe('Reading Plan', function() {
  let ECO_READING, ECO_READING_ECOSYSTEM_ID, NEW_READING, props, UNPUBLISHED_READING;
  let VISIBLE_READING = (UNPUBLISHED_READING = (NEW_READING = (ECO_READING = (ECO_READING_ECOSYSTEM_ID = (props = null)))));

  beforeEach(function() {
    console.log(Factory);
    const course = Factory.course();
    course.referenceBook.onApiRequestComplete({ data: [Factory.data('Book')] });

    VISIBLE_READING = ExtendBasePlan({ is_published: true },
      { opens_at: yesterday, due_at: tomorrow, target_id: course.periods[0].id });
    UNPUBLISHED_READING = ExtendBasePlan({
      page_ids: [ course.referenceBook.pages.byId.keys()[1] ],
    });
    NEW_READING = ExtendBasePlan({ id: '_CREATING_1', settings: { page_ids: [] } });

    Courses.set(course.id, course);
    TaskPlanActions.reset();
    return props = {};});

  it('should allow add sections when not visible', () =>
    helper(UNPUBLISHED_READING).then(({ dom }) => expect(dom.querySelector('#reading-select')).to.not.be.null)
  );

  xit('should not allow add sections after visible', () =>
    helper(VISIBLE_READING).then(({ dom }) => expect(dom.querySelector('#reading-select')).to.be.null)
  );

  xit('should show sections required message when saving and no sections', () =>
    helper(NEW_READING).then(function({ dom }) {
      expect(dom.querySelector('.readings-required')).to.be.null;
      Testing.actions.click(dom.querySelector('.-save'));
      return expect(dom.querySelector('.readings-required')).to.not.be.null;
    })
  );

  xit('can mark form as invalid', () =>
    helper(NEW_READING).then(function({ dom }) {
      expect(dom.querySelector('.edit-reading.is-invalid-form')).to.be.null;
      Testing.actions.click(dom.querySelector('.-save'));
      return expect(dom.querySelector('.edit-reading.is-invalid-form')).to.not.be.null;
    })
  );

  return xit('hides form when selecting sections', () =>
    helper(NEW_READING).then(function({ dom }) {
      expect(dom.querySelector('.edit-reading.hide')).to.be.null;
      Testing.actions.click(dom.querySelector('#reading-select'));
      return expect(dom.querySelector('.edit-reading.hide')).to.not.be.null;
    })
  );
});
