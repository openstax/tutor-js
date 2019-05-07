import ld from 'lodash';
import { TaskPlanStore } from '../../src/flux/task-plan';
import TaskPlan from '../../src/helpers/task-plan';
import DATA   from '../../api/courses/1/dashboard';


jest.mock('../../src/flux/task-plan');

const COURSE_ID = 1;
const SINGLE = ld.find(DATA.plans, { id: '7' });
const SAME   = ld.find(DATA.plans, { id: '8' });
const DIFFER = ld.find(DATA.plans, { id: '9' });

describe('task-plan helper', function() {

  it('returns a single due date for single task plan', function() {
    const dates = TaskPlan.dates(SINGLE);
    expect( dates ).toEqual({
      all: {
        opens_at: '2015-03-31T11:40:23.796Z',
        due_at:   '2015-04-05T10:00:00.000Z',
      },
    });
  });

  it('returns a single due date when all dates are identical', function() {
    const dates = TaskPlan.dates(SAME);
    expect( dates ).toEqual({
      all: {
        opens_at: '2015-02-31T11:40:23.796Z',
        due_at:   '2015-04-05T10:00:00.000Z',
      },
    });
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
  });

  xit('will check and return only a given attr', function() {
    const dates = TaskPlan.dates(DIFFER, { only: 'due_at' });
    expect( dates ).toEqual({
      all: {
        due_at: '2015-04-05T10:00:00.000Z',
      },
    });
  });


  it('calculates api options depending on plan isNew', function() {
    expect(TaskPlan.apiEndpointOptions(SINGLE.id, COURSE_ID))
      .toEqual({ url: `plans/${SINGLE.id}` });

    TaskPlanStore.isNew.mockReturnValue(true);
    expect(TaskPlan.apiEndpointOptions(SINGLE.id, COURSE_ID))
      .toEqual({ url: `courses/${COURSE_ID}/plans`, method: 'POST' });

    TaskPlanStore.get.mockReturnValue({ ecosystem_id: 42 });
    expect(TaskPlan.apiEndpointOptions(SINGLE.id, COURSE_ID))
      .toEqual({
        url: `courses/${COURSE_ID}/plans`,
        method: 'POST',
        params: { ecosystem_id: 42 },
      });

  });
});
