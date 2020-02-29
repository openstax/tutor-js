import Info from '../../../src/screens/student-dashboard/task-progress-info';
import { React, TimeMock, Factory } from '../../helpers';

describe('Task Progress Info', function() {
  let props;
  const now = new Date('2017-10-20T12:00:00.000Z');
  TimeMock.setTo(now);

  beforeEach(function() {
    props = {
      event: Factory.studentDashboardTask({ type: 'homework' }),
      course: Factory.course(),
    };
  });

  it('displays description in a info popover', () => {
    props.event.description = 'this is some description';
    const info = mount(<Info {...props} />);
    expect(info).toHaveRendered(`Icon[variant="info"][tooltip="${props.event.description}"]`);
    info.unmount();
  });
});
