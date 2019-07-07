import { Factory, FakeWindow, moment } from '../../helpers';
import UX from '../../../src/screens/assignment-builder/ux';
import { COMPLETE } from '../../../src/models/exercises';
export * from '../../helpers';

export function createUX({ now, type }) {
  const course = Factory.course();
  const plan = Factory.teacherTaskPlan({ now, course, type });
  const exercises = Factory.exercisesMap({ book: course.referenceBook });
  const ux = new UX({
    plan,
    course,
    exercises,
    windowImpl: new FakeWindow,
  });
  ux.exercises.fetch = jest.fn(function({ page_ids }) {
    page_ids.forEach(pgId => this.fetched.set(pgId, COMPLETE));
  });
  ux.plan.settings.page_ids = Object.keys(ux.exercises.byPageId);
  return ux;
}

export function setTaskDates({ plan, now }) {

  const opens_at = moment(now).add(1, 'day');
  const due_at = moment(now).add(3, 'day');
  plan.find('Tasking .opens-at TutorDateInput input[onChange]')
    .simulate('change', { target: { value: opens_at.format('MM/DD/YYYY') } });
  plan.find('Tasking .opens-at TutorTimeInput input[onChange]')
    .simulate('change', { target: { value: opens_at.format('h:mma') } });
  plan.find('Tasking .due-at TutorDateInput input[onChange]')
    .simulate('change', { target: { value: due_at.format('MM/DD/YYYY') } });
  plan.find('Tasking .due-at TutorTimeInput input[onChange]')
    .simulate('change', { target: { value: due_at.format('h:mma') } });

  return { due_at, opens_at };
}
