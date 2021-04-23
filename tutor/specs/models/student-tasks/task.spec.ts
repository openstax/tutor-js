import { Factory, TimeMock } from '../../helpers';
import { StudentTaskObj } from '../../../src/models'

describe('Student Task', () => {
    const now = TimeMock.setTo('2017-10-14T12:00:00.000Z');
    let task: ReturnType<typeof Factory.studentTask>;
    beforeEach(() => {
        task = Factory.studentTask({ type: 'reading', now, stepCount: 5 });
    });

    it('updates steps on load', () => {
        const step = task.steps[3];

        task.onFetchComplete(
            Factory.data('StudentTask', { now, stepCount: 10 }) as StudentTaskObj
        );
        expect(task.steps).toHaveLength(10);
        expect(task.steps[3]).toBe(step);
        task.steps.forEach(s => {
            expect(s.task).toBe(task);
        });

        // test that steps are truncated
        task.onFetchComplete(
            Factory.data('StudentTask', { now, stepCount: 4 }) as StudentTaskObj
        );
        expect(task.steps).toHaveLength(4);
        expect(task.steps[3]).toBe(step); // toBe tests object equality
    });

});
