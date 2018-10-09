import {React, SnapShot, Wrapper} from '../../components/helpers/component-testing';
import Dashboard from '../../../src/screens/student-dashboard/dashboard';
import Factory from '../../factories';
import { bootstrapCoursesList } from '../../courses-test-data';
import chronokinesis from 'chronokinesis';
import moment from 'moment-timezone';
import { TimeActions } from '../../../src/flux/time';

describe('Student Dashboard', () => {
  let props;

  beforeEach(() => {
    moment.tz.setDefault('America/Chicago');
    moment.locale('en');
    const now = new Date('2015-10-14T12:00:00.000Z');
    chronokinesis.travel(now);
    const course = Factory.course();
    bootstrapCoursesList();
    Factory.studentTasks({ course, attributes: { now: new Date('2015-10-21T12:00:00.000Z') } });
    props = {
      course,
      params: {},
    };
  });

  afterEach(() => {
    chronokinesis.reset();
    moment.tz.setDefault();
  });

  it('matches snapshot', function() {
    props.course.studentTasks.all_tasks_are_ready = false;
    props.course.primaryRole.joined_at = new Date('2015-09-14T12:00:00.000Z');
    const component = SnapShot.create(
      <Wrapper _wrapped_component={Dashboard} {...props} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays as loading', () => {
    props.course.studentTasks.all_tasks_are_ready = false;
    props.course.primaryRole.joined_at = new Date('2015-10-14T12:00:00.000Z');
    const component = SnapShot.create(
      <Wrapper _wrapped_component={Dashboard} {...props} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
