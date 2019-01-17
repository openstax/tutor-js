import { React, Router, TimeMock } from '../../helpers';
import Dashboard from '../../../src/screens/student-dashboard/dashboard';
import Factory from '../../factories';
import { bootstrapCoursesList } from '../../courses-test-data';

describe('Student Dashboard', () => {
  let props;

  TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(() => {
    const course = Factory.course();
    bootstrapCoursesList();
    Factory.studentTasks({ course, attributes: { now: new Date('2015-10-21T12:00:00.000Z') } });
    course.studentTasks.fetch = jest.fn();
    props = {
      course,
      params: {},
    };
  });

  it('matches snapshot', function() {
    props.course.studentTasks.all_tasks_are_ready = false;
    props.course.primaryRole.joined_at = new Date('2015-09-14T12:00:00.000Z');
    expect.snapshot(<Router><Dashboard {...props} /></Router>).toMatchSnapshot();
  });

  it('displays as loading', () => {
    props.course.studentTasks.all_tasks_are_ready = false;
    props.course.primaryRole.joined_at = new Date('2015-10-14T12:00:00.000Z');
    const dash = mount(<Router><Dashboard {...props} /></Router>);
    expect(dash).toHaveRendered('ThisWeekCard Card[className="empty pending"]');
    expect.snapshot(<Router><Dashboard {...props} /></Router>).toMatchSnapshot();
  });

  it('fetches on mount', () => {
    const dash = mount(<Router><Dashboard {...props} /></Router>);
    expect(props.course.studentTasks.fetch).toHaveBeenCalled();
    dash.unmount();
  });

});
