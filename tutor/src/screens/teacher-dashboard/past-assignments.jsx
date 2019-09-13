import { React, observer, action, observable, styled, cn  } from '../../helpers/react';
import { partial } from 'lodash';
import { Icon } from 'shared';
import PropTypes from 'prop-types';
import { Overlay, Popover } from 'react-bootstrap';
import Course from '../../models/course';
import { CloneAssignmentLink } from './task-dnd';
import TaskPlanHelper from '../../helpers/task-plan';
import TimeHelper from '../../helpers/time';

const Loading = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
`;

const PastAssignmentsLoading = ({ className }) => (
  <div className={cn('past-assignments', className)}>
    <Loading>
      <Icon variant="activity" /> Loading copied assignments…
    </Loading>
  </div>
);

PastAssignmentsLoading.propTypes = {
  className: PropTypes.string,
};

export default
@observer
class PastAssignments extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    className: PropTypes.string,
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
          placement="right"
        >
          <Popover id="task-original-due-date">
            <Popover.Content>
              Orig. due date {TimeHelper.toHumanDate(TaskPlanHelper.earliestDueDate(this.hoveredPlan))}
            </Popover.Content>
          </Popover>
        </Overlay>
      </div>
    );
  }
}
