import React from 'react';
import User from '../../models/user';
import TutorLink from '../link';
import TourAnchor from '../tours/anchor';

export default function StudentPreviewLinks({ courseId }) {

  if( !courseId || !( User.isConfirmedFaculty || User.isUnverifiedInstructor ) ) { return null; }

  return (
    <TourAnchor tag="li" id="student-preview-link">
      <TutorLink
        className="student-preview-link"
        to='studentPreview'
        params={{ courseId: courseId }}
      >
        <span className="control-label" title="See what students see">Student preview videos</span>
      </TutorLink>
    </TourAnchor>
  );

}


StudentPreviewLinks.propTypes = {
  courseId: React.PropTypes.string,
};
