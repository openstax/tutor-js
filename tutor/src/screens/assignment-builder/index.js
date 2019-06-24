import { React, PropTypes, observable, action, computed, observer, cn } from '../../helpers/react';
import TourRegion from '../../components/tours/region';
import Courses from '../../models/courses-map';
import Loader from './loader';
import Homework from './homework';
import Warning from '../../components/warning-modal';
import UX from './ux';

const BUILDERS = {
  homework: Homework,
};


const UnknownType = () => (
  <Warning title="Unknown assignment type">
    Please check the link you used and try again
  </Warning>
);

@observer
class AssignmentBuilder extends React.Component {

  constructor(props) {
    super(props);

    // eslint-disable-next-line
    let { id, courseId, type } = props.params;

    // eslint-disable-next-line
    const course = props.course || Courses.get(courseId);
    const plan = course.teacherTaskPlans.withPlanId(id || 'new');

    if (plan.isNew) {
      plan.reset();
      plan.type = type;
    } else {
      plan.fetch();
    }

    this.ux = new UX({ course, plan });
//    this.state = { id, plan, type, course };
  }

  render() {
    const { ux, ux: { plan, course } } = this;

    if (ux.plan.api.isPendingInitialFetch) {
      return <Loader />;
    }

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
};

export default AssignmentBuilder;
