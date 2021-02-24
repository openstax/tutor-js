import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { observer } from 'mobx-react';
import Course from '../../models/course';

@observer
export default
class BestPracticesGuide extends React.Component {

  static propTypes = {
      course: PropTypes.instanceOf(Course),
  }

  render() {
      const { course } = this.props;
      if (!course || !course.currentRole.isTeacher || course.currentRole.isTeacherStudent) {
          return null;
      }
      const url = course.bestPracticesDocumentURL;
      if (!url) { return null; }

      return (
          <Dropdown.Item
              className="best-practices-guide"
              target="_blank"
              href={url}
          >
        Best Practices Guide
          </Dropdown.Item>
      );
  }

}
