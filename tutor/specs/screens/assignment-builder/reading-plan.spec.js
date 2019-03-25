import { Factory, ld } from '../../helpers';
import moment from 'moment-timezone';
import { TaskPlanActions } from '../../../src/flux/task-plan';
import Courses from '../../../src/models/courses-map';
import { TimeStore } from '../../../src/flux/time';
import TimeHelper from '../../../src/helpers/time';
import { ReadingPlan } from '../../../src/screens/assignment-builder/reading';

import { ExtendBasePlan, PlanRenderHelper } from './task-plan-helper';

const yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(TimeHelper.ISO_DATE_FORMAT);
const tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT);

describe('Reading Plan', function() {
  let ECO_READING, ECO_READING_ECOSYSTEM_ID, NEW_READING, props, UNPUBLISHED_READING;
  let VISIBLE_READING = (UNPUBLISHED_READING = (NEW_READING = (ECO_READING = (ECO_READING_ECOSYSTEM_ID = (props = null)))));
  let page_ids;
  let helper;
  let course;

  beforeEach(() => {
    course = Factory.course();
    helper = model => PlanRenderHelper(model, ReadingPlan, {
      courseId: String(course.id),
    });
    course.referenceBook.onApiRequestComplete({
      data: [Factory.bot.create('Book')],
    });
    page_ids = ld.slice(Array.from(course.referenceBook.pages.byId.keys()), 2, 5);

    VISIBLE_READING = ExtendBasePlan({ is_published: true },
      { opens_at: yesterday, due_at: tomorrow, target_id: course.periods[0].id });
    UNPUBLISHED_READING = ExtendBasePlan({
      settings: { page_ids },
    });

    NEW_READING = ExtendBasePlan({ id: '_CREATING_1', settings: { page_ids: [] } });

    Courses.set(course.id, course);
    TaskPlanActions.reset();
    return props = {};
  });

  it('should allow add sections when not visible', () => {
    const plan = helper(UNPUBLISHED_READING);
    expect(plan).toHaveRendered('#reading-select');
  });

  xit('should not allow add sections after visible', () =>
    helper(VISIBLE_READING).then(({ dom }) => expect(dom.querySelector('#reading-select')).toBeNull())
  );

  xit('should show sections required message when saving and no sections', () =>
    helper(NEW_READING).then(function({ dom }) {
      expect(dom.querySelector('.readings-required')).toBeNull();
      Testing.actions.click(dom.querySelector('.-save'));
      return expect(dom.querySelector('.readings-required')).to.not.be.null;
    })
  );

  xit('can mark form as invalid', () =>
    helper(NEW_READING).then(function({ dom }) {
      expect(dom.querySelector('.edit-reading.is-invalid-form')).toBeNull();
      Testing.actions.click(dom.querySelector('.-save'));
      return expect(dom.querySelector('.edit-reading.is-invalid-form')).to.not.be.null;
    })
  );

  xit('hides form when selecting sections', () =>
    helper(NEW_READING).then(function({ dom }) {
      expect(dom.querySelector('.edit-reading.hide')).toBeNull();
      Testing.actions.click(dom.querySelector('#reading-select'));
      return expect(dom.querySelector('.edit-reading.hide')).to.not.be.null;
    })
  );
});
