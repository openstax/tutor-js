import ExercisePreview from 'components/exercise/preview';
import Exercise from '../../src/components/exercise';
import ExerciseModel from '../../src/models/exercises/exercise';
import Factory from '../factories';

import Renderer from 'react-test-renderer';
import { ExerciseActions } from 'stores/exercise';

jest.mock('../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercises component', () => {
  let exercise;
  let props;

  beforeEach(() => {
    const exercises = Factory.exercisesMap();
//    exercises.onFetched = jext.fn
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
    const ex = Renderer.create(<Exercise {...props} />);
    expect(ex.toJSON()).toMatchSnapshot();
    ex.unmount();
  });

  fit('renders with intro and a multiple questions when exercise is MC', () => {
    props.exercise = new ExerciseModel(Factory.data('Exercise', { multipart: true, foo: 'bar' }));

    const ex = mount(<Exercise {...props} />);
    console.log(props.exercise.questions.length);

    // Testing.renderComponent( Exercise, { props } ).then(function({ dom }) {
    //   const tabs = _.pluck(dom.querySelectorAll('.nav-tabs li'), 'textContent');
    //   return expect(tabs).to.deep.equal(['Intro', 'Question 1', 'Question 2', 'Tags', 'Assets']);
    // })
  });

  it('renders with out intro and a single question when exercise is MC', function() {
    ExerciseActions.toggleMultiPart(props.id);
    return Testing.renderComponent( Exercise, { props } ).then(function({ dom }) {
      const tabs = _.pluck(dom.querySelectorAll('.nav-tabs li'), 'textContent');
      return expect(tabs).to.deep.equal(['Question', 'Tags', 'Assets']);
    });
  });

  return it('displays question formats on preview', () =>
    Testing.renderComponent( Exercise, { props } ).then(({ dom }) => expect(dom.querySelector('.openstax-exercise-preview .formats-listing')).to.exist)
  );
});
