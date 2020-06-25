import { Factory, TimeMock } from '../../helpers';


describe('Student Task Step', () => {
  const now = new Date('2017-10-14T12:00:00.000Z');
  TimeMock.setTo(now);

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
    expect(step.isTwoStep).toBe(false);
    step.formats = ['free-response', 'multiple-choice'];
    expect(step.isTwoStep).toBe(true);
    expect(step.canEditFreeResponse).toBe(true);
    step.free_response = 'a question with answers';
    expect(step.canEditFreeResponse).toBe(false);
  });

  it('calculates if it can be answered', () => {
    const step = Factory.studentTask({ type: 'homework', stepCount: 1 }).steps[0];
    expect(step.canAnswer).toBe(true);
    step.task.feedback_at = now - 1;
    expect(step.task.isFeedbackAvailable).toBe(true);
    expect(step.canAnswer).toBe(true);
    step.answer_id = 1234;
    expect(step.hasBeenAnswered).toBe(true);
    expect(step.canAnswer).toBe(false);
  });

});
