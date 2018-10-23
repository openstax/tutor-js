
import React from 'react';
import BS from 'react-bootstrap';

import { TaskPlanStore, TaskPlanActions } from '../../flux/task-plan';

class FeedbackSetting extends React.Component {
  setImmediateFeedback = (ev) => {
    return TaskPlanActions.setImmediateFeedback( this.props.id, ev.target.value === 'immediate' );
  };

  render() {
    let popover;
    const { id, showPopup } = this.props;
    if (showPopup &&
      TaskPlanStore.isChangingToDueAt(id) &&
      !TaskPlanStore.isFeedbackImmediate(id)) { popover = <BS.Popover
      className="feedback-tip"
      placement="bottom"
      ref="popover"
      id="feedback-tip-popover">
      {`\
  Some students may have already seen feedback and answers
  to questions in this assignment.\
  `}
    </BS.Popover>; }

    return (
      <div className="form-group">
        <label htmlFor="feedback-select">
          Show feedback
        </label>
        <select
          onChange={this.setImmediateFeedback}
          value={TaskPlanStore.isFeedbackImmediate(id) ? 'immediate' : 'due_at'}
          id="feedback-select"
          className="form-control">
          <option value="immediate">
            {'\
    instantly after the student answers each question\
    '}
          </option>
          <option value="due_at">
            {'\
    only after due date\x2Ftime passes\
    '}
          </option>
        </select>
        {popover}
      </div>
    );
  }
}

export default FeedbackSetting;
