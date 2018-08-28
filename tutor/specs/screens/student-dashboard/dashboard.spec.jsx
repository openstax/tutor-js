import {React, SnapShot, Wrapper} from '../../components/helpers/component-testing';
import Dashboard from '../../../src/screens/student-dashboard/dashboard';
import StudentTasks from '../../../src/models/student-tasks';
import ux from '../../../src/models/course/onboarding/student-course.js';
import { bootstrapCoursesList } from '../../courses-test-data';
import chronokinesis from 'chronokinesis';
import moment from 'moment-timezone';

describe('Student Dashboard', () => {
  let props;

  beforeEach(() => {
    moment.tz.setDefault('America/Chicago');
    chronokinesis.travel(new Date('2015-10-14T12:00:00.000Z'));
    bootstrapCoursesList();
    props = {
      courseId: '1',
      params: {},
    };
    StudentTasks.forCourseId(1).onLoaded({ data: { tasks: [{
      'id': '118',
      'title': 'Read Chapter 1',
      'opens_at': (new Date(Date.now() - 1000 * 3600 * 24)).toString(),
      'due_at': '2016-05-19T12:00:00.000Z',
      'last_worked_at': '2016-05-19T11:59:00.000Z',
      'type': 'reading',
      'complete': true,
      'is_deleted': false,
      'exercise_count': 3,
      'complete_exercise_count': 3,
    }] } });
  });

  afterEach(() => {
    chronokinesis.reset();
    moment.tz.setDefault();
  });

  it('matches snapshot', function() {
    const ux = { isEmptyNewStudent: false };
    const component = SnapShot.create(
      <Wrapper injected={{ studentDashboardUX: ux }}
        _wrapped_component={Dashboard} {...props} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays as loading', () => {
    const ux = { isEmptyNewStudent: true, fetchTasksInterval: 1000 * 60 * 8 };
    const component = SnapShot.create(
      <Wrapper injected={{ studentDashboardUX: ux }}
        _wrapped_component={Dashboard} {...props} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

  });
});
