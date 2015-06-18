moment = require 'moment'
React = require 'react'

TaskPlan = React.createClass
  displayName: 'TeacherTaskPlan'
  propTypes:
    plan: React.PropTypes.object.isRequired
    courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  onEditPlan: ->
    {courseId} = @props
    {id, type} = @props.plan
    # TODO: Remove this copy/pasta
    switch type
      when 'homework'
        @context.router.transitionTo('editHomework', {courseId, id})
      when 'reading'
        @context.router.transitionTo('editReading', {courseId, id})
      else throw new Error("BUG: Unknown plan type '#{type}'")

  onViewStats: ->
    {courseId} = @props
    {id, type} = @props.plan
    @context.router.transitionTo('viewStats', {courseId, type, id})

  render: ->
    {plan} = @props
    start  = moment(plan.opens_at)
    ending = moment(plan.due_at)
    duration = moment.duration( ending.diff(start) ).humanize()

    <div className='-list-item'>
      <BS.ListGroupItem header={plan.title} onClick={@onEditPlan}>
        {start.fromNow()} ({duration})
      </BS.ListGroupItem>
      <BS.Button
        bsStyle='link'
        className='-tasks-list-stats-button'
        onClick={@onViewStats}>
        View Stats
      </BS.Button>
    </div>


TeacherTaskPlanListing = React.createClass
  displayName: 'TeacherTaskPlanListing'

  propTypes:
    plan: React.PropTypes.object.isRequired
    courseId: React.PropTypes.string.isRequired

  render: ->
    {plansList, courseId} = @props
    title = "Task plans for course ID #{courseId}"

    plans = for plan in plansList
      <TaskPlan key={plan.id} plan={plan} courseId={courseId} />

    <BS.ListGroup id='tasks-list'>
        {plans}
    </BS.ListGroup>

module.exports = TeacherTaskPlanListing
