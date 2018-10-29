import React from 'react';
import SnapShot from 'react-test-renderer';
import moment from 'moment-timezone';
import chronokinesis from 'chronokinesis';
import Factory from '../../factories';
import HomeworkRow from '../../../src/screens/student-dashboard/homework-row';


describe('Homework Row', function() {
  let props;

  beforeEach(function() {
    chronokinesis.travel(new Date('2017-10-14T12:00:00.000Z'));
    moment.tz.setDefault('America/Chicago');
    props = {
      event: Factory.studentDashboardTask({ type: 'homework' }),
      course: Factory.course(),
    };
  });

  it('renders with completed count', function() {
    props.event.correct_exercise_count = null;
    expect.snapshot(<HomeworkRow {...props} />).toMatchSnapshot();
  });

  it('renders with correct count', function() {
    props.event.correct_exercise_count = 0;
    expect.snapshot(<HomeworkRow {...props} />).toMatchSnapshot();
    props.event.correct_exercise_count = 2;
    expect.snapshot(<HomeworkRow {...props} />).toMatchSnapshot();
  });

});
