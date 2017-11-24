import React from 'react';
import SnapShot from 'react-test-renderer';
import { filter, map } from 'lodash';
import moment from 'moment-timezone';

import MOCK_DASHBOARD_RESPONSE from '../../../api/courses/1/dashboard';
import EventsPanel from '../../../src/components/student-dashboard/events-panel';
import chronokinesis from 'chronokinesis';

describe('EventsPanel', function() {
  let props;

  beforeEach(function() {
    chronokinesis.travel(new Date('2017-10-14T12:00:00.000Z'));
    moment.tz.setDefault('America/Chicago');
    props = {
      events: MOCK_DASHBOARD_RESPONSE.tasks,
      courseId: '1',
      isCollege: false,
    };
  });

  afterEach(() => {
    chronokinesis.reset();
    moment.tz.setDefault();
  });

  it('renders with events', function() {
    expect(SnapShot.create(<EventsPanel {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders with events as named', function() {
    const wrapper = mount(<EventsPanel {...props} />);
    const renderedTitles = wrapper.find('.title').map(item => item.text());
    const mockTitles = map(MOCK_DASHBOARD_RESPONSE.tasks, 'title');
    expect(renderedTitles).to.deep.equal(mockTitles);
  });

  it('renders late only for homework when isCollege is false', function() {
    const wrapper = mount(<EventsPanel {...props} />);
    const mockHomeworkTasks = filter(
      MOCK_DASHBOARD_RESPONSE.tasks, { type: 'homework', complete: false }
    );
    expect(wrapper.find('.late').length).to.equal(mockHomeworkTasks.length);
  });

  it('renders late only for all tasks when isCollege is true', function() {
    props.isCollege = true;
    const wrapper = mount(<EventsPanel {...props} />);
    const mockTasks = filter(MOCK_DASHBOARD_RESPONSE.tasks, { complete: false });
    expect(wrapper.find('.late').length).to.equal(mockTasks.length);
  });

});
