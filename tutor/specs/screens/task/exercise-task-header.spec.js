import UX from '../../../src/screens/task/ux';
import ExerciseTaskHeader from '../../../src/screens/task/exercise-task-header';
import { Factory, C, TestRouter, TimeMock } from '../../helpers';

describe('Homework ExerciseTaskHeader Component', () => {
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
    expect(<ExerciseTaskHeader {...props} />).toMatchSnapshot();
  });

  it('goes to step', () => {
    const { ux } = props;
    jest.spyOn(props.ux, 'goToStep');
    const ms = mount(<C><ExerciseTaskHeader {...props} /></C>);
    ms.find('.sticky-table-row').at(0).find('.sticky-table-cell').at(1).simulate('click');
    expect(ux.goToStep).toHaveBeenCalledWith(0, expect.anything());
    ms.unmount();
  });

});
