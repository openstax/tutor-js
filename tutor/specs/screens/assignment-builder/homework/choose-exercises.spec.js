import { React, C, createUX, TimeMock } from '../helpers';
import ChooseExercises from '../../../../src/screens/assignment-builder/homework/choose-exercises';
import { FactoryBot } from '../../../factories';

jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);
jest.mock('../../../../src/helpers/scroll-to');

describe('choose exercises component', function() {
  let props, ux, page_ids, availableExercises;
  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  function renderExerciseCards(props) {
    props.ux.plan.settings.page_ids = [];
    const ce = mount(<C><ChooseExercises {...props} /></C>);
    ce.find('.chapter-checkbox button').at(1).simulate('click');
    ce.find('button#add-sections-to-homework').simulate('click');
    expect(props.ux.exercises.fetch).toHaveBeenCalled();
    props.ux.exercises.onLoaded({ data: { items: availableExercises } }, [{ book: props.ux.referenceBook, page_ids }]);
    expect(ce).toHaveRendered('AddExercises');
    return ce.update();
  }

  beforeEach(async () => {
    ux = await createUX({ now, type: 'homework' });
    props = { ux };
    page_ids = ux.referenceBook.children[1].children.map(pg => pg.id);
    availableExercises = page_ids.map(page_id =>
      FactoryBot.create('TutorExercise', { page_uuid: ux.referenceBook.pages.byId.get(page_id).uuid }),
    );
  });

  it('can select exercises', () => {
    const ce = renderExerciseCards(props);
    const exercise = ux.exercises.array[2];
    exercise.pool_types = ['homework_core'];
    expect(ce).toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    ce.find(
      `[data-exercise-id="${exercise.content.uid}"] .action.include`,
    ).simulate('click');
    expect(ux.plan.exerciseIds).toContain(exercise.id);
    ce.unmount();
  });

  it('hides excluded and reading exercises', () => {
    const ce = renderExerciseCards(props);
    const exercise = ux.exercises.array[1];
    exercise.pool_types = ['homework_core'];
    expect(ce).toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    exercise.is_excluded = true;
    expect(exercise.isAssignable).toBe(false);
    expect(ce).not.toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    exercise.is_excluded = false;
    expect(ce).toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    exercise.pool_types = ['reading_dynamic'];
    expect(exercise.isReading).toBe(true);
    expect(ce).not.toHaveRendered(`[data-exercise-id="${exercise.content.uid}"]`);
    ce.unmount();
  });

  it('shows exercise details', () => {
    const exercise = ux.exercises.array[0];
    exercise.pool_types = ['homework_core'];
    const ce = renderExerciseCards(props);
    ce.find(
      `[data-exercise-id="${exercise.content.uid}"] .action.details`
    ).simulate('click');
    expect(ce).toHaveRendered('.exercise-details');
    expect(ce).toHaveRendered('a[disabled=true][title="Go Back"]');
    expect(ce).toHaveRendered('a[disabled=false][title="Go Forward"]');
    ce.find('a.show-cards').simulate('click');
    expect(ce).toHaveRendered('.exercise-cards');
    ce.unmount();
  });

});
