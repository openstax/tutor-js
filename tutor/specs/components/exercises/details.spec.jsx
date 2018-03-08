import { React, SnapShot } from '../helpers/component-testing';
import Details from '../../../src/components/exercises/details';
import FakeWindow from 'shared/specs/helpers/fake-window';
import Factory from '../../factories';

jest.mock('../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercise Details Component', function() {

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
      selectedExercise:       exercises.array[1],
      onExerciseToggle:       jest.fn(),
      getExerciseIsSelected:  jest.fn().mockReturnValue(false),
      getExerciseActions:     jest.fn().mockReturnValue({}),
      onShowCardViewClick:    jest.fn(),
    };
  });


  it('renders and matches snapshot', () => {
    const component = SnapShot.create(<Details {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
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
