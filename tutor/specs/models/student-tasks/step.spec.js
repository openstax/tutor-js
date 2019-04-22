import { Factory } from '../../helpers';


describe('Student Task Step', () => {

  it('sets content', () => {
    const step = Factory.studentTask({ type: 'reading', stepCount: 1 }).steps[0];
    expect(step.content).toBeTruthy();
    expect(step.isFetched).toBe(true);
  });

  it('only fetches when needed', () => {
    const step = Factory.studentTask({ type: 'homework', stepCount: 1 }).steps[0];
    expect(step.needsFetched).toBe(true);
    step.api.requestCounts.read = 1;
    expect(step.needsFetched).toBe(false);
    step.api.requestCounts.read = 0;
    expect(step.needsFetched).toBe(true);
    step.type = 'external_url'; // doesn't need fetched
    expect(step.needsFetched).toBe(false);
  });

  it('calculates if free response is needed', () => {
    const step = Factory.studentTask({ type: 'homework', stepCount: 1 }).steps[0];
    step.formats = ['free-response'];
    expect(step.isTwoStep).toBe(true);
    expect(step.needsFreeResponse).toBe(true);
    step.free_response = 'a question with answers';
    expect(step.needsFreeResponse).toBe(false);
  });

});
