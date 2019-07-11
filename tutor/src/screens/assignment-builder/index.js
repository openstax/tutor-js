import { React, PropTypes, observer, action } from '../../helpers/react';
import TourRegion from '../../components/tours/region';
import Courses from '../../models/courses-map';
import Router from '../../helpers/router';
import TaskPlanHelper from '../../helpers/task-plan';
import Loader from './loader';
import homework from './homework';
import reading from './reading';
import event from './event';
import external from './external';
import Warning from '../../components/warning-modal';
import { withRouter } from 'react-router';
import UX from './ux';

const BUILDERS = {
  homework,
  reading,
  external,
  event,
};


const UnknownType = () => (
  <Warning title="Unknown assignment type">
    Please check the link you used and try again
  </Warning>
);

@withRouter
@observer
class AssignmentBuilder extends React.Component {

  static displayName = 'AssignmentBuilder';

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
      courseId: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    // eslint-disable-next-line
    let { id, courseId, type } = props.params;

    // eslint-disable-next-line
    const course = props.course || Courses.get(courseId);

    this.ux = new UX();

    this.ux.initialize({
      ...props.params, course,
      onComplete: this.onComplete,
    });

  }

  @action.bound onComplete() {
    const route = TaskPlanHelper.calendarParams(this.ux.course);
    this.props.history.push(Router.makePathname(route.to, route.params));
  }

  render() {
    const { ux: { isInitializing, plan, course } } = this;

    if (isInitializing) { return <Loader />; }

    const Builder = BUILDERS[plan.type] || UnknownType;

    return (
      <TourRegion
        id={`${plan.type}-assignment-editor`}
        otherTours={[`${plan.type}-assignment-editor-super`]}
        courseId={course.id}
      >
        <Builder ux={this.ux} />
      </TourRegion>
    );
  }
}

export default AssignmentBuilder;
