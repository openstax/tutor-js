import Renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import Factory from '../../factories';
import ExerciseControls from '../../../src/components/exercise/controls';
import EnzymeContext from '../../../../tutor/specs/components/helpers/enzyme-context';
import ToastsStore from '../../../src/models/toasts';

jest.mock('../../../src/models/toasts', () => ({
  push: jest.fn(),
}));

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

  it('adds a toast when saved', () => {
    const controls = mount(<ExerciseControls {...props} />, EnzymeContext.build());
    exercise.published_at = new Date();
    props.exercises.saveDraft = jest.fn(() => Promise.resolve());
    controls.find('button.draft').simulate('click');
    expect(props.exercises.saveDraft).toHaveBeenCalled();
    controls.unmount();
    return new Promise((done) => {
      setTimeout(() => {
        expect(ToastsStore.push).toHaveBeenCalledWith({
          handler: 'published', status: 'ok',
          info: { isDraft: true, exercise },
        });
        done();
      });
    });
  });

  it('adds a toast when published', () => {
    const controls = mount(<ExerciseControls {...props} />, EnzymeContext.build());
    exercise.published_at = new Date();
    props.exercises.publish = jest.fn(() => Promise.resolve());
    controls.find('button.publish').simulate('click');
    controls.instance().publishExercise();
    expect(props.exercises.publish).toHaveBeenCalled();
    controls.unmount();
    return new Promise((done) => {
      setTimeout(() => {
        expect(ToastsStore.push).toHaveBeenCalledWith({
          handler: 'published', status: 'ok',
          info: { exercise },
        });
        expect(props.history.push).toHaveBeenCalledWith('/search');
        done();
      });
    });
  });

});
