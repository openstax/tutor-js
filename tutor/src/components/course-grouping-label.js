import PropTypes from 'prop-types';
import React from 'react';
import { idType } from 'shared';
import Courses from '../models/courses-map';

class CourseGroupingLabel extends React.Component {
  static displayName = 'CourseGroupingLabel';

  static propTypes = {
    courseId: idType.isRequired,
    plural: PropTypes.bool,
    lowercase: PropTypes.bool,
  };

  period = () => {
    if (this.props.lowercase) { return 'period'; } else { return 'Period'; }
  };

  section = () => {
    if (this.props.lowercase) { return 'section'; } else { return 'Section'; }
  };

  render() {
    let name = __guard__(Courses.get(this.props.courseId), x => x.is_college) ? this.section() : this.period();
    if (this.props.plural) { name += 's'; }
    return (
      <span>
        {name}
      </span>
    );
  }
}

export default CourseGroupingLabel;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}