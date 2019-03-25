import UX from '../../../src/screens/task/ux';
import { Milestones } from '../../../src/screens/task/milestones';
import { Factory, TestRouter } from '../../helpers';

describe('Reading Milestones Component', () => {
  let props;

  beforeEach(() => {
    const task = Factory.studentTasks({
      count: 1,
      attributes: { type: 'reading' },
    }).array[0];
    props = {
      goToStep: jest.fn(),
      ux: new UX({ task, router: new TestRouter() }),
    };
  });

  it('matches snapshot', () => {
    expect(<Milestones {...props} />).toMatchSnapshot();
  });

  it('goes to step', () => {
    const ms = mount(<Milestones {...props} />);
    ms.find('Breadcrumb[stepIndex=1]').simulate('click');
    expect(props.goToStep).toHaveBeenCalledWith(props.ux.steps[1]);
    ms.unmount();
  });

});
