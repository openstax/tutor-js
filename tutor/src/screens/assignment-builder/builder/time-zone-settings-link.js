import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import TutorLink from '../../../components/link';
import Courses from '../../../models/courses-map';

class TimeZoneSettingsLink extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    courseId: PropTypes.string.isRequired,
  };

  render() {
    const tooltip =
      <Tooltip id="change-course-time">
        {'\
  Click to change course time zone\
  '}
      </Tooltip>;
    return (
      <TutorLink
        className="course-time-zone"
        to="courseSettings"
        query={{ tab: 1 }}
        params={{ courseId: this.props.courseId }}>
        <OverlayTrigger placement="top" overlay={tooltip}>
          <span>
            {Courses.get(this.props.courseId).time_zone}
          </span>
        </OverlayTrigger>
      </TutorLink>
    );
  }
}


export default TimeZoneSettingsLink;
