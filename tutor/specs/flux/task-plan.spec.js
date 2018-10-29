import ld from 'underscore';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

import { TaskPlanActions, TaskPlanStore } from '../../src/flux/task-plan';
import Courses from '../../src/models/courses-map';

import COURSE from '../../api/courses/1.json';
const COURSE_ID = '1';

import DATA from '../../api/courses/1/dashboard';
const PLAN = _.findWhere(DATA.plans, { id: '7' });
const HOMEWORK_WITH_FALSE = _.findWhere(DATA.plans, { id: '29' });

describe('TaskPlan Store', function() {

  beforeEach(function() {
    Courses.bootstrap([COURSE], { clear: true });
    return TaskPlanActions.loaded(PLAN, PLAN.id);
  });

  it('can clone a task plan', function() {
    const newId = '111';
    TaskPlanActions.createClonedPlan(
      newId,
      {
        planId: PLAN.id,
        courseId: COURSE_ID,
        due_at: moment(),
      },
    );
    const clone = TaskPlanStore.getChanged(newId);
    for (let attr of ['title', 'description', 'type', 'settings', 'is_feedback_immediate']) {
      expect(clone[attr]).toEqual(PLAN[attr]);
    }

    expect(clone.cloned_from_id).toEqual(PLAN.id);
    for (let period of Courses.get(COURSE_ID).periods.active) {
      const tasking_plan = _.find(clone.tasking_plans, { target_id: period.id });
      expect(tasking_plan).to.exist;
    }

    return undefined;
  });

  return it('can clone a task plan even when one of the properties is false', function() {
    const newId = '111';
    TaskPlanActions.loaded(HOMEWORK_WITH_FALSE, HOMEWORK_WITH_FALSE.id);
    TaskPlanActions.createClonedPlan(
      newId,
      {
        planId: HOMEWORK_WITH_FALSE.id,
        courseId: COURSE_ID,
        due_at: moment(),
      },
    );
    const clone = TaskPlanStore.getChanged(newId);
    for (let attr of ['title', 'description', 'type', 'settings', 'is_feedback_immediate']) {
      expect(clone[attr]).toEqual(HOMEWORK_WITH_FALSE[attr]);
    }

    expect(clone.cloned_from_id).toEqual(HOMEWORK_WITH_FALSE.id);
    for (let period of Courses.get(COURSE_ID).periods.active) {
      const tasking_plan = _.find(clone.tasking_plans, { target_id: period.id });
      expect(tasking_plan).to.exist;
    }

    return undefined;
  });
});
