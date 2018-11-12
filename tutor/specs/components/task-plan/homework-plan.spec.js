let React, ReactTestUtils, sinon, Testing;
import ld from 'underscore';
import moment from 'moment-timezone';

import { TaskPlanActions, TaskPlanStore } from '../../../src/flux/task-plan';
import Courses from '../../../src/models/courses-map';

import { TimeStore } from '../../../src/flux/time';
import TimeHelper from '../../../src/helpers/time';

import { HomeworkPlan } from '../../../src/components/task-plan/homework';

(((({ Testing, sinon, _, React, ReactTestUtils } = require('helpers'));
import { ExtendBasePlan, PlanRenderHelper } from '../helpers/task-plan';

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

const helper = model => PlanRenderHelper(model, HomeworkPlan);

xdescribe('Homework Plan', function() {
  beforeEach(function() {
    Courses.bootstrap([COURSE], { clear: true });
    return TaskPlanActions.reset();
  });

  it('should allow add exercises when not visible', () =>
    helper(UNPUBLISHED_HW).then(({ dom }) => expect(dom.querySelector('#problems-select')).to.not.be.null)
  );

  xit('should not allow add exercises after visible', () =>
    helper(VISIBLE_HW).then(({ dom }) => expect(dom.querySelector('#problems-select')).to.be.null)
  );

  it('should show exercises required message when saving and no exercises', () =>
    helper(NEW_HW).then(function({ dom }) {
      expect(dom.querySelector('.problems-required')).to.be.null;
      Testing.actions.click(dom.querySelector('.-save'));
      return expect(dom.querySelector('.problems-required')).to.not.be.null;
    })
  );

  it('can mark form as invalid', () =>
    helper(NEW_HW).then(function({ dom }) {
      expect(dom.querySelector('.edit-homework.is-invalid-form')).to.be.null;
      Testing.actions.click(dom.querySelector('.-save'));
      return expect(dom.querySelector('.edit-homework.is-invalid-form')).to.not.be.null;
    })
  );

  it('hides form when selecting sections', () =>
    helper(NEW_HW).then(function({ dom }) {
      expect(dom.querySelector('.edit-homework.hide')).to.be.null;
      Testing.actions.click(dom.querySelector('#problems-select'));
      expect(dom.querySelector('.edit-homework.hide')).to.not.be.null;
      return expect(dom.querySelector('.homework-plan-exercise-select-topics')).to.not.be.null;
    })
  );

  return it('toggles immediate feedback when options are changed', function() {
    sinon.spy(TaskPlanActions, 'setImmediateFeedback');
    return helper(NEW_HW).then(function({ dom }) {
      ReactTestUtils.Simulate.change(dom.querySelector('#feedback-select'), { target: { value: 'immediate' } });
      return expect(TaskPlanActions.setImmediateFeedback).to.have.been.calledWith(NEW_HW.id, true);
    });
  });
});
