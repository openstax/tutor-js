React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'
Time   = require '../time'
{StudentDashboardStore} = require '../../flux/student-dashboard'
EventInfoIcon = require './event-info-icon'
{Instructions} = require '../task/details'

module.exports = React.createClass
  displayName: 'EventRow'

  propTypes:
    className: React.PropTypes.string.isRequired
    event:     React.PropTypes.object.isRequired
    courseId:  React.PropTypes.string.isRequired
    feedback:  React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  onClick: ->
    @context.router.transitionTo 'viewTaskStep',
      # url is 1 based so it matches the breadcrumb button numbers. 1==first step
      {courseId:@props.courseId, id: @props.event.id, stepIndex: 1}

  render: ->
    {workable} = @props
    workable ?= StudentDashboardStore.canWorkTask(@props.event)
    # FIXME - use classnames lib when available
    classnames = "task row #{@props.className}"
    classnames += ' workable' if workable
    <div className={classnames} onClick={@onClick if workable}>
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
        <span>{@props.feedback}</span><EventInfoIcon event={@props.event} />
      </BS.Col>
      <BS.Col xs={5}  sm={2} className='due-at'>
        <Time date={@props.event.due_at} />
      </BS.Col>
    </div>
