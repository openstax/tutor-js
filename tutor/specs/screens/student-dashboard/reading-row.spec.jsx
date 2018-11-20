import { React, TimeMock } from '../../helpers';
import Factory from '../../factories';
import ReadingRow from '../../../src/screens/student-dashboard/reading-row';

describe('Reading Row', function() {
  let props;
  const now = new Date('2017-10-14T12:00:00.000Z');
  TimeMock.setTo(now);

  beforeEach(function() {
    props = {
      event: Factory.studentDashboardTask({ type: 'reading' }),
      course: Factory.course(),
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<ReadingRow {...props} />).toMatchSnapshot();
  });

  it('renders unstarted', function() {
    props.event.complete_exercise_count = 0;
    props.event.complete = false;
    const row = mount(<ReadingRow {...props} />);
    expect(row.find('Col[className="feedback"]').text()).toEqual('Not started');
    expect(row).toHaveRendered('Icon[type="clock"]');
    row.unmount();
  });

  it('renders complete', function() {
    props.event.complete = true;
    const row = mount(<ReadingRow {...props} />);
    expect(row.find('Col[className="feedback"]').text()).toEqual('Complete');
    row.unmount();
  });

  it('renders close to being due', () => {
    props.event.complete_exercise_count = 1;
    props.event.due_at = new Date(now.getTime() + ( 24*60*60*1000 ));
    props.event.complete = false;
    const row = mount(<ReadingRow {...props} />);
    expect(row.find('Col[className="feedback"]').text()).toEqual('In progress');
    expect(row).toHaveRendered('Icon[type="exclamation-circle"]');
    row.unmount();
  });


});
