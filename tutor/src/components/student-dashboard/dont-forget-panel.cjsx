React = require 'react'
BS = require 'react-bootstrap'
{StudentDashboardStore} = require '../../flux/student-dashboard'
EmptyPanel  = require './empty-panel'
_ = require 'underscore'
module.exports = React.createClass

  displayName: 'DontForgetPanel'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  viewFeedback: (taskId) ->
    alert "TODO: View Feedback for task ID: #{taskId} in course ID: #{@props.courseId}"

  viewRecovery: (taskId) ->
    alert "TODO: View Recovery for task ID: #{taskId} in course ID: #{@props.courseId}"

  recoverData: (event) ->
    name: 'Recovery'
    summary: "#{event.exercise_count} available"
    icon: 'recover'
    clickHandler: @viewRecovery

  feedbackData: (event) ->
    summary = if event.correct_exercise_count
      "#{event.correct_exercise_count}/#{event.exercise_count} correct"
    else
      "#{event.complete_exercise_count}/#{event.exercise_count} complete"
    { name: 'Feedback', summary: summary, icon: 'feedback', clickHandler: @viewFeedback }

  renderBlock: (event, i, all) ->
    feedback = "#{event.complete_exercise_count}/#{event.exercise_count} complete"
    data = if i % 2 then @feedbackData(event) else @recoverData(event)
    <BS.Col key={event.id} xs={12 / all.length}>
      <div>
        <i className="icon-xlg icon-#{data.icon}" onClick={_.partial(data.clickHandler, event.id)}/>
        <h3 className='heading'>View {data.name}</h3>
        <div className='title'>{event.title}</div>
        <div className='summary'>{data.summary}</div>
      </div>
    </BS.Col>

  render: ->
    events  = _.last(StudentDashboardStore.pastDueEvents(@props.courseId), 4)
    if events.length
      <BS.Panel className='dont-forget' header="Don't Forget">
        {_.map(events, @renderBlock)}
      </BS.Panel>
    else
      <EmptyPanel title="Don't Forget">No new reminders</EmptyPanel>
