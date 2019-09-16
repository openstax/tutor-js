import { React, PropTypes, computed, observer, action } from '../../helpers/react';
import { Popover } from 'react-bootstrap';
import Plan from '../../models/task-plans/teacher/plan';

@observer
class FeedbackSetting extends React.Component {

  static propTypes = {
    plan: PropTypes.instanceOf(Plan).isRequired,
  }

  @action.bound setImmediateFeedback(ev) {
    this.props.plan.is_feedback_immediate = ev.target.value === 'immediate';
  }

  @computed get shouldShowWarning() {
    const { plan } = this.props;

    return plan.isVisibleToStudents &&
      plan.hasTaskingDatesChanged &&
      plan.is_feedback_immediate;
  }

  render() {
    const { plan } = this.props;

    return (
      <div className="form-group">
        <label htmlFor="feedback-select">
          Show feedback
        </label>
        <select
          onChange={this.setImmediateFeedback}
          value={plan.is_feedback_immediate ? 'immediate' : 'due_at'}
          id="feedback-select"
          className="form-control"
        >
          <option value="immediate">
            instantly after the student answers each question
          </option>
          <option value="due_at">
            only after due date/time passes
          </option>
        </select>
        {this.shouldShowWarning && (
          <Popover
            className="feedback-tip"
            placement="bottom"
            ref="popover"
            id="feedback-tip-popover"
          >
            <Popover.Content>
              Some students may have already seen feedback and answers
              to questions in this assignment.
            </Popover.Content>
          </Popover>
        )}
      </div>
    );
  }
}

export default FeedbackSetting;
