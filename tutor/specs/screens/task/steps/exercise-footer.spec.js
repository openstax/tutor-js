import { ExerciseFooter } from '../../../../src/screens/task/step/exercise-footer';
import { Factory, TimeMock } from '../../../helpers';

describe('Exercise Free Response', () => {
  let props;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    const task = Factory.studentTask({ type: 'homework', stepCount: 1 });
    props = {
      course: Factory.course(), step: task.steps[0],
    };
  });

  it('matches snapshot', () => {
    const exf = mount(<ExerciseFooter {...props} />);
    expect(exf.debug()).toMatchSnapshot();
    exf.unmount();
  });

});
