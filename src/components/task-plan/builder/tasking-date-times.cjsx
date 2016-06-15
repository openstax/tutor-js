React = require 'react'
BS    = require 'react-bootstrap'
_     = require 'underscore'


{TimeStore} = require '../../../flux/time'
TimeHelper  = require '../../../helpers/time'
{PeriodActions, PeriodStore}     = require '../../../flux/period'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{CourseStore, CourseActions}     = require '../../../flux/course'

DateTime = require './date-time'

TaskingDateTimes = React.createClass
  propTypes:
    id:                  React.PropTypes.string.isRequired
    isEditable:          React.PropTypes.bool.isRequired
    taskingOpensAt:      React.PropTypes.string.isRequired
    taskingDueAt:        React.PropTypes.string
    setDueAt:            React.PropTypes.func.isRequired
    setOpensAt:          React.PropTypes.func.isRequired
    dueTime:             React.PropTypes.string
    openTime:            React.PropTypes.string.isRequired
    defaultDueTime:      React.PropTypes.string.isRequired
    defaultOpenTime:     React.PropTypes.string.isRequired
    isVisibleToStudents: React.PropTypes.bool
    period:              React.PropTypes.object

  isTimeDefault: (time, defaultTime) ->
    return true if _.isUndefined(time)
    TimeHelper.makeMoment(time, 'HH:mm').isSame(TimeHelper.makeMoment(defaultTime, 'HH:mm'), 'minute')

  setDefaultTime: (timeChange) ->
    {courseId, period} = @props

    if period?
      PeriodActions.save(courseId, period.id, timeChange)
    else
      CourseActions.save(courseId, timeChange)

  isSetting: ->
    {courseId, period} = @props

    if period?
      PeriodStore.isSaving(courseId)
    else
      CourseStore.isSaving(courseId)

  render: ->
    {
      isVisibleToStudents,
      isEditable,
      period,
      id,
      taskingOpensAt,
      taskingDueAt,
      setDueAt,
      setOpensAt,
      dueTime,
      openTime,
      defaultDueTime,
      defaultOpenTime
    } = @props

    commonDateTimesProps = _.pick @props, 'required', 'currentLocale', 'taskingIdentifier'

    isDueTimeDefault = @isTimeDefault dueTime, defaultDueTime
    isOpenTimeDefault = @isTimeDefault openTime, defaultOpenTime

    maxOpensAt = TaskPlanStore.getMaxDueAt(id, period?.id)
    minDueAt = TaskPlanStore.getMinDueAt(id, period?.id)

    <BS.Col sm=8 md=9>
      <DateTime
        {...commonDateTimesProps}
        disabled={isVisibleToStudents or not isEditable}
        label="Open"
        ref="open"
        min={TimeStore.getNow()}
        max={maxOpensAt}
        onChange={_.partial(setOpensAt, _, period)}
        value={ taskingOpensAt }
        defaultValue={openTime or defaultOpenTime}
        setDefaultTime={@setDefaultTime}
        timeLabel='default_open_time'
        isTimeDefault={isOpenTimeDefault}
        isSetting={@isSetting} />
      <DateTime
        {...commonDateTimesProps}
        disabled={not isEditable}
        label="Due"
        ref="due"
        min={minDueAt}
        onChange={_.partial(setDueAt, _, period)}
        value={taskingDueAt}
        defaultValue={dueTime or defaultDueTime}
        setDefaultTime={@setDefaultTime}
        timeLabel='default_due_time'
        isTimeDefault={isDueTimeDefault}
        isSetting={@isSetting} />
    </BS.Col>

module.exports = TaskingDateTimes
