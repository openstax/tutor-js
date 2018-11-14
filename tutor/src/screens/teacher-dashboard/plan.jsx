import {
  React, observer, cn, action, observable, computed,
} from '../../helpers/react';
import PropTypes from 'prop-types';
import Course from '../../models/course';
import CoursePlanLabel from './plan-label';
import { CoursePlanDisplayEdit, CoursePlanDisplayQuickLook } from './plan-display';
import TeacherTaskPlan from '../../models/task-plan/teacher';

export default
@observer
class CoursePlan extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    isViewingStats: PropTypes.bool.isRequired,
    onPlanView: PropTypes.func.isRequired,
    plan: PropTypes.instanceOf(TeacherTaskPlan).isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = { activeHeight: 35 };

  @observable isHovered;

  @action.bound
  setHover(isHovered) {
    this.isHovered = isHovered;
  }

  @computed get className() {
    const { plan, isViewingStats } = this.props;
    return cn('plan', `course-plan-${plan.id}`,
      {
        'is-published': plan.isPublished,
        'is-publishing': plan.isPublishing,
        'is-failed': plan.isFailed,
        'is-open': plan.isOpen,
        'is-new': plan.isNew,
        'is-trouble': plan.isTrouble,
        'active': this.isHovered || isViewingStats,
        [`is-${plan.publishedStatus}`]: plan.publishedStatus,
      }
    );
  }

  @computed get canQuickLook() {
    const { plan } = this.props;
    return Boolean(
      plan.isPublished || plan.isPublishing
    );
  }

  render() {
    const { props: { onPlanView, plan, course } } = this;

    plan.publishing.reportObserved();

    const DisplayComponent = this.canQuickLook ? CoursePlanDisplayQuickLook : CoursePlanDisplayEdit;

    return (
      <div>
        <DisplayComponent
          plan={plan}
          course={course}
          label={<CoursePlanLabel plan={plan} />}
          setIsViewing={onPlanView}
          setHover={this.setHover}
          className={this.className}
        />
      </div>
    );
  }
};
