import { Factory, ld } from '../../../helpers';

describe('CourseCalendar Header', function() {
  let plan;

  beforeEach(() => {
    plan = Factory.teacherTaskPlan();
    plan.course = Factory.course();
  });

  it('tasking plan changed', () => {
    expect(plan.hasTaskingDatesChanged).toBe(false);
    plan.tasking_plans[0].opens_at = '2018-01-20';
    expect(plan.hasTaskingDatesChanged).toBe(true);
    plan.onApiRequestComplete({
      data: {
        tasking_plans: [{
          opens_at: '2018-01-02', due_at: '2018-01-02',
        }],
      },
    });
    expect(plan.hasTaskingDatesChanged).toBe(false);
  });

  it('moves pages', () => {
    plan.settings.page_ids = [1,2,3,4].map(String);
    plan.movePage({ id: 42 }, 3);
    expect(plan.settings.page_ids).toEqual([1,2,3,4].map(String));

    plan.movePage({ id: 3 }, 1);

    expect(plan.settings.page_ids).toEqual([1,2,4,3].map(String));

    plan.movePage({ id: 2 }, -1);
    expect(plan.settings.page_ids).toEqual([2,1,4,3].map(String));

    plan.movePage({ id: 2 }, -1);
    expect(plan.settings.page_ids).toEqual([2,1,4,3].map(String));

    plan.movePage({ id: 3 }, 1);
    expect(plan.settings.page_ids).toEqual([2,1,4,3].map(String));

    plan.removePage({ id: 3 });
    expect(plan.settings.page_ids).toEqual([2,1,4].map(String));
  });

  it('removes itself from course when deleted', () => {
    plan.course = Factory.course();
    const onDelete = jest.fn();
    jest.spyOn(plan.course, 'teacherTaskPlans', 'get').mockImplementation(() => ({
      delete: onDelete,
    }));
    plan.onDeleteComplete();
    expect(onDelete).toHaveBeenCalledWith(plan.id);
  });

  it('clones with attributes', () => {
    expect(plan.clonedAttributes).toMatchObject({
      ...ld.pick(plan, 'title', 'description', 'settings', 'type', 'ecosystem_id'),
    });
  });
});
