import { Factory, ld } from '../../helpers';
import { ResponseValidationUX as UX } from '../../../src/screens/task/response-validation-ux';
jest.mock('lodash/random', () => () => 1);

describe('Task Response Validation', () => {
  let step;
  let ux;
  let validator;
  const messages = [
    { title: 'one' }, { title: 'two' }, { title: 'three' },
  ];
  beforeEach(() => {
    step = Factory.studentTask({ type: 'homework', stepCount: 1 }).steps[0];
    validator = {
      isEnabled: true,
      isUIEnabled: true,
      result: { valid: true },
      validate(args) {
        return Promise.resolve(ld.extend(args, this.result));
      },
    };
    ux = new UX({ step, validator, messages, taskUX: {
      onFreeResponseComplete: jest.fn(),
    } });
  });

  it('picks a random message', () => {
    ux = new UX({ step, validator, messages });
    expect(ux.nudge.title).toEqual('two');
  });

  it('does not record nudge when UI is not enabled', async () => {
    validator.isUIEnabled = false;
    ux.setResponse({ target: { value: 'garbage all the way down' } });
    await ux.onSave();
    expect(step.response_validation.attempts).toHaveLength(1);
    expect(step.response_validation.attempts[0].nudge).toBeNull();
  });

  it('only records nudge when its displayed', async () => {
    ux.setResponse({ target: { value: 'garbage all the way down' } });
    await ux.onSave();
    expect(step.response_validation.attempts).toHaveLength(1);
    expect(step.response_validation.attempts[0].nudge).toEqual('two');
    ux.setResponse({ target: { value: 'another attempt' } });
    await ux.onSave();
    expect(ux.taskUX.onFreeResponseComplete).toHaveBeenCalledWith(step);
    expect(step.response_validation.attempts).toHaveLength(2);
    expect(step.response_validation.attempts[1].nudge).toBeNull();
  });

  it('disables submit btn appropriately', () => {
    expect(ux.isDisplayingNudge).toBe(false);
    ux.results.push({});
    expect(ux.isDisplayingNudge).toBe(true);
    expect(ux.isSubmitDisabled).toBe(true);
    ux.setResponse({ target: { value: '  ' } });
    expect(ux.isSubmitDisabled).toBe(true);
    ux.setResponse({ target: { value: 'test' } });
    expect(ux.isSubmitDisabled).toBe(false);
  });
});
