import UX from '../../../src/screens/task/ux';
import { Milestones } from '../../../src/screens/task/milestones';
import { Factory, ld, TimeMock } from '../../helpers';

describe('Reading Milestones Component', () => {
  let props, history;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');
  beforeEach(() => {
    const task = Factory.studentTask({ type: 'reading' });
    props = {
      goToStep: jest.fn(),
      onHide: jest.fn(),
      ux: new UX({ task, course: Factory.course(), history }),
    };
    history = {
      push: (url) => {
        props.ux.goToStep(ld.last(url.split('/')), false);
      },
    };
  });

  it('matches snapshot', () => {
    expect(<Milestones {...props} />).toMatchSnapshot();
  });

  it('goes to step', () => {
    const ms = mount(<Milestones {...props} />);
    ms.find('Breadcrumb[stepIndex=1]').simulate('click');
    expect(props.ux._stepIndex).toEqual('2');
    expect(props.onHide).toHaveBeenCalled();
    ms.unmount();
  });

  it('displays correct/incorrect', () => {
    const step = props.ux.steps.find(s => s.type === 'exercise');

    step.is_completed = true;
    step.answer_id = step.correct_answer_id = 1;

    const ms = mount(<Milestones {...props} />);

    expect(ms).toHaveRendered(`[data-step-id=${step.id}] .icon-correct`);
    expect(ms).not.toHaveRendered(`[data-step-id=${step.id}] .icon-incorrect`);

    step.answer_id = 1234;
    expect(ms).toHaveRendered(`[data-step-id=${step.id}] .icon-incorrect`);
    expect(ms).not.toHaveRendered(`[data-step-id=${step.id}] .icon-correct`);

    ms.unmount();
  });

});
