import React from 'react';

import { Dropdown, MenuItem } from 'react-bootstrap';
import { get } from 'lodash';
import { action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';

import TourAnchor from '../tours/anchor'
import Chat from '../../models/chat';
import UserMenu from '../../models/user/menu';
import Icon from '../icon';
import TourContext from '../../models/tour/context';
import Router from '../../helpers/router';
import Courses from '../../models/courses-map';
import CourseInformation from '../../models/course/information';

@observer
export default class SupportDocumentLink extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string,
  }


  render() {
    if (!this.props.courseId) { return null; }
    const course = Courses.get(this.props.courseId);
    let url, name;
    if (course.isStudent) {
      url = CourseInformation.studentGettingStartedURL;
      name = 'Getting Started Guide';
    } else {
      url = course.bestPracticesDocumentURL;
      name = 'Best Practices Guide';
    }

    if (!url) { return null; }

    return (
      <MenuItem
        className="support-document-link"
        target="_blank"
        href={url}
      >
        {name}
      </MenuItem>
    );
  }

}
