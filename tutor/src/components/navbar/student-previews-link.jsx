import React from 'react';

import Icon from '../icon';
import User from '../../models/user';
import TutorLink from '../link';
import TourAnchor from '../tours/anchor';

export default function StudentPreviewLinks({ courseId }) {

  if( ! ( User.isConfirmedFaculty || User.isUnverifiedInstructor ) ) { return null; }

  return (
    <TourAnchor id="student-preview-link">
      <TutorLink
        className="student-preview-link"
        to='studentPreview'
        params={{ courseId: courseId }}
      >
        <Icon type="video-camera" />
        <span className="control-label">Student preview videos</span>
      </TutorLink>
    </TourAnchor>
  );

}


StudentPreviewLinks.propTypes = {
  courseId: React.PropTypes.string,
};
