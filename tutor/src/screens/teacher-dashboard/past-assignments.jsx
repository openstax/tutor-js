import { React, observer, action, observable, styled, cn  } from 'vendor';
import { partial } from 'lodash';
import { Icon } from 'shared';
import PropTypes from 'prop-types';
import Course from '../../models/course';
import { CloneAssignmentLink } from './task-dnd';
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

@observer
export default
class PastAssignments extends React.Component {

  static propTypes = {
      course: PropTypes.instanceOf(Course).isRequired,
      className: PropTypes.string,
      cloningPlanId: PropTypes.string,
  }

  @observable hoveredPlan;

  @action.bound offTaskHover() {
      this.hoveredPlan = null;
  }

  @action.bound onTaskHover(plan) {
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
                          plan={plan}
                          toolTip={
                              `Orig. due date ${TimeHelper.toHumanDate(plan.dateRanges.due.start)}`
                          }
                          key={plan.id}
                          offHover={this.offTaskHover}
                          onHover={partial(this.onTaskHover, plan)}
                          isEditing={plan.id === this.props.cloningPlanId}
                      />)}
              </div>
          </div>
      );
  }
}
