import React from 'react';
import SnapShot from 'react-test-renderer';
import { cloneDeep } from 'lodash';
import moment from 'moment-timezone';
import chronokinesis from 'chronokinesis';

import MOCK_DASHBOARD_RESPONSE from '../../../api/courses/1/dashboard';
import ReadingRow from '../../../src/screens/student-dashboard/reading-row';


describe('Reading Row', function() {
  let props;

  beforeEach(function() {
    chronokinesis.travel(new Date('2017-10-14T12:00:00.000Z'));
    moment.tz.setDefault('America/Chicago');
    props = {
      event: cloneDeep(MOCK_DASHBOARD_RESPONSE.tasks[1]),
      courseId: '1',
      isCollege: true,
    };
  });

  it('renders unstarted', function() {
    props.event.complete_exercise_count = 0;
    expect(SnapShot.create(<ReadingRow {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders in progress', function() {
    props.event.complete_exercise_count = 1;
    expect(SnapShot.create(<ReadingRow {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders complete', function() {
    props.event.complete = true;
    expect(SnapShot.create(<ReadingRow {...props} />).toJSON()).toMatchSnapshot();
  });

});
