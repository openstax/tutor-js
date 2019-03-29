import { Factory } from '../../helpers';


describe('Student Task Step', () => {

  it('sets content', () => {
    const step = Factory.studentTask({ type: 'reading', stepCount: 1 }).steps[0];
    expect(step.content).toBeTruthy();
    expect(step.isFetched).toBe(true);
  });

  it('calculates if free response is needed', () => {
    const step = Factory.studentTask({ type: 'homework', stepCount: 1 }).steps[0];
    expect(step.needsFreeResponse).toBe(true);
    step.free_response = 'a question with answers';
    expect(step.needsFreeResponse).toBe(false);
  });

});
