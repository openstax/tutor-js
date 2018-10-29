import React from 'react';
import SnapShot from 'react-test-renderer';
import { cloneDeep } from 'lodash';
import moment from 'moment-timezone';
import chronokinesis from 'chronokinesis';
import Factory from '../../factories';
import ReadingRow from '../../../src/screens/student-dashboard/reading-row';


describe('Reading Row', function() {
  let props;

  beforeEach(function() {
    chronokinesis.travel(new Date('2017-10-14T12:00:00.000Z'));
    moment.tz.setDefault('America/Chicago');
    props = {
      event: Factory.studentDashboardTask({ type: 'homework' }),
      course: Factory.course(),
    };
  });

  it('renders unstarted', function() {
    props.event.complete_exercise_count = 0;
    expect.snapshot(<ReadingRow {...props} />).toMatchSnapshot();
  });

  it('renders in progress', function() {
    props.event.complete_exercise_count = 1;
    expect.snapshot(<ReadingRow {...props} />).toMatchSnapshot();
  });

  it('renders complete', function() {
    props.event.complete = true;
    expect.snapshot(<ReadingRow {...props} />).toMatchSnapshot();
  });

});
