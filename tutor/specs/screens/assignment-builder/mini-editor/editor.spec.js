import { React, C, TimeMock, createUX, moment } from '../helpers';
import Editor from '../../../../src/screens/assignment-builder/mini-editor/editor';

describe('TaskPlan MiniEditor wrapper', function() {
  let props;

  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(async () => {
    const ux = await createUX({ now, type: 'homework', onCancel: jest.fn() });
    ux.plan.settings.exercise_ids = [ux.exercises.array[0].id];
    ux.sourcePlanId = '99';
    props = { ux, onHide: jest.fn() };
  });

  it('saves on happy path', () => {
    const editor = mount(<C><Editor {...props} /></C>);

    editor.find('.assignment-name input').simulate('change', {
      target: { value: 'a homework' },
    });
    const opens_at = moment(now).add(1, 'day');
    const due_at = moment(now).add(3, 'day');
    editor.find('Tasking .opens-at TutorDateInput input[onChange]')
      .simulate('change', { target: { value: opens_at.format('MM/DD/YYYY') } });
    editor.find('Tasking .opens-at TutorTimeInput input[onChange]')
      .simulate('change', { target: { value: opens_at.format('h:mma') } });
    editor.find('Tasking .due-at TutorDateInput input[onChange]')
      .simulate('change', { target: { value: due_at.format('MM/DD/YYYY') } });
    editor.find('Tasking .due-at TutorTimeInput input[onChange]')
      .simulate('change', { target: { value: due_at.format('h:mma') } });

    jest.spyOn(props.ux.plan, 'save');
    editor.find('SaveButton AsyncButton').simulate('click');
    expect(props.ux.plan.save).toHaveBeenCalled();

    expect(props.ux.plan.dataForSave).toEqual({
      type: 'homework',
      title: 'a homework',
      ecosystem_id: 1,
      is_feedback_immediate: false,
      description: props.ux.plan.description,
      is_publish_requested: !props.ux.plan.is_published,
      tasking_plans: props.ux.course.periods.map(p => ({
        target_id: p.id,
        target_type: 'period',
        opens_at: props.ux.course.momentInZone(opens_at).format('YYYY-MM-DD HH:mm'),
        due_at: props.ux.course.momentInZone(due_at).format('YYYY-MM-DD HH:mm'),
      })),
      settings: {
        exercises_count_dynamic: 3,
        exercise_ids: props.ux.plan.settings.exercise_ids,
        page_ids: props.ux.plan.settings.page_ids,
      },
    });

    editor.unmount();
  });

  it('hides itself when cancel is clicked', function() {
    const wrapper = mount(<C><Editor {...props} /></C>);
    wrapper.find('button.cancel').simulate('click');
    expect(props.ux.onComplete).toHaveBeenCalled();
  });

});
