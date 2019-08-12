import Details from '../../../src/components/exercises/details';
import { FakeWindow, Factory } from '../../helpers';

jest.mock('../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercise Details Component', function() {

  let exercises, props, book;

  beforeEach(() => {
    book = Factory.book();
    const pageIds = Array.from(book.pages.byId.keys());
    exercises = Factory.exercisesMap({ book, pageIds, count: 4 });
    props = {
      book,
      exercises,
      pageIds,
      selectedSection:        book.chapter_section,
      windowImpl:             new FakeWindow,
      selectedExercise:       exercises.array[1],
      onExerciseToggle:       jest.fn(),
      getExerciseIsSelected:  jest.fn().mockReturnValue(false),
      getExerciseActions:     jest.fn().mockReturnValue({}),
      onShowCardViewClick:    jest.fn(),
    };
  });

  it('renders and matches snapshot', () => {
    expect.snapshot(<Details {...props} />).toMatchSnapshot();
  });

  it('can navigate back/forward', () => {
    const deets = mount(<Details {...props} />);
    expect(deets).toHaveRendered(`[data-exercise-id="${exercises.array[1].content.uid}"]`);
    deets.find('.paging-control.next').simulate('click');
    expect(deets).toHaveRendered(`[data-exercise-id="${exercises.array[2].content.uid}"]`);
    deets.find('.paging-control.prev').simulate('click');
    deets.find('.paging-control.prev').simulate('click');
    expect(deets).toHaveRendered(`[data-exercise-id="${exercises.array[0].content.uid}"]`);
    expect(deets).toHaveRendered('.paging-control.prev[disabled]');
  });

});
