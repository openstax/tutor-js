
React      = require 'react'
BS         = require 'react-bootstrap'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

FeedbackSetting = React.createClass

  setImmediateFeedback: (ev) ->
    TaskPlanActions.setImmediateFeedback( @props.id, ev.target.value is 'immediate' )

  render: ->
    { id, showPopup } = @props
    popover = <BS.Popover className="feedback-tip" placement="bottom" ref="popover">
      Some students may have already seen feedback and answers
      to questions in this assignment.
    </BS.Popover> if showPopup

    <div className="form-group">
      <label htmlFor="feedback-select">Show feedback</label>
      <select
        onChange={@setImmediateFeedback}
        value={if TaskPlanStore.isFeedbackImmediate(id) then 'immediate' else 'due_at'}
        id="feedback-select" className="form-control"
      >
        <option value="immediate">
          instantly after the student answers each question
        </option>
        <option value="due_at">
          only after due date/time passes
        </option>
      </select>
      { popover }
    </div>

module.exports = FeedbackSetting
