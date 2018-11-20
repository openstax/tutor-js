import { React, observer, action, observable, cn  } from '../../helpers/react';
import { partial } from 'lodash';
import PropTypes from 'prop-types';
import { Overlay, Popover } from 'react-bootstrap';
import Course from '../../models/course';
import { CloneAssignmentLink } from './task-dnd';
import TaskPlanHelper from '../../helpers/task-plan';
import TimeHelper from '../../helpers/time';

const PastAssignmentsLoading = ({ className }) => (
  <div className={cn('past-assignments', className)}>
    <div className="no-plans is-loading">
      Loading copied assignments…
    </div>
  </div>
);

export default
@observer
class PastAssignments extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    cloningPlanId: PropTypes.string,
  }

  @observable tooltipTarget;
  @observable hoveredPlan;

  @action.bound offTaskHover() {
    this.hoveredPlan = this.tooltipTarget = null;
  }

  @action.bound onTaskHover(plan, ev) {
    this.tooltipTarget = ev.currentTarget;
    this.hoveredPlan = plan;
  }

  componentDidMount() {
    const { course } = this.props;
    if (course.isCloned) { course.pastTaskPlans.fetch(); }
  }

  render() {
    const { course } = this.props;
    if (!course.isCloned) { return null; }

    const plans = course.pastTaskPlans;
    if (plans.api.isPending){ return <PastAssignmentsLoading />; }
    if (plans.isEmpty) { return null; }

    return (
      <div className={cn('past-assignments', this.props.className)}>
        <div className="section-label">
          Copied
        </div>
        <div className="plans">
          {plans.array.map((plan) =>
            <CloneAssignmentLink
              onHover={partial(this.onTaskHover, plan)}
              offHover={this.offTaskHover}
              key={plan.id}
              plan={plan}
              isEditing={plan.id === this.props.cloningPlanId} />)}
        </div>
        <Overlay
          show={!!this.tooltipTarget}
          target={this.tooltipTarget}
          placement="right">
          <Popover id="task-original-due-date">
            Orig. due date {TimeHelper.toHumanDate(TaskPlanHelper.earliestDueDate(this.hoveredPlan))}
          </Popover>
        </Overlay>
      </div>
    );
  }
};
