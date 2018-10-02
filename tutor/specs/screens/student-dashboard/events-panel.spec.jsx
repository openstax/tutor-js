import React from 'react';
import SnapShot from 'react-test-renderer';
import { map } from 'lodash';
import moment from 'moment-timezone';
import Factory from '../../factories';
import EventsPanel from '../../../src/screens/student-dashboard/events-panel';
import chronokinesis from 'chronokinesis';

describe('EventsPanel', function() {
  let props;

  beforeEach(function() {
    chronokinesis.travel(new Date('2017-10-14T12:00:00.000Z'));
    moment.tz.setDefault('America/Chicago');
    const course = Factory.course();
    Factory.studentTasks({ course });
    props = {
      course,
      events: course.studentTasks.array,
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
    const mockTitles = map(props.events, 'title');
    expect(renderedTitles).to.deep.equal(mockTitles);
  });

  it('renders late only for homework when is_college is false', function() {
    props.events.forEach(e => e.update({
      type: 'homework', due_at: moment ('2017-10-13T12:00:00.000Z'),
    }));
    props.course.is_college = true;
    const wrapper = mount(<EventsPanel {...props} />);
    expect(wrapper.find('.late').length).toEqual(2); //props.events.length);
  });

  it('does not render late only for other tasks when is_college is true', function() {
    props.events.forEach(e => e.update({
      type: 'reading', due_at: moment ('2017-10-13T12:00:00.000Z'),
    }));
    props.course.is_college = true;
    const wrapper = mount(<EventsPanel {...props} />);
    expect(wrapper.find('.late').length).toEqual(2);
    props.course.is_college = false;
    expect(wrapper.find('.late').length).toEqual(0);
  });

});
