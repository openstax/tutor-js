import Renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import Factory from '../../factories';
import ExerciseControls from '../../../src/components/exercise/controls';
import EnzymeContext from '../../../../tutor/specs/components/helpers/enzyme-context';

describe('Exercise controls component', function() {
  let exercise;
  let props;

  beforeEach(() => {
    const exercises = Factory.exercisesMap();
    exercise = exercises.array[0];
    props = {
      exercises,
      history: {
        push: jest.fn(),
      },
      match: {
        params: {
          uid: exercise.number,
        },
      },
    };
  });

  it('does not enable the save draft on blank exercises', () => {
    const ex = Renderer.create(<MemoryRouter><ExerciseControls {...props} /></MemoryRouter>);
    expect(ex.toJSON()).toMatchSnapshot();
    ex.unmount();
  });

  it('disables publish/draft if exercise is published', () => {
    const controls = mount(<ExerciseControls {...props} />, EnzymeContext.build());
    expect(controls.find('button.publish').props().disabled).toBe(false);
    exercise.published_at = new Date();
    expect(controls.find('button.draft').props().disabled).toBe(false);
    expect(controls.find('button.publish').props().disabled).toBe(true);
    controls.unmount();
  });

});
