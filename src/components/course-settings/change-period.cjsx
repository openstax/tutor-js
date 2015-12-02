React = require 'react'
BS = require 'react-bootstrap'

CourseGroupingLabel = require '../course-grouping-label'
{RosterActions} = require '../../flux/roster'
{CourseStore} = require '../../flux/course'

module.exports = React.createClass
  displayName: 'ChangePeriodLink'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    student: React.PropTypes.object.isRequired

  updatePeriod: (periodId) ->
    RosterActions.save(@props.student.id, period_id: periodId)

  renderPeriod: (period) ->
    <BS.NavItem key={period.id} eventKey={period.id}>
      {period.name}
    </BS.NavItem>

  selectNewPeriod: ->
    course = CourseStore.get(@props.courseId)
    title =
      <span>
        Move to <CourseGroupingLabel courseId={@props.courseId} lowercase/>:
      </span>
    <BS.Popover title={title} {...@props}>
      <BS.Nav stacked bsStyle='pills' onSelect={@updatePeriod}>
        {for period in course.periods
          @renderPeriod(period) unless period.id is @props.student.period_id }
      </BS.Nav>
    </BS.Popover>

  render: ->
    # if we have only 1 period, it's imposible to move a student
    course = CourseStore.get(@props.courseId)
    return null if course.periods.length is 1

    <BS.OverlayTrigger rootClose={true} trigger='click' placement='left'
      overlay={@selectNewPeriod()}>
        <a>
          <i className='fa fa-clock-o' /> Change <CourseGroupingLabel 
            courseId={@props.courseId} />
        </a>
    </BS.OverlayTrigger>
