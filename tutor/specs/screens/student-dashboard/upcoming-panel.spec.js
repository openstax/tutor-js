import moment from 'moment-timezone';
import Upcoming from '../../../src/screens/student-dashboard/upcoming-panel';
import { TimeMock, R, React } from '../../helpers';
import Factory from '../../factories';

describe('Upcoming Events', () => {

  let props;
  const now = new Date('2017-10-14T12:00:00.000Z');
  TimeMock.setTo(now);

  beforeEach(() => {
    props = {
      course: Factory.course(),
    };
  });

  it('shows anything past next week', () => {
    const panel = mount(<R><Upcoming {...props} /></R>);
    expect(panel.text()).toContain('No upcoming assignments');

    const event = Factory.studentDashboardTask();
    const day = moment(now).endOf('week').add(1, 'day');
    expect(day.format('ddd')).toEqual('Sun');
    event.due_at = day.toDate();
    props.course.studentTaskPlans.set(event.id, event);

    expect(panel.text()).toContain(event.title);

    // subtract a day so it's due this week
    event.due_at = moment(event.due_at).subtract(1, 'day').toDate();
    expect(panel.text()).not.toContain(event.title);

    // go crazy and add a year
    event.due_at = moment(event.due_at).add(1, 'year').toDate();
    expect(panel.text()).toContain(event.title);
  });

});
