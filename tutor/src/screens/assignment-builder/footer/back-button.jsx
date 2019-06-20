import PropTypes from 'prop-types';
import React from 'react';
import TaskPlanHelper from '../../../helpers/task-plan';
import { Link } from 'react-router-dom';

export default class BackButton extends React.Component {

  static propTypes = {
    isEditable: PropTypes.bool.isRequired,
    course: PropTypes.object.isRequired,
  }

  render() {
    const { isEditable, course } = this.props;

    if (isEditable) { return null; }

    return (
      <Link {...TaskPlanHelper.calendarParams(course)} className="btn btn-default">
        Back to Calendar
      </Link>
    );
  }
}
