import { MemoryRouter } from 'react-router-dom';
import Renderer from 'react-test-renderer';
import Exercise from '../../src/components/exercise';
import ExerciseModel from '../../src/models/exercises/exercise';
import Factory from '../factories';

jest.mock('../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercises component', () => {
  let exercise;
  let props;

  beforeEach(() => {
    const exercises = Factory.exercisesMap();
    exercise = exercises.array[0];
    props = {
      exercises,
      match: {
        params: {
          numberWithVersion: exercise.number,
        },
      },
    };
  });

  it('renders and matches snapshot', () => {
    const ex = Renderer.create(<MemoryRouter><Exercise {...props} /></MemoryRouter>);
    expect(ex.toJSON()).toMatchSnapshot();
    ex.unmount();
  });

  it('renders with intro and a multiple questions when exercise is MC', () => {
    props.exercise = new ExerciseModel(Factory.data('Exercise', { multipart: true }));
    const ex = Renderer.create(<MemoryRouter><Exercise {...props} /></MemoryRouter>);
    expect(ex.toJSON()).toMatchSnapshot();
    ex.unmount();
  });

});
