import Renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import Factory from '../../factories';
import ExerciseControls from '../../../src/components/exercise/controls';


describe('Exercise controls component', function() {
  let exercise;
  let props;

  beforeEach(() => {
    const exercises = Factory.exercisesMap();
    exercise = exercises.array[0];
    props = {
      exercises,
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

});
