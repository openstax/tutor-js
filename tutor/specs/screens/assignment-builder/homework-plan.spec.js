import { Factory, ld } from '../../helpers';
import moment from 'moment-timezone';
import { TaskPlanActions, TaskPlanStore } from '../../../src/flux/task-plan';
import Courses from '../../../src/models/courses-map';
import { TimeStore } from '../../../src/flux/time';
import TimeHelper from '../../../src/helpers/time';
import { HomeworkPlan } from '../../../src/screens/assignment-builder/homework';
import { ExtendBasePlan, PlanRenderHelper } from './task-plan-helper';

const yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(TimeHelper.ISO_DATE_FORMAT);
const tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT);

const COURSE_ID = '1';
const COURSE = require('../../../api/user/courses/1.json');
const COURSE_ECOSYSTEM_ID = COURSE.ecosystem_id;

const VISIBLE_HW = ExtendBasePlan({ type: 'homework', is_published: true, exercise_ids: [1] },
  { opens_at: yesterday, due_at: tomorrow, target_id: COURSE.periods[0].id });
const UNPUBLISHED_HW = ExtendBasePlan({ type: 'homework', exercise_ids: [1] });
const NEW_HW = ExtendBasePlan({ type: 'homework', id: '_CREATING_1' });

const ECO_HOMEWORK = require('../../../api/plans/2.json');
const ECO_HOMEWORK_ECOSYSTEM_ID = ECO_HOMEWORK.ecosystem_id;


describe('Homework Plan', function() {
  let course;
  let helper;

  beforeEach(function() {
    course = Factory.course();
    helper = model => PlanRenderHelper(model, HomeworkPlan, {
      courseId: String(course.id),
    });
    Courses.bootstrap([course], { clear: true });
    return TaskPlanActions.reset();
  });

  it('should allow add exercises when not visible', () => {
    const plan = helper(UNPUBLISHED_HW);
    expect(plan).toHaveRendered('#problems-select')
  });

  xit('should not allow add exercises after visible', () =>
    helper(VISIBLE_HW).then(({ dom }) => expect(dom.querySelector('#problems-select')).toBeNull())
  );

  xit('should show exercises required message when saving and no exercises', () =>
    helper(NEW_HW).then(function({ dom }) {
      expect(dom.querySelector('.problems-required')).toBeNull();
      Testing.actions.click(dom.querySelector('.-save'));
      return expect(dom.querySelector('.problems-required')).to.not.be.null;
    })
  );

  xit('can mark form as invalid', () =>
    helper(NEW_HW).then(function({ dom }) {
      expect(dom.querySelector('.edit-homework.is-invalid-form')).toBeNull();
      Testing.actions.click(dom.querySelector('.-save'));
      return expect(dom.querySelector('.edit-homework.is-invalid-form')).to.not.be.null;
    })
  );

  xit('hides form when selecting sections', () =>
    helper(NEW_HW).then(function({ dom }) {
      expect(dom.querySelector('.edit-homework.hide')).toBeNull();
      Testing.actions.click(dom.querySelector('#problems-select'));
      expect(dom.querySelector('.edit-homework.hide')).to.not.be.null;
      return expect(dom.querySelector('.homework-plan-exercise-select-topics')).to.not.be.null;
    })
  );

  xit('toggles immediate feedback when options are changed', function() {
    jest.fn(TaskPlanActions, 'setImmediateFeedback');
    return helper(NEW_HW).then(function({ dom }) {
      ReactTestUtils.Simulate.change(dom.querySelector('#feedback-select'), { target: { value: 'immediate' } });
      return expect(TaskPlanActions.setImmediateFeedback).toHaveBeenCalledWith(NEW_HW.id, true);
    });
  });
});
