import Cards from '../../../src/components/exercises/cards';
import FakeWindow from 'shared/specs/helpers/fake-window';
import Factory from '../../factories';

jest.mock('../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercise Cards Component', function() {

  let exercises, props, book;

  beforeEach(() => {
    book = Factory.book();
    const pageIds = book.pages.byId.keys();
    exercises = Factory.exercisesMap({ book, pageIds, count: 4 });
    props = {
      book,
      exercises,
      pageIds,
      windowImpl:             new FakeWindow,
      onExerciseToggle:       jest.fn(),
      getExerciseIsSelected:  jest.fn().mockReturnValue(false),
      getExerciseActions:     jest.fn().mockReturnValue({}),
      onShowDetailsViewClick: jest.fn(),
    };
  });

  it('renders', () => {
    const c = mount(<Cards {...props} />);
    expect(c).toHaveRendered('ExercisePreview');
    c.unmount();
  });

});
