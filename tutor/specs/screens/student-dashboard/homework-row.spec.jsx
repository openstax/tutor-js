import React from 'react';
import SnapShot from 'react-test-renderer';
import { cloneDeep } from 'lodash';
import moment from 'moment-timezone';
import chronokinesis from 'chronokinesis';

import MOCK_DASHBOARD_RESPONSE from '../../../api/courses/1/dashboard';
import HomeworkRow from '../../../src/screens/student-dashboard/homework-row';


describe('Homework Row', function() {
  let props;

  beforeEach(function() {
    chronokinesis.travel(new Date('2017-10-14T12:00:00.000Z'));
    moment.tz.setDefault('America/Chicago');
    props = {
      event: cloneDeep(MOCK_DASHBOARD_RESPONSE.tasks[0]),
      courseId: '1',
      isCollege: true,
    };
  });

  it('renders with completed count', function() {
    props.event.correct_exercise_count = null;
    expect(SnapShot.create(<HomeworkRow {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders with correct count', function() {
    props.event.correct_exercise_count = 0;
    expect(SnapShot.create(<HomeworkRow {...props} />).toJSON()).toMatchSnapshot();
    props.event.correct_exercise_count = 2;
    expect(SnapShot.create(<HomeworkRow {...props} />).toJSON()).toMatchSnapshot();
  });

});
