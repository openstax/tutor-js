import {
  FreeResponseInput, FreeResponseReview,
} from '../../../../src/screens/task/step/exercise-free-response';
import { Factory } from '../../../helpers';
import { setFreeResponse } from '../helpers';

jest.mock('../../../../src/screens/task/ux');
jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercise Free Response', () => {
  let props;

  beforeEach(() => {
    const step = Factory.studentTask({
      type: 'homework', stepCount: 1,
    }).steps[0];
    props = { step, question: step.content.questions[0] };
  });

  it('matches snapshot', () => {
    expect(<FreeResponseInput {...props} />).toMatchSnapshot();
  });

  it('saves text', () => {
    const fr = mount(<FreeResponseInput {...props} />);
    const value = 'test test test';
    setFreeResponse(fr, { value });
    expect(props.step.free_response).toEqual(value);
    expect(props.step.needsFreeResponse).toBe(false);
    fr.unmount();
  });

  it('reviews text', () => {
    const fr = mount(<FreeResponseReview {...props} />);
    props.step.free_response = null;
    expect(fr.isEmptyRender()).toBeTruthy();
    props.step.free_response = 'test';
    expect(fr.text()).toContain('test');
    fr.unmount();
  });
});
