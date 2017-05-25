import React from 'react';

import Icon from '../icon';
import User from '../../models/user';
import TutorLink from '../link';

export default function StudentPreviewLinks() {

  if( ! ( User.isConfirmedFaculty || User.isUnverifiedInstructor ) ) { return null; }

  return (
    <TutorLink to='studentPreview' className="student-preview-link">
      <Icon type="video-camera" />
      <span className="control-label">Student preview videos</span>
    </TutorLink>
  );

}
