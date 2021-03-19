import { Factory, TimeMock } from '../../helpers';


describe('Student Task', () => {
    const now = new TimeMock.setTo('2017-10-14T12:00:00.000Z');
    let task;
    beforeEach(() => {
        task = Factory.studentTask({ type: 'reading', now, stepCount: 5 });
    });

    it('updates steps on load', () => {
        const step = task.steps[3];
        task.onFetchComplete({ data: Factory.bot.create('StudentTask', { now, stepCount: 10 }) });
        expect(task.steps).toHaveLength(10);
        expect(task.steps[3]).toBe(step); // toBe tests object equality
        task.steps.forEach(s => {
            expect(s.task).toBe(task);
        });

        // test that steps are truncated
        task.onFetchComplete({ data: Factory.bot.create('StudentTask', { now, stepCount: 4 }) });
        expect(task.steps).toHaveLength(4);
        expect(task.steps[3]).toBe(step); // toBe tests object equality
    });

});
