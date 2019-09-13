import UX from '../../../src/screens/task/ux';
import { Breadcrumbs } from '../../../src/screens/task/breadcrumbs';
import { Factory, C, TestRouter, TimeMock } from '../../helpers';

describe('Homework Breadcrumbs Component', () => {
  let props;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');
  beforeEach(() => {
    const task = Factory.studentTasks({
      count: 1,
      attributes: { type: 'homework' },
    }).array[0];
    props = {
      unDocked: true,
      goToStep: jest.fn(),
      ux: new UX({ task, history: new TestRouter().history }),
    };
  });

  it('matches snapshot', () => {
    expect(<Breadcrumbs {...props} />).toMatchSnapshot();
  });

  it('goes to step', () => {
    const { ux } = props;
    jest.spyOn(props.ux, 'goToStep');
    const ms = mount(<C><Breadcrumbs {...props} /></C>);
    ms.find('Breadcrumb[stepIndex=1]').simulate('click');
    expect(ux.goToStep).toHaveBeenCalledWith(1, expect.anything());
    ms.unmount();
  });

});
