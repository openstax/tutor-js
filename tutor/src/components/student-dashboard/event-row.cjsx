React  = require 'react'
BS     = require 'react-bootstrap'
Time   = require '../time'
{StudentDashboardStore, StudentDashboardActions} = require '../../flux/student-dashboard'
EventInfoIcon = require './event-info-icon'
{Instructions} = require '../task/details'
{SuretyGuard} = require 'shared'
classnames = require 'classnames'

module.exports = React.createClass
  displayName: 'EventRow'

  propTypes:
    eventType: React.PropTypes.string.isRequired
    event:     React.PropTypes.object.isRequired
    courseId:  React.PropTypes.string.isRequired
    feedback:  React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  getInitialState: -> hidden: false

  onClick: (ev) ->
    ev.preventDefault()
    @context.router.transitionTo 'viewTaskStep',
      # url is 1 based so it matches the breadcrumb button numbers. 1==first step
      {courseId:@props.courseId, id: @props.event.id, stepIndex: 1}

  hideTask: (event) ->
    StudentDashboardActions.hide(@props.event.id)
    StudentDashboardStore.on('hidden', @hidden)

  stopEventPropagation: (event) ->
    event.stopPropagation()

  hidden: -> @setState({hidden: true})

  render: ->
    if @state.hidden then return null

    {workable} = @props
    workable ?= StudentDashboardStore.canWorkTask(@props.event)
    deleted = StudentDashboardStore.isDeleted(@props.event)
    classes = classnames("task row #{@props.eventType}", {workable, deleted})

    if deleted
      message = <div>
        <p>
          If you remove this assignment, you will lose any progress or feedback you have received.
        </p>
        <p>Do you wish to continue?</p>
      </div>

      hideButton = <span>
        Withdrawn
        <SuretyGuard
          onConfirm={@hideTask}
          okButtonLabel='Yes'
          placement='top'
          message={message}
        >
          <BS.Button className="hide-task"
            onClick={@stopEventPropagation}
          >
            <i className="fa fa-close" />
          </BS.Button>
        </SuretyGuard>
      </span>

    else
      time = <Time date={@props.event.due_at} format='concise'/>
      feedback = [
        <span>{@props.feedback}</span>
        <EventInfoIcon event={@props.event} />
      ]

    <a
      className={classes}
      href='#'
      aria-labelledby={"Work on #{@props.eventType}: #{@props.event.title}"}
      tabIndex={if workable then 0 else -1}
      onClick={@onClick if workable}
      onKeyDown={@onKey if workable}
      data-event-id={@props.event.id}
    >
      <BS.Col xs={2}  sm={1} className={"column-icon"}>
        <i
          aria-label={"#{@props.eventType} icon"}
          className={"icon icon-lg icon-#{@props.eventType}"}
        />
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
    </a>
