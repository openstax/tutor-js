import {
  FreeResponseInput, FreeResponseReview,
} from '../../../../src/screens/task/step/exercise-free-response';
import TaskUX from '../../../../src/screens/task/ux';
import { Factory, TestRouter, TimeMock, delay, C } from '../../../helpers';
import { setFreeResponse } from '../helpers';
import ResponseValidation from '../../../../src/models/response_validation';
import Raven from '../../../../src/models/app/raven';

jest.mock('lodash/random', () => () => 1); // lock nudge message
jest.mock('../../../../src/models/app/raven');
jest.mock('../../../../src/models/response_validation');
jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercise Free Response', () => {
  let props;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    const task = Factory.studentTask({ type: 'homework', stepCount: 1 });
    const step = task.steps[0];
    props = {
      step,
      questionNumber: 42,
      response_validation: new ResponseValidation(),
      course: Factory.course(),
      question: step.content.questions[0],
      taskUX: new TaskUX({
        task,
        stepId: step.id,
        history: new TestRouter().history,
        course: Factory.course(),
      }),
    };
  });

  it('matches snapshot', () => {
    expect(<C><FreeResponseInput {...props} /></C>).toMatchSnapshot();
  });

  it('reviews text', () => {
    const fr = mount(<FreeResponseReview {...props} />);
    props.step.free_response = null;
    expect(fr.isEmptyRender()).toBeTruthy();
    props.step.free_response = 'test';
    fr.update();
    expect(fr.text()).toContain('test');
    fr.unmount();
  });

  it('displays question number and stem', () => {
    props.response_validation.isEnabled = false;
    const fr = mount(<C><FreeResponseInput {...props} /></C>);
    expect(fr).toHaveRendered('QuestionStem div[data-question-number=42]');
    fr.unmount();
  });

  it('saves text immediately when not validating', async () => {
    props.step.can_be_updated = true

    props.response_validation.isEnabled = false;
    const fr = mount(<C><FreeResponseInput {...props} /></C>);
    const value = 'test test test';
    setFreeResponse(fr, { value });
    await delay();
    expect(props.step.response_validation).toEqual({ })
    expect(props.step.free_response).toEqual(value);
    expect(props.step.canEditFreeResponse).toBe(false);
    fr.unmount();
  });

  it('only submits validation when ui is disabled', async () => {
    props.response_validation.validate = jest.fn()
      .mockResolvedValue({ data: { valid: false } });
    props.response_validation.isEnabled = true;
    props.response_validation.isUIEnabled = false;
    const fr = mount(<C><FreeResponseInput {...props} /></C>);
    const value = 'test test test';
    setFreeResponse(fr, { value });
    await delay();
    expect(props.step.response_validation.attempts).toHaveLength(1);
    expect(props.step.response_validation.attempts[0]).toMatchObject({
      valid: false, response: value,
    });
    expect(props.step.free_response).toEqual(value);
    expect(props.step.canEditFreeResponse).toBe(false);
    expect(fr).toHaveRendered('StepFooter RelatedContentLink');
    expect(fr).not.toHaveRendered('TextArea[isErrored=true]');
    fr.unmount();
  });

  it('validates text and has retry ui', async () => {
    props.response_validation.isEnabled = true;
    props.response_validation.isUIEnabled = true;
    props.response_validation.validate = jest.fn()
      .mockResolvedValue({ data: { valid: false } });
    const fr = mount(<C><FreeResponseInput {...props} /></C>);

    const value = 'test test test';
    expect(fr).toHaveRendered('StepFooter RelatedContentLink');

    setFreeResponse(fr, { value });

    expect(props.response_validation.validate).toHaveBeenCalledWith(
      { response: value, uid: props.step.uid },
    );
    await delay();

    expect(props.step.response_validation.attempts).toHaveLength(1);
    expect(props.step.response_validation.attempts[0]).toMatchObject({
      valid: false, response: value,
    });

    expect(fr).toHaveRendered('TextArea[isErrored=true]');
    expect(fr).not.toHaveRendered('StepFooter RelatedContentLink');

    expect(fr).toHaveRendered('NudgeMessage');
    expect(fr.find('NudgeMessage').text()).toContain('Not sure? Here’s a hint');
    expect(fr).toHaveRendered('AnswerButton[disabled=true]');
    expect(fr.find('AnswerButton').text()).toEqual('Submit');
    expect(props.step.free_response).toBeUndefined();

    const updatedValue = 'a new value';
    setFreeResponse(fr, { value: updatedValue });

    await delay();

    expect(props.response_validation.validate).toHaveBeenCalledWith(
      { response: updatedValue, uid: props.step.uid },
    );

    expect(props.step.response_validation.attempts).toHaveLength(2);
    expect(props.step.response_validation.attempts[1]).toMatchObject({
      valid: false, response: updatedValue,
    });

    expect(props.step.free_response).toEqual(updatedValue);

    fr.unmount();
  });

  it('hides nudge ui when free response is valid', async () => {
    props.response_validation.isEnabled = true;
    props.response_validation.isUIEnabled = true;
    props.response_validation.validate = jest.fn()
      .mockResolvedValue({ data: { valid: true } });
    const fr = mount(<C><FreeResponseInput {...props} /></C>);
    const value = 'test test test';
    setFreeResponse(fr, { value });

    await delay();

    expect(props.step.free_response).toEqual(value);
    expect(props.step.canEditFreeResponse).toBe(false);
    expect(props.step.response_validation.attempts).toHaveLength(1);
    expect(props.step.response_validation.attempts[0]).toMatchObject({
      valid: true, response: value,
    });

    fr.unmount();
  });

  it('hides nudge ui and saves free_response validation has an error', async () => {
    props.response_validation.isEnabled = true;
    props.response_validation.isUIEnabled = true;
    props.response_validation.validate = jest.fn(() => Promise.reject(new Error('timeout')));
    const fr = mount(<C><FreeResponseInput {...props} /></C>);
    const value = 'test test test';
    setFreeResponse(fr, { value });

    await delay();

    expect(props.step.free_response).toEqual(value);
    expect(props.step.response_validation.attempts[0]).toMatchObject({
      valid: true, response: value, exception: 'Error: timeout',
    });
    expect(Raven.captureException).toHaveBeenCalled();
  });
});
