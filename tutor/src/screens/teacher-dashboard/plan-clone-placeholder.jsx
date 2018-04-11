import { React, observable, observer, action } from '../../helpers/react';
import TimeHelper from '../../helpers/time';
import Icon from '../../components/icon';
import { TaskPlanStore, TaskPlanActions } from '../../flux/task-plan';

import Courses from '../../models/courses-map';

@observer
export default class PlanClonePlaceholder extends React.Component {
  static propTypes = {
    planType: React.PropTypes.string.isRequired,
    planId:   React.PropTypes.string.isRequired,
    courseId: React.PropTypes.string.isRequired,
    due_at:   TimeHelper.PropTypes.moment,
    onLoad:   React.PropTypes.func.isRequired,
    position: React.PropTypes.shape({
      x: React.PropTypes.number,
      y: React.PropTypes.number,
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
    const { planId, courseId } = this.props;
    TaskPlanActions.createClonedPlan(taskPlanId, {
      planId, courseId,
      due_at: TimeHelper.toISO(this.props.due_at),
    });
    Courses.get(courseId).taskPlans.addClone(TaskPlanStore.get(taskPlanId));
    return (
      this.props.onLoad(taskPlanId)
    );
  }

  render() {
    return (
      <div
        className="plan-clone-placeholder"
        data-assignment-type={this.props.planType}
        style={{ left: this.props.position.x, top: this.props.position.y }}>
        <label>
          <Icon type="spinner" spin={true} />
          Adding…
        </label>
      </div>
    );
  }
}
