import { Factory, TimeMock } from '../../helpers';


describe('Student Task', () => {
  const now = new Date('2017-10-14T12:00:00.000Z');
  let task;
  beforeEach(() => {
    task = Factory.studentTask({ type: 'reading', stepCount: 5 });
  });

  it('updates steps on load', () => {
    const step = task.steps[3];
    task.onFetchComplete({ data: Factory.bot.create('StudentTask', { stepCount: 10 }) });
    expect(task.steps).toHaveLength(10);
    expect(task.steps[3]).toBe(step); // toBe tests object equality
  });

});
