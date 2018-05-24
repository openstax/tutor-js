import React from 'react';
import { MenuItem } from 'react-bootstrap';
import { observer } from 'mobx-react';
import TourAnchor from '../tours/anchor';
import Course from '../../models/course'

@observer
export default class BestPracticesGuide extends React.Component {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course),
  }

  render() {
    const { course } = this.props;
    if (!course || !course.isTeacher) {
      return null;
    }
    const url = course.bestPracticesDocumentURL;
    if (!url) { return null; }

    return (
      <MenuItem
        className="best-practices-guide"
        target="_blank"
        href={url}
      >
        Best Practices Guide
      </MenuItem>
    );
  }

}
