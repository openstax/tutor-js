React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'
Time   = require '../time'
{StudentDashboardStore} = require '../../flux/student-dashboard'

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
    @context.router.transitionTo 'viewTask',
      # url is 1 based so it matches the breadcrumb button numbers. 1==first step
      {courseId:@props.courseId, id: @props.event.id, stepIndex: 1}

  render: ->
    workable = StudentDashboardStore.canWorkTask(@props.event)
    # FIXME - use classnames lib when available
    classnames = "task row #{@props.className}"
    classnames += ' workable' if workable
    <div className={classnames} onClick={@onClick if workable}>
      <BS.Col xs={1}  sm={1}>
        <i className={"icon icon-lg icon-#{@props.className}"}/>
      </BS.Col>
      <BS.Col xs={11} sm={7} className='title'>{@props.children}</BS.Col>
      <BS.Col xs={6}  sm={2} className='feedback'>{@props.feedback}</BS.Col>
      <BS.Col xs={5}  sm={2} className='due-at'>
        <Time date={@props.event.due_at}/>
      </BS.Col>
    </div>
