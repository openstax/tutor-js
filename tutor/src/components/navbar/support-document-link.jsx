import React from 'react';
import { MenuItem } from 'react-bootstrap';
import { observer } from 'mobx-react';
import TourAnchor from '../tours/anchor';
import Course from '../../models/course';
import User from '../../models/user';
import CourseInformation from '../../models/course/information';

export default
@observer
class SupportDocumentLink extends React.Component {

  render() {
    const url = CourseInformation.gettingStartedGuide[
      User.isProbablyTeacher ? 'teacher' : 'student'
    ];

    return (
      <MenuItem
        className="support-document-link"
        target="_blank"
        href={url}
      >
        <TourAnchor id="menu-support-document">
          Getting Started Guide
        </TourAnchor>
      </MenuItem>
    );
  }

};
