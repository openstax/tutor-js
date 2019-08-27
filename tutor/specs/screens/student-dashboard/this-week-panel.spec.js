import moment from 'moment-timezone';
import ThisWeek from '../../../src/screens/student-dashboard/this-week-panel';
import { Factory, TimeMock, React } from '../../helpers';

describe('This Week Events', () => {

  let props;
  const now = new Date('2017-10-14T12:00:00.000Z');
  TimeMock.setTo(now);

  beforeEach(() => {
    props = {
      course: Factory.course(),
    };
  });

  it('shows anything due this week', () => {
    const panel = mount(<ThisWeek {...props} />);
    expect(panel.text()).toContain('Preparing assignments for your course.');

    // no tasks
    props.course.studentTaskPlans.all_tasks_are_ready = true;
    expect(panel.text()).toContain('No assignments this week');

    const event = Factory.studentDashboardTask();

    // add task that's due next week
    event.due_at = moment(now).endOf('isoweek').add(1, 'day').toDate();
    props.course.studentTaskPlans.set(event.id, event);
    expect(panel.text()).not.toContain(event.title);

    // subtract a day so it's due this week
    event.due_at = moment(event.due_at).subtract(1, 'day').toDate();
    panel.update();
    expect(panel.text()).toContain(event.title);

    // subtract an entire week so it's last week day so it's due this week
    event.due_at = moment(now).subtract(1, 'week').toDate();
    panel.update();
    expect(panel.text()).not.toContain(event.title);
    panel.unmount();
  });

  it('displays teacher pending notice', () => {
    const { course } = props;
    course.primaryRole.type = 'teacher_student';
    course.teacherTaskPlans.set(1, { id: '1', last_published_at: '2017-01-02T00:00:00.000Z' });
    const panel = mount(<ThisWeek {...props} />);
    expect(panel).toHaveRendered('TeacherPendingLoad');
    expect(panel.text()).toContain('Building assignment');
    panel.unmount();
  });

});
