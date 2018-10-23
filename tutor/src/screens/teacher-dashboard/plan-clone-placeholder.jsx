import PropTypes from 'prop-types';
import { React, observable, observer, action } from '../../helpers/react';
import TimeHelper from '../../helpers/time';
import Icon from '../../components/icon';
import { TaskPlanStore, TaskPlanActions } from '../../flux/task-plan';
import Course from '../../models/course';

export default
@observer
class PlanClonePlaceholder extends React.Component {
  static propTypes = {
    planType: PropTypes.string.isRequired,
    course:   PropTypes.instanceOf(Course).isRequired,
    planId:   PropTypes.string.isRequired,
    due_at:   TimeHelper.PropTypes.moment,
    onLoad:   PropTypes.func.isRequired,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }).isRequired,
  };

  componentWillMount() {
    if (TaskPlanStore.isLoaded(this.props.planId)) {
      this.onLoad();
    } else {
      TaskPlanStore.on(`loaded.${this.props.planId}`, this.onLoad);
    }
  }

  @action.bound onLoad() {
    const taskPlanId = TaskPlanStore.freshLocalId();
    const { planId, course } = this.props;
    TaskPlanActions.createClonedPlan(taskPlanId, {
      planId, courseId: course.id,
      due_at: TimeHelper.toISO(this.props.due_at),
    });
    course.taskPlans.addClone(TaskPlanStore.get(taskPlanId));
    this.props.onLoad(taskPlanId);
  }

  render() {
    return (
      <div
        className="plan-clone-placeholder"
        data-assignment-type={this.props.planType}
        style={{ left: this.props.position.x, top: this.props.position.y }}
      >
        <label>
          <Icon type="spinner" spin={true} />
          Adding…
        </label>
      </div>
    );
  }
};
