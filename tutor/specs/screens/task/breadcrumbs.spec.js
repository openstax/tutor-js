import UX from '../../../src/screens/task/ux';
import { Breadcrumbs } from '../../../src/screens/task/breadcrumbs';
import { Factory, C, TestRouter } from '../../helpers';

describe('Homework Breadcrumbs Component', () => {
  let props;

  beforeEach(() => {
    const task = Factory.studentTasks({
      count: 1,
      attributes: { type: 'homework' },
    }).array[0];
    props = {
      goToStep: jest.fn(),
      ux: new UX({ task, router: new TestRouter }),
    };
  });

  it('matches snapshot', () => {
    expect(<Breadcrumbs {...props} />).toMatchSnapshot();
  });

  fit('goes to step', () => {
    const { ux } = props;
    jest.spyOn(props.ux, 'goToStep');
    const ms = mount(<C><Breadcrumbs {...props} /></C>);
    ms.find('Breadcrumb[stepIndex=1]').simulate('click');
    expect(ux.goToStep).toHaveBeenCalledWith(1, expect.anything());
    ms.unmount();
  });

});
