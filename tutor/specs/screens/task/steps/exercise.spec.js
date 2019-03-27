import Exercise from '../../../../src/screens/task/step/exercise';
import { Factory, FakeWindow, TimeMock } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';
import { setFreeResponse } from '../helpers';

jest.mock('../../../../src/screens/task/ux');
jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);


describe('Exercise Tasks Screen', () => {
  let props;
  let step;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    step = Factory.studentTask({ type: 'homework', stepCount: 1 }).steps[0];
    const ux = new UX();
    Object.assign(ux, {
      course: Factory.course(),
      onAnswerSave: jest.fn(),
      currentStep: step,
    });
    props = { ux, step: step, windowImpl: new FakeWindow };
  });

  it('matches snapshot', () => {
    expect(<Exercise {...props} />).toMatchSnapshot();
  });

  it('can answer', () => {
    const ex = mount(<Exercise {...props} />);
    setFreeResponse(ex, { value: 'test' });
    ex.find('Answer button').first().simulate('click');
    ex.find('AsyncButton').simulate('click');
    expect(props.ux.onAnswerSave).toHaveBeenCalledWith(
      step, step.content.questions[0].answers[0],
    );
    ex.unmount();
  });

});
