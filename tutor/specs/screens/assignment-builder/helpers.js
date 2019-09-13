import { Factory, FakeWindow, moment } from '../../helpers';
import UX from '../../../src/screens/assignment-builder/ux';
import { COMPLETE } from '../../../src/models/exercises';
import Time from '../../../src/helpers/time';
export * from '../../helpers';

export async function createUX({ now = Time.now, type = 'homework' } = {}) {
  const course = Factory.course();
  const plan = Factory.teacherTaskPlan({ now, course, id: null, is_published: false, type });
  plan.fetch = jest.fn();
  const exercises = Factory.exercisesMap({ book: course.referenceBook });
  const ux = new UX();
  await ux.initialize({
    plan,
    course,
    exercises,
    onComplete: jest.fn(),
    windowImpl: new FakeWindow,
    history: { push: jest.fn() },
  });
  ux.exercises.fetch = jest.fn(function({ page_ids }) {
    page_ids.forEach(pgId => this.fetched.set(pgId, COMPLETE));
  });

  ux.plan.settings.page_ids = Object.keys(ux.exercises.byPageId);
  return ux;
}

export function setTaskDates({ form, now }) {
  const opens_at = moment(now).add(1, 'day');
  const due_at = moment(now).add(3, 'day');

  form.find('Tasking .opens-at TutorDateInput input[onChange]')
    .simulate('change', { target: { value: opens_at.format('MM/DD/YYYY') } });
  form.find('Tasking .opens-at TutorTimeInput input[onChange]')
    .simulate('change', { target: { value: opens_at.format('HH:mm') } });
  form.find('Tasking .due-at TutorDateInput input[onChange]')
    .simulate('change', { target: { value: due_at.format('MM/DD/YYYY') } });
  form.find('Tasking .due-at TutorTimeInput input[onChange]')
    .simulate('change', { target: { value: due_at.format('HH:mm') } });

  return { due_at, opens_at };
}
