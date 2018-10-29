import ld from 'underscore';

jest.mock('../../src/flux/task-plan');
const TaskPlanFlux = require('../../src/flux/task-plan');


const { default: TaskPlan } = require('../../src/helpers/task-plan');
const { default: Courses } = require('../../src/models/courses-map');

const COURSE_ID = 1;
const COURSE = require('../../api/courses/1');
const DATA   = require('../../api/courses/1/dashboard');

const SINGLE = _.findWhere(DATA.plans, { id: '7' });
const SAME   = _.findWhere(DATA.plans, { id: '8' });
const DIFFER = _.findWhere(DATA.plans, { id: '9' });

describe('task-plan helper', function() {

  beforeEach(() => Courses.bootstrap([COURSE], { clear: true }));

  it('returns a single due date for single task plan', function() {
    const dates = TaskPlan.dates(SINGLE);
    expect( dates ).toEqual({
      all: {
        opens_at: '2015-03-31T11:40:23.796Z',
        due_at:   '2015-04-05T10:00:00.000Z',
      },
    });
    return undefined;
  });

  it('returns a single due date when all dates are identical', function() {
    const dates = TaskPlan.dates(SAME);
    expect( dates ).toEqual({
      all: {
        opens_at: '2015-02-31T11:40:23.796Z',
        due_at:   '2015-04-05T10:00:00.000Z',
      },
    });
    return undefined;
  });

  it('returns the period id with dates when not the same', function() {
    const dates = TaskPlan.dates(DIFFER);
    expect( dates ).toEqual({
      1: {
        opens_at: '2015-01-31T11:40:23.796Z',
        due_at:   '2015-04-05T10:00:00.000Z',
      },

      2: {
        opens_at: '2015-03-30T11:40:23.796Z',
        due_at:   '2015-04-05T10:00:00.000Z',
      },
    });
    return undefined;
  });

  it('will check and return only a given attr', function() {
    const dates = TaskPlan.dates(DIFFER, { only: 'due_at' });
    expect( dates ).toEqual({
      all: {
        due_at: '2015-04-05T10:00:00.000Z',
      },
    });
    return undefined;
  });


  return it('calculates api options depending on plan isNew', function() {
    expect(TaskPlan.apiEndpointOptions(SINGLE.id, COURSE_ID))
      .toEqual({ url: `plans/${SINGLE.id}` });

    TaskPlanFlux.TaskPlanStore.isNew.mockReturnValue(true);
    expect(TaskPlan.apiEndpointOptions(SINGLE.id, COURSE_ID))
      .toEqual({ url: `courses/${COURSE_ID}/plans`, method: 'POST' });

    TaskPlanFlux.TaskPlanStore.get.mockReturnValue({ ecosystem_id: 42 });
    expect(TaskPlan.apiEndpointOptions(SINGLE.id, COURSE_ID))
      .toEqual({
        url: `courses/${COURSE_ID}/plans`,
        method: 'POST',
        params: { ecosystem_id: 42 },
      });

    return undefined;
  });
});
