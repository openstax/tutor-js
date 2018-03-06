import Snapshot from 'react-test-renderer';
import ExercisePreview from '../../../src/components/exercise-preview';
import Factories from '../../factories';

jest.mock('../../../src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);
// import EXERCISE from '../../../api/exercise-preview/data.json';
// const ANSWERS  = EXERCISE.content.questions[0].answers;

describe('Exercise Preview Component', function() {
  let props;
  let exercise;

  beforeEach(() => {
    exercise = Factories.exercise({});
    props = {
      exercise,
    }
  });

  it('renders and matches snapshot', () => {
    expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
  });

  it('sets the className when displaying feedback', () => {
    props.displayFeedback = true;
    const preview = mount(<ExercisePreview {...props} />);
    expect(preview).toHaveRendered('.openstax-exercise-preview.is-displaying-feedback');
    expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
  });

  it('can hide the answers', function() {
    props.hideAnswers = true;
    const preview = mount(<ExercisePreview {...props} />);
    expect(preview).not.toHaveRendered('.answers-table');
    expect(preview).toHaveRendered('.answers-hidden');
    expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
  });

  it('can render question formats', () => {
    props.displayFormats = true;
    const preview = mount(<ExercisePreview {...props} />);
    expect(preview.find('.formats-listing span').map(f => f.text())).toEqual([
      'free-response', 'multiple-choice',
    ]);
    expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
  });

  it('does not render overlay by default', () => {
    const preview = mount(<ExercisePreview {...props} />);
    expect(preview).not.toHaveRendered('.controls-overlay');
  });

  it('callbacks are called when overlay and actions are clicked', function() {
    const onSelect = jest.fn();
    const actions = {
      include: {
        message: 'ReInclude question',
        handler: jest.fn(),
      },
    };
    Object.assign(props, { overlayActions: actions, onOverlayClick: onSelect });
    const preview = mount(<ExercisePreview {...props} />);
    expect(preview).toHaveRendered('.controls-overlay');
    preview.find('.controls-overlay').simulate('click');
    expect(onSelect).toHaveBeenCalled();
    preview.find('.controls-overlay .action.include').simulate('click');
    expect(actions.include.handler).toHaveBeenCalled();
    expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
  });

  it('hides context if missing', function() {
    props.exercise.context = '';
    const preview = mount(<ExercisePreview {...props} />);
    expect(preview).not.toHaveRendered('.context');
    expect(Snapshot.create(<ExercisePreview {...props} />).toJSON()).toMatchSnapshot();
  });

});
