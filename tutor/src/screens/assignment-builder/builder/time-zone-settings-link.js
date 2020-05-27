import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import TutorLink from '../../../components/link';

const TimeZoneSettingsLink = ({ course }) => {
  const tooltip =
    <Tooltip id="change-course-time">
      Click to change course time zone
    </Tooltip>;
  return (
    <TutorLink
      className="course-time-zone"
      to="courseSettings"
      query={{ tab: 1 }}
      params={{ courseId: course.id }}>
      <OverlayTrigger placement="top" overlay={tooltip}>
        <span>
          {course.time_zone}
        </span>
      </OverlayTrigger>
    </TutorLink>
  );
};

TimeZoneSettingsLink.propTypes = {
  course: PropTypes.object.isRequired,
};

export default TimeZoneSettingsLink;
