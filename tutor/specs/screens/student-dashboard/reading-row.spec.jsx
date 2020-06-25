import moment from 'moment';
import { React, TimeMock, C } from '../../helpers';
import Factory from '../../factories';
import Row from '../../../src/screens/student-dashboard/event-row';
import Theme from '../../../src/theme';

describe('Reading Row', function() {
  let props;
  const now = new Date('2017-10-14T12:00:00.000Z');
  TimeMock.setTo(now);

  beforeEach(function() {
    props = {
      event: Factory.studentDashboardTask({ type: 'reading', days_ago: 3 }),
      course: Factory.course(),
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<C><Row {...props} /></C>).toMatchSnapshot();
  });

  fit('renders unstarted', function() {
    props.event.completed_steps_count = 0;
    props.event.complete = false;
    const row = mount(<C><Row {...props} /></C>);
    expect(row.find('StatusCell').text()).toEqual('Not started');
    expect(row).toHaveRendered('Icon[type="clock"]');
    row.unmount();
  });

  it('renders in progress', function() {
    props.event.last_worked_at = new Date();
    props.event.completed_steps_count = 1;
    props.event.complete = false;
    const row = mount(<C><Row {...props} /></C>);
    expect(row.find('Col[className="feedback"]').text()).toEqual('In progress');
    expect(row).toHaveRendered('Icon[type="clock"]');
    row.unmount();
  });

  it('renders complete', function() {
    props.event.complete = true;
    props.event.completed_steps_count = 1;
    const row = mount(<C><Row {...props} /></C>);
    expect(row.find('Col[className="feedback"]').text()).toEqual('Complete');
    row.unmount();
  });

  it('renders icon', () => {
    props.event.completed_steps_count = 1;
    props.event.due_at = new Date(now.getTime() + ( 18*60*60*1000 ));
    props.event.complete = false;
    const row = mount(<C><Row {...props} /></C>);

    expect(row.find('Col[className="feedback"]').text()).toEqual('In progress');
    expect(row).toHaveRendered('Icon[type="exclamation-circle"]');

    props.event.due_at = new Date(now.getTime() - ( 36*60*60*1000 ));
    expect(row).toHaveRendered(`Icon[type="clock"][color="${Theme.colors.danger}"]`);

    props.event.accepted_late_at = new Date(now.getTime() - ( 48*60*60*1000 ));
    props.event.last_worked_at = props.event.accepted_late_at - 1;
    expect(row).toHaveRendered(`Icon[type="clock"][color="${Theme.colors.neutral.thin}"]`);

    row.unmount();
  });


});
