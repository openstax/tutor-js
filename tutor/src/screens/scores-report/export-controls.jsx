import PropTypes from 'prop-types';
import React from 'react';
import Export from './export';
import LmsPush from './lms-push';
import Course from '../../models/course';

export default class ScoresReportExportControls extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  render() {
    if (!this.props.course.isTeacher) {
      return null;
    }

    return (
      <div className="export-controls">
        <LmsPush course={this.props.course} />
        <Export course={this.props.course} />
      </div>
    );
  }
}
