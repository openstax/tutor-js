import {
  React, PropTypes, observer, observable, computed, idType,
} from 'vendor';
import { Redirect } from 'react-router-dom';
import Router from '../../helpers/router';
import Courses, { Course } from '../../models/courses-map';
import { BulletList as PendingLoad } from 'react-content-loader';
import { CourseNotFoundWarning } from '../../components/course-not-found-warning';
import { StepCard } from './step/card';

export default
@observer
class TaskPractice extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: idType.isRequired,
    }).isRequired,
    course: PropTypes.instanceOf(Course),
  }

  @computed get course() {
    return this.props.course || Courses.get(this.props.params.courseId);
  }

  @observable taskId;

  componentDidMount() {
    if (!this.course) { return; }
    this.course.studentTasks
      .practice(Router.currentQuery())
      .then(({ data: { id } }) => { this.taskId = id; });
  }

  render() {
    if (!this.course) {
      return <CourseNotFoundWarning area="assignment" messageType="notAllowed" />;
    }

    if (!this.taskId) {
      return (
        <StepCard><PendingLoad /></StepCard>
      );
    }

    return <Redirect to={Router.makePathname('viewTask', {
      id: this.taskId,
      courseId: this.course.id,
    })} />;

  }

}
