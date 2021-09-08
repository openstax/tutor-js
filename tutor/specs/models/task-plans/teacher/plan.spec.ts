import { Factory, ld, TimeMock } from '../../../helpers';
import { serialize } from 'modeled-mobx'
import { TeacherTaskPlan, TeacherTaskPlanData, ReferenceBookNode as Page } from '../../../../src/models'

describe('Task Plan Model', function() {
    TimeMock.setTo('2015-01-12T10:00:00.000Z');
    let plan!: TeacherTaskPlan;

    beforeEach(() => {
        const course = Factory.course()
        plan = Factory.teacherTaskPlan({ course });
    });

    it('tasking plan changed', () => {
        expect(plan.hasTaskingDatesChanged).toBe(false);
        plan.tasking_plans[0].opens_at = '2018-01-20';
        expect(plan.hasTaskingDatesChanged).toBe(true);
        plan.update({
            tasking_plans: [{
                target_id: 1, target_type: 'period',
                opens_at: '2018-01-02', due_at: '2018-01-02',
            }],
        } as any);
        expect(plan.hasTaskingDatesChanged).toBe(false);
    });

    it('moves pages', () => {
        plan.settings.page_ids = [1,2,3,4].map(String);
        plan.movePage({ id: 42 } as Page, 3);
        expect(plan.settings.page_ids).toEqual([1,2,3,4].map(String));

        plan.movePage({ id: 3 } as Page, 1);

        expect(plan.settings.page_ids).toEqual([1,2,4,3].map(String));

        plan.movePage({ id: 2 } as Page, -1);
        expect(plan.settings.page_ids).toEqual([2,1,4,3].map(String));

        plan.movePage({ id: 2 } as Page, -1);
        expect(plan.settings.page_ids).toEqual([2,1,4,3].map(String));

        plan.movePage({ id: 3 } as Page, 1);
        expect(plan.settings.page_ids).toEqual([2,1,4,3].map(String));

        plan.removePage({ id: 3 } as Page);
        expect(plan.settings.page_ids).toEqual([2,1,4].map(String));
    });

    it('removes itself from course when deleted', () => {
        const onDelete = jest.fn();
        const spy = jest.spyOn(plan.course, 'teacherTaskPlans', 'get').mockImplementation(() => ({
            delete: onDelete,
        } as any));
        plan.onDeleteComplete();
        expect(onDelete).toHaveBeenCalledWith(plan.id);
        spy.mockRestore();
    });

    it('calculates duration', () => {
        plan.tasking_plans[0].opens_at = '2015-01-01T03:30:00.000Z';
        plan.tasking_plans[0].due_at = '2015-01-30T03:30:00.000Z';
        plan.tasking_plans.push({
            target_id: 3331, target_type: 'period',
            opens_at: '2015-01-01T03:30:00.000Z',
            due_at: '2015-02-10T03:30:00.000Z',
            closes_at: '2015-02-20T03:30:00.000Z',
        } as any)
        expect(plan.interval.start.toISOString())
            .toEqual('2015-01-01T03:30:00.000Z');
        expect(plan.dateRanges.due.end.toISOString())
            .toEqual('2015-02-10T03:30:00.000Z');
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
            const newPlan = Factory.teacherTaskPlan({ course: plan.course })
            newPlan.update(serialize(plan) as any as TeacherTaskPlanData);
            expect(newPlan.tasking_plans[0].opens_at).toEqual(
                plan.tasking_plans[0].opens_at
            );
        });
    });

    it('fetches the reference book with the plan ecosystem not the course ecosystem', () => {
        plan.ecosystem_id = 1
        plan.course.ecosystem_id = 2
        expect(plan.referenceBook.id).toEqual(1)
    });

});
