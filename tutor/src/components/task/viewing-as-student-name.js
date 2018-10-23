import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import Name from '../name';

import Courses from '../../models/courses-map';

// {ScoresStore, ScoresActions} = require '../../flux/scores'

class ViewingAsStudentName extends React.Component {
  static displayName = 'ViewingAsStudentName';

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  state = this.getStudentState();

  getStudentState = (props) => {
    const { courseId, taskId } = props || this.props;
    const task = Courses.get(courseId).scores.getTask(taskId);
    if (task) { return { student: task.student }; } else { return {}; }
  };

  UNSAFE_componentWillMount() {
    const { courseId, taskId } = this.props;
    const { student } = this.state;
    const { scores } = Courses.get(courseId);
    if ((student == null) && !scores.api.hasBeenFetched) {
      return scores.fetch().then(() => this.updateStudent());
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    return this.updateStudent(nextProps);
  }

  updateStudent = (props) => {
    if (props == null) { (((((((({ props } = this)))))))); }
    return this.setState(this.getStudentState(props));
  };

  render() {
    let { className } = this.props;
    let studentName = null;
    className = classnames(className, 'task-student');
    const { student } = this.state;

    if (student != null) { studentName = <div className={className}>
      <Name {...student} />
    </div>; }

    return studentName;
  }
}

export { ViewingAsStudentName };
