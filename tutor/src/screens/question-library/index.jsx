import { React, PropTypes, computed, observer } from 'vendor';
import Exercises from '../../models/exercises';
import Courses from '../../models/courses';
import Router from '../../helpers/router';
import Dashboard from './dashboard';
import Loading from 'shared/components/loading-animation';

import './styles.scss';

export default
@observer
class QuestionsDashboardShell extends React.Component {
  static propTypes = {
    exercises: PropTypes.object,
  }

  static defaultProps = {
    exercises: Exercises,
  }

  @computed get course() {
    const { courseId } = Router.currentParams();
    return Courses.get(courseId);
  }

  componentDidMount() {
    this.props.exercises.clear();
    this.course.referenceBook.ensureLoaded();
  }

  componentWillUnmount() {
    Exercises.clear();
  }

  render() {
    if (!this.course.referenceBook.api.hasBeenFetched) { return <Loading />; }
    return <Dashboard exercises={this.props.exercises} course={this.course} />;
  }

}
