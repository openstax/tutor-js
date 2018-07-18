import { MemoryRouter, StaticRouter } from 'react-router-dom';
import Renderer from 'react-test-renderer';
import Exercise from '../../src/components/exercise';
import ExerciseModel from '../../src/models/exercises/exercise';
import Factory from '../factories';
import EnzymeContext from '../../../tutor/specs/components/helpers/enzyme-context';
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
          uid: exercise.uid,
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

  it('can save edits', () => {
    expect(props.exercises.get(exercise.uid)).not.toBeUndefined();
    const ex = mount(<Exercise {...props} />, EnzymeContext.build());
    ex.find('.nickname input').simulate('change', {
      target: { value: 'MY-NICK-NAME' },
    });
    expect(exercise.nickname).toEqual('MY-NICK-NAME');
    ex.unmount();
  });

  it('resets fields when model is new', () => {
    const ex = mount(<Exercise {...props} />, EnzymeContext.build());
    props.exercises.createNewRecord();
    ex.setProps({ match: { params: { uid: 'new' } } });
    expect(ex.debug()).toMatchSnapshot();
    ex.unmount();
  });

});
