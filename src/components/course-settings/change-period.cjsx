React = require 'react'
BS = require 'react-bootstrap'

CourseGroupingLabel = require '../course-grouping-label'
{RosterActions, RosterStore} = require '../../flux/roster'
{CourseStore} = require '../../flux/course'

ChangePeriodLink = React.createClass
  propTypes:
    courseId: React.PropTypes.string.isRequired
    student: React.PropTypes.object.isRequired

  updatePeriod: (periodId) ->
    if not @isSaving()
      RosterActions.save(@props.student.id, period_id: periodId)

  isSaving: ->
    RosterStore.isSaving(@props.student.id)

  renderPeriod: (period) ->
    <BS.NavItem key={period.id} eventKey={period.id}>
      {period.name}
    </BS.NavItem>

  selectNewPeriod: ->
    periods = CourseStore.getPeriods(@props.courseId)
    return null if periods.length is 1

    title =
      if @isSaving()
        <span>
          <i className='fa fa-spinner fa-spin'/> Saving...
        </span>
      else
        <span>
          Move to <CourseGroupingLabel courseId={@props.courseId} lowercase/>:
        </span>
    <BS.Popover className='change-period' title={title} {...@props}>
      <BS.Nav stacked bsStyle='pills' onSelect={@updatePeriod}>
        {for period in periods
          @renderPeriod(period) unless period.id is @props.student.period_id }
      </BS.Nav>
    </BS.Popover>

  render: ->
    # if we have only 1 period, it's imposible to move a student
    periods = CourseStore.getPeriods(@props.courseId)
    return null if periods.length is 1

    <BS.OverlayTrigger rootClose={true} trigger='click' placement='left'
      overlay={@selectNewPeriod()}>
        <a>
          <i className='fa fa-clock-o' /> Change <CourseGroupingLabel
            courseId={@props.courseId} />
        </a>
    </BS.OverlayTrigger>

module.exports = ChangePeriodLink
