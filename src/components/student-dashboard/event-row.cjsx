React  = require 'react'
BS     = require 'react-bootstrap'
Time   = require '../time'
{StudentDashboardStore, StudentDashboardActions} = require '../../flux/student-dashboard'
EventInfoIcon = require './event-info-icon'
{Instructions} = require '../task/details'
classnames = require 'classnames'

module.exports = React.createClass
  displayName: 'EventRow'

  propTypes:
    className: React.PropTypes.string.isRequired
    event:     React.PropTypes.object.isRequired
    courseId:  React.PropTypes.string.isRequired
    feedback:  React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  getInitialState: -> hidden: false

  onClick: ->
    @context.router.transitionTo 'viewTaskStep',
      # url is 1 based so it matches the breadcrumb button numbers. 1==first step
      {courseId:@props.courseId, id: @props.event.id, stepIndex: 1}

  hideTask: ->
    StudentDashboardActions.hide(@props.event.id)
    StudentDashboardStore.on('hidden', @hidden)

  hidden: -> @setState({hidden: true})

  render: ->
    if @state.hidden then return null

    {workable} = @props
    workable ?= StudentDashboardStore.canWorkTask(@props.event)
    deleted = StudentDashboardStore.isDeleted(@props.event)
    classes = classnames("task row #{@props.className}", {workable, deleted})

    if deleted
      hideButton = <BS.Button className="-hide-button" onClick={@hideTask}>
        <i className="fa fa-close"/>
      </BS.Button>
      feedback = <span>Withdrawn</span>
    else
      time = <Time date={@props.event.due_at} format='concise'/>
      feedback = [
        <span>{@props.feedback}</span>
        <EventInfoIcon event={@props.event} />
      ]

    <div className={classes} onClick={@onClick if workable and not deleted}
      data-event-id={@props.event.id}>
      <BS.Col xs={2}  sm={1} className={"column-icon"}>
        <i className={"icon icon-lg icon-#{@props.className}"}/>
      </BS.Col>
      <BS.Col xs={10} sm={6} className='title'>
        {@props.children}
        <Instructions
          task={@props.event}
          popverClassName='student-dashboard-instructions-popover'/>
      </BS.Col>
      <BS.Col xs={5}  sm={3} className='feedback'>
        {feedback}
      </BS.Col>
      <BS.Col xs={5}  sm={2} className='due-at'>
        {time}
        {hideButton}
      </BS.Col>
    </div>
