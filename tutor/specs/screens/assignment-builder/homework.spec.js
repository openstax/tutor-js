import Homework from '../../../src/screens/assignment-builder/homework';
import { C, TimeMock, moment, createUX } from './helpers';

jest.mock('../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Homework Builder', function() {
  let props, ux;

  const now = TimeMock.setTo('2015-01-12T10:00:00.000Z');

  beforeEach(() => {
    ux = createUX({ now, type: 'homework' });
    props = { ux };
    props = { ux, exercises: ux.exercises };
  });

  it('works on happy path', function() {
    props.ux.plan.settings.page_ids = [];
    const hw = mount(<C><Homework {...props} /></C>);
    hw.find('.assignment-name input').simulate('change', {
      target: { value: 'a homework' },
    });
    hw.find('.assignment-description textarea').simulate('change', {
      target: { value: 'a homework description' },
    });
    const opens_at = moment(now).add(1, 'day');
    const due_at = moment(now).add(3, 'day');
    hw.find('Tasking .opens-at TutorDateInput input[onChange]')
      .simulate('change', { target: { value: opens_at.format('MM/DD/YYYY') } });
    hw.find('Tasking .opens-at TutorTimeInput input[onChange]')
      .simulate('change', { target: { value: opens_at.format('h:mma') } });
    hw.find('Tasking .due-at TutorDateInput input[onChange]')
      .simulate('change', { target: { value: due_at.format('MM/DD/YYYY') } });
    hw.find('Tasking .due-at TutorTimeInput input[onChange]')
      .simulate('change', { target: { value: due_at.format('h:mma') } });
    hw.find('button#select-sections').simulate('click');
    expect(hw).toHaveRendered('SelectSections ChapterAccordion');
    hw.find('.chapter-checkbox button').at(1).simulate('click');
    hw.find('button#add-sections-to-homework').simulate('click');
    expect(hw).toHaveRendered('AddExercises');
    expect(props.ux.isShowingExercises).toBe(true);
    const preview = hw.find('ExercisePreview').at(0);
    const { exercise } = preview.props();
    preview.find('ControlsOverlay .include').simulate('click');
    expect(ux.plan.settings.exercise_ids).toContain(exercise.wrapper.id);
    expect(ux.plan.numExercises).toEqual(1);
    ux.onExercisesReviewClicked();
    expect(hw).toHaveRendered('ReviewExercises');
    jest.spyOn(props.ux.plan, 'save');
    hw.find('SaveButton AsyncButton').simulate('click');
    expect(props.ux.plan.save).toHaveBeenCalled();
    expect(props.ux.plan.dataForSave).toEqual({
      title: 'a homework',
      is_publish_requested: true,
      description: 'a homework description',
      tasking_plans: props.ux.course.periods.map(p => ({
        target_id: p.id,
        target_type: 'period',
        due_at: due_at.toISOString(),
        opens_at: opens_at.toISOString(),
      })),
      settings: {
        exercise_ids: [ exercise.wrapper.id ],
        page_ids: props.ux.referenceBook.children[1].children.map(p => p.id),
      },
    });
    hw.unmount();
  });
});
