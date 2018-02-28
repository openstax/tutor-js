import Factory, { FactoryBot } from '../../factories';
import { SnapShot, Wrapper } from '../../components/helpers/component-testing';
import EnzymeContext from '../../components/helpers/enzyme-context';
import Dashboard from '../../../src/screens/question-library/dashboard';
import ExerciseHelpers from '../../../src/helpers/exercise';

jest.mock('../../../../shared/src/components/html');
jest.mock('../../../src/helpers/exercise');

describe('Questions Dashboard Component', function() {
  let props, course, exercises, book;

  beforeEach(function() {
    course = Factory.course();
    book = course.referenceBook;
    course.referenceBook.onApiRequestComplete({ data: [FactoryBot.create('Book')] });
    exercises = Factory.exercisesMap({ ecosystem_id: course.ecosystem_id, pageIds: [], count: 0 });
    exercises.fetch = jest.fn();
    props = {
      course,
      exercises,
    };
  });

  const displayExercises = () => {
    const page_ids = course.referenceBook.children[1].children.map(pg => pg.id);
    const dash = mount(<Dashboard {...props} />, EnzymeContext.build());
    dash.find('.chapter-heading .tutor-icon').at(1).simulate('click');
    dash.find('.section-controls .btn-primary').simulate('click');
    const items = page_ids.map(page_id =>
      FactoryBot.create('TutorExercise', { page_uuid: book.pages.byId.get(page_id).uuid }),
    );
    exercises.onLoaded({ data: { items } }, [{ book, page_ids }]);
    return dash;
  };

  it('matches snapshot', () => {
    expect(SnapShot.create(<Wrapper _wrapped_component={Dashboard} {...props} />).toJSON()).toMatchSnapshot();
  });

  it('fetches and displays', () => {
    const dash = mount(<Dashboard {...props} />, EnzymeContext.build());
    expect(dash).not.toHaveRendered('.no-exercises');
    const page_ids = course.referenceBook.children[1].children.map(pg => pg.id);
    dash.find('.chapter-heading .tutor-icon').at(1).simulate('click');
    dash.find('.section-controls .btn-primary').simulate('click');
    expect(dash).toHaveRendered('.no-exercises');
    expect(exercises.fetch).toHaveBeenCalledWith({ book, page_ids });
    const items = page_ids.map(page_id =>
      FactoryBot.create('TutorExercise', { page_uuid: book.pages.byId.get(page_id).uuid }),
    );
    exercises.onLoaded({ data: { items } }, [{ book, page_ids }]);
    expect(dash).not.toHaveRendered('.no-exercises');
    dash.unmount();
  });

  it('renders exercise details', () => {
    const dash = displayExercises();
    dash.find('.action.details').at(0).simulate('click');
    expect(dash).toHaveRendered('.exercise-details');
    dash.unmount();
  });

  it('can exclude exercises', () => {
    const dash = displayExercises();
    dash.find('.action.details').at(0).simulate('click');
    expect(dash).toHaveRendered('.exercise-details');
    course.saveExerciseExclusion = jest.fn();
    const uid = dash.find('[data-exercise-id]').last().prop('data-exercise-id');
    const exercise = exercises.array.find(e => uid == e.content.uid);
    dash.find(`[data-exercise-id="${uid}"] .action.exclude`).simulate('click');
    expect(course.saveExerciseExclusion).toHaveBeenCalledWith({ exercise, is_excluded: true });
    dash.unmount();
  });

  it('can report errors', () => {
    const dash = displayExercises();
    dash.find('.action.details').at(0).simulate('click');
    dash.find('.action.report-error').simulate('click');
    const uid = dash.find('[data-exercise-id]').last().prop('data-exercise-id');
    const exercise = exercises.array.find(e => uid == e.content.uid);
    expect(ExerciseHelpers.openReportErrorPage).toHaveBeenCalledWith(exercise, course);
  });

});
