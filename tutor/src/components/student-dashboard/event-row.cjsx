React  = require 'react'
BS     = require 'react-bootstrap'

Time   = require '../time'
Router = require '../../helpers/router'
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
    isCollege:  React.PropTypes.bool.isRequired

  contextTypes:
    router: React.PropTypes.object

  getInitialState: -> hidden: false

  onClick: (ev) ->
    {courseId, event} = @props
    ev.preventDefault()
    @context.router.transitionTo Router.makePathname('viewTask', {courseId, id: event.id})

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
      guardProps = {
        okButtonLabel: 'Yes'
        onConfirm: @hideTask
        placement: 'top'
        message:
          <div>
            <p>
              If you remove this assignment, you will lose any progress or
              feedback you have received.
            </p>
            <p>Do you wish to continue?</p>
          </div>
      }
      hideButton =
        <span>
          Withdrawn
          <SuretyGuard {...guardProps}>
            <BS.Button className="hide-task" onClick={@stopEventPropagation}>
              <i className="fa fa-close" />
            </BS.Button>
          </SuretyGuard>
        </span>

    else
      time = <Time date={@props.event.due_at} format='concise'/>
      feedback = [
        <span key="feedback">{@props.feedback}</span>
        <EventInfoIcon key="icon" event={@props.event} isCollege={@props.isCollege}/>
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
