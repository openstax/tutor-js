import { Factory, ld } from '../../helpers';
import moment from 'moment-timezone';
import { TaskPlanActions, TaskPlanStore } from '../../../src/flux/task-plan';
import { TaskingActions } from '../../../src/flux/tasking';
import Courses from '../../../src/models/courses-map';
import { TimeStore } from '../../../src/flux/time';
import TimeHelper from '../../../src/helpers/time';
import { ExternalPlan } from '../../../src/screens/assignment-builder/external';
import { ExtendBasePlan, PlanRenderHelper } from './task-plan-helper';

const yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(TimeHelper.ISO_DATE_FORMAT);
const tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT);

const COURSE_ID = '1';
const COURSE = require('../../../api/user/courses/1.json');
const COURSE_ECOSYSTEM_ID = COURSE.ecosystem_id;

const VISIBLE_EXTERNAL = ExtendBasePlan({ type: 'external', is_published: true, exercise_ids: [1] },
  { opens_at: yesterday, due_at: tomorrow, target_id: COURSE.periods[0].id });
const UNPUBLISHED_EXTERNAL = ExtendBasePlan({ type: 'external' });
const NEW_EXTERNAL = ExtendBasePlan({ type: 'external', id: '_CREATING_1' });

describe('External Homework Plan', function() {
  let course;
  let helper;

  beforeEach(function() {
    course = Factory.course();

    helper = model => PlanRenderHelper(model, ExternalPlan, {
      courseId: String(course.id),
    });
    Courses.bootstrap([course], { clear: true });
    TaskPlanActions.reset();
    TaskingActions.reset();
  });

  it('should allow set url when not visible', () => {
    const plan = helper(UNPUBLISHED_EXTERNAL);
    expect(plan).toHaveRendered('input#external-url');
  });

  it('should not allow add setting url after visible', () => {
    const plan = helper(UNPUBLISHED_EXTERNAL);
    expect(plan).toHaveRendered('input#external-url');
  });

  it('should show url required message when saving and no assignment URL', () => {
    const plan = helper(NEW_EXTERNAL);
    expect(plan).toHaveRendered('input#external-url');
    expect(plan).not.toHaveRendered('.is-invalid-form');
    plan.find('SaveTaskButton AsyncButton').simulate('click');
    expect(plan).toHaveRendered('.is-invalid-form');
  });

  it('can mark form as invalid', () => {
    const plan = helper(UNPUBLISHED_EXTERNAL);
    expect(plan).toHaveRendered('input#external-url');
    expect(plan).not.toHaveRendered('.is-invalid-form');
    plan.find('SaveTaskButton AsyncButton').simulate('click');
    expect(plan).toHaveRendered('.is-invalid-form');
  });
});
