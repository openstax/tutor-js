import { Factory } from '../../helpers';


describe('Student Task Step', () => {
  let step;

  beforeEach(() => {
    step = Factory.studentTasks({
      count: 1,
      attributes: { type: 'reading' },
    }).array[0].steps[0];
  });

  it('sets content', () => {
    expect(step.content).toBeUndefined();
    step.onLoaded({ data: {
      foo: 'bar',
    } });
    expect(step.content).toMatchObject({ foo: 'bar' });
    expect(step.isFetched).toBe(true);
  });

});
