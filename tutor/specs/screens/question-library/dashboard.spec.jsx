import { C } from '../../helpers';
import Factory, { FactoryBot } from '../../factories';
import { last } from 'lodash';
import Dashboard from '../../../src/screens/question-library/dashboard';
import ExerciseHelpers from '../../../src/helpers/exercise';
import ScrollTo from '../../../src/helpers/scroll-to';

jest.mock('../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);
jest.mock('../../../src/helpers/exercise');
jest.mock('../../../src/helpers/scroll-to');

describe('Questions Dashboard Component', function() {
  let props, course, exercises, book, page_ids;

  beforeEach(function() {
    course = Factory.course();
    book = course.referenceBook;
    course.referenceBook.onApiRequestComplete({ data: [FactoryBot.create('Book')] });
    exercises = Factory.exercisesMap({ ecosystem_id: course.ecosystem_id, pageIds: [], count: 0 });

    exercises.fetch = jest.fn(() => Promise.resolve());
    page_ids = course.referenceBook.children[1].children.assignable.map(p => p.id);
    const items = page_ids.map(page_id =>
      FactoryBot.create(
        'TutorExercise',
        {
          // QL displays homework assignment first
          pool_types: ['homework_core'],
          page_uuid: book.pages.byId.get(page_id).uuid,
        },
      ),
    );
    exercises.onLoaded({ data: { items } }, [{ book, page_ids }]);
    props = {
      course,
      exercises,
    };
  });

  const displayExercises = () => {
    const dash = mount(<C><Dashboard {...props} /></C>);
    dash.find('.chapter-checkbox button').at(1).simulate('click');
    dash.find('.section-controls .btn-primary').simulate('click');
    return dash;
  };

  it('fetches and displays', () => {
    const dash = mount(<C><Dashboard {...props} /></C>);
    expect(dash).not.toHaveRendered('NoExercisesFound');
    dash.find(`div[data-section-id="${page_ids[0]}"]`).simulate('click');
    dash.find('.section-controls .btn-primary').simulate('click');
    expect(exercises.fetch).toHaveBeenCalledWith({
      course: course, limit: false, page_ids: [page_ids[0]],
    });
    expect(dash).not.toHaveRendered('NoExercisesFound');
    dash.unmount();
  });

  it('renders exercise details', () => {
    const dash = displayExercises();
    expect(dash).not.toHaveRendered('NoExercisesFound');
    const uid = dash.find('[data-exercise-id]').last().prop('data-exercise-id');
    dash.find(`[data-exercise-id="${uid}"] .action.details`).simulate('click');
    expect(dash).toHaveRendered('.exercise-details');
    dash.find('a.show-cards').simulate('click');
    expect(dash).toHaveRendered('.exercise-cards');
    expect(last(ScrollTo.mock.instances).scrollToSelector).toHaveBeenCalledWith(
      `[data-exercise-id="${uid}"]`, { immediate: true }
    );
    dash.unmount();
  });

  it('renders details, then select more sections, then display', () => {
    const dash = mount(<C><Dashboard {...props} /></C>);
    expect(dash).toHaveRendered('SectionsChooser');
    const input = `[data-section-id="${page_ids[1]}"] Icon`;
    // square is not selected
    expect(dash.find(input).first().props().type).toBe('square');
    dash.find(input).first().simulate('click');
    dash.find('.section-controls .btn-primary').simulate('click');
    expect(dash).toHaveRendered('ExercisesDisplay');
    dash.find('.action.details').at(0).simulate('click');
    expect(dash).toHaveRendered('ExerciseDetails');
    dash.find('ExercisesDisplay').props().onSelectSections();
    expect(dash).toHaveRendered('SectionsChooser');
    // check-square-solid is selected
    expect(dash.find(input).first().props().type).toBe('check-square-solid');
    dash.find('.section-controls .btn-primary').simulate('click');
    expect(dash).toHaveRendered('ExercisesDisplay');
    expect(dash).not.toHaveRendered('ExerciseDetails');
    dash.unmount();
  });

  it('can exclude exercises', () => {
    const dash = displayExercises();
    expect(dash).not.toHaveRendered('NoExercisesFound');
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
    expect(dash).not.toHaveRendered('NoExercisesFound');
    dash.find('.action.details').at(0).simulate('click');
    dash.find('.action.report-error').simulate('click');
    const uid = dash.find('[data-exercise-id]').last().prop('data-exercise-id');
    const exercise = exercises.array.find(e => uid == e.content.uid);
    expect(ExerciseHelpers.openReportErrorPage).toHaveBeenCalledWith(exercise, course);
    dash.unmount();
  });

  it('clears when cancel is clicked', () => {
    const dash = mount(<C><Dashboard {...props} /></C>);
    dash.find('.chapter-checkbox button').at(1).simulate('click');
    expect(dash.find('.section.selected').length).toBeGreaterThan(10);
    dash.find('button.cancel').simulate('click');
    expect(dash.find('.section.selected')).toHaveLength(0);
    dash.unmount();
  });

});
