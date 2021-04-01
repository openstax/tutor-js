import { Factory, ld, TimeMock } from '../../../helpers';

describe('Task Plan Model', function() {
    TimeMock.setTo('2015-01-12T10:00:00.000Z');
    let plan;

    beforeEach(() => {
        const course = Factory.course()
        plan = Factory.teacherTaskPlan({ course });
        plan.course = course;
    });

    it('tasking plan changed', () => {
        expect(plan.hasTaskingDatesChanged).toBe(false);
        plan.tasking_plans[0].opens_at = '2018-01-20';
        expect(plan.hasTaskingDatesChanged).toBe(true);
        plan.update({
            tasking_plans: [{
                opens_at: '2018-01-02', due_at: '2018-01-02',
            }],
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

    describe('cloning', () => {
        it('sets cloned_from_id', () => {
            const newPlan = plan.createClone({ course: plan.course });
            expect(newPlan.dataForSave).toMatchObject({
                cloned_from_id: plan.id,
            });
        });

        it('includes attributes', () => {
            expect(plan.clonedAttributes).toMatchObject({
                ...ld.pick(plan, 'title', 'description', 'settings', 'type', 'ecosystem_id'),
            });
        });

        it('copies tasking times', () => {
            plan.tasking_plans[0].opens_at = '2015-01-12T03:30:00.000Z';
            expect(plan.clonedAttributes.tasking_plans[0].opens_at).toEqual(
                plan.tasking_plans[0].opens_at
            );
            const newPlan = new plan.constructor({});
            newPlan.update(plan.serialize());
            expect(newPlan.tasking_plans[0].opens_at).toEqual(
                plan.tasking_plans[0].opens_at
            );
        });
    });
    it('calculates duration', () => {
        plan.tasking_plans[0].opens_at = '2015-01-01T03:30:00.000Z';
        plan.tasking_plans[0].due_at = '2015-01-30T03:30:00.000Z';
        plan.tasking_plans.push({
            opens_at: '2015-01-01T03:30:00.000Z',
            due_at: '2015-02-10T03:30:00.000Z',
        });
        expect(plan.duration.start.toISOString())
            .toEqual('2015-01-01T03:30:00.000Z');
        expect(plan.dateRanges.due.end.toISOString())
            .toEqual('2015-02-10T03:30:00.000Z');
    });
});
