import PropTypes from 'prop-types';
import React from 'react';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import StudentDashboard from './dashboard';
import Courses from '../../models/courses-map';
import { CourseNotFoundWarning } from '../../components/course-not-found-warning';
import './styles.scss';

export default
@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
class StudentDashboardShell extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string,
    }).isRequired,
    tourContext: PropTypes.object,
  }

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  render() {
    if (!this.course) { return <CourseNotFoundWarning />; }

    return (
      <StudentDashboard params={this.props.params} course={this.course} />
    );
  }

}
