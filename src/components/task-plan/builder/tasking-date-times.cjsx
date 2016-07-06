React = require 'react'
BS    = require 'react-bootstrap'
_     = require 'underscore'
moment = require 'moment-timezone'

{TimeStore} = require '../../../flux/time'
TimeHelper  = require '../../../helpers/time'
{PeriodActions, PeriodStore}     = require '../../../flux/period'
{CourseStore, CourseActions}     = require '../../../flux/course'
{TaskingActions, TaskingStore} = require '../../../flux/tasking'

DateTime = require './date-time'

TaskingDateTimes = React.createClass
  propTypes:
    id:                  React.PropTypes.string.isRequired
    isEditable:          React.PropTypes.bool.isRequired
    isVisibleToStudents: React.PropTypes.bool
    period:              React.PropTypes.object

  isPastDue: (date, time) ->
    return false unless date?
    TimeHelper.makeMoment("#{date} #{time}").isBefore(TimeHelper.makeMoment())

  setDefaultTime: (timeChange) ->
    {courseId, period} = @props

    if period?
      PeriodActions.save(courseId, period.id, timeChange)
    else
      CourseActions.save(courseId, timeChange)

  isSetting: ->
    {courseId, period} = @props

    if period?
      CourseStore.isLoading(courseId)
    else
      CourseStore.isSaving(courseId)

  setDate: (type, value) ->
    {id, period} = @props
    value = value.format(TimeHelper.ISO_DATE_FORMAT) if moment.isMoment(value)
    TaskingActions.updateDate(id, period, type, value) 

  setTime: (type, value) ->
    {id, period} = @props
    value = value.format(TimeHelper.ISO_DATE_FORMAT) if moment.isMoment(value)
    TaskingActions.updateTime(id, period, type, value) 

  render: ->
    {
      isVisibleToStudents,
      isEditable,
      period,
      id
    } = @props

    commonDateTimesProps = _.pick @props, 'required', 'currentLocale', 'taskingIdentifier'

    defaults = TaskingStore.getDefaultsForTasking(id, period)
    {open_time, open_date, due_time, due_date} = TaskingStore._getTaskingFor(id, period)

    now = TimeHelper.getMomentPreserveDate(TimeStore.getNow()).format(TimeHelper.ISO_DATE_FORMAT)

    maxOpensAt = due_date
    minDueAt = if TaskingStore.isTaskOpened(id) then now else open_date

    <BS.Col sm=8 md=9>
      <DateTime
        {...commonDateTimesProps}
        disabled={isVisibleToStudents or not isEditable}
        label="Open"
        ref="open"
        min={now}
        max={maxOpensAt}
        setDate={_.partial(@setDate, 'open')}
        setTime={_.partial(@setTime, 'open')}
        value={ open_date }
        defaultValue={open_time or defaults.open_time}
        defaultTime={defaults.open_time}
        setDefaultTime={@setDefaultTime}
        timeLabel='default_open_time'
        isSetting={@isSetting} />
      <DateTime
        {...commonDateTimesProps}
        disabled={not isEditable}
        label="Due"
        ref="due"
        min={minDueAt}
        setDate={_.partial(@setDate, 'due')}
        setTime={_.partial(@setTime, 'due')}
        value={due_date}
        defaultValue={due_time or defaults.due_time}
        defaultTime={defaults.due_time}
        setDefaultTime={@setDefaultTime}
        timeLabel='default_due_time'
        isSetting={@isSetting} />
    </BS.Col>

module.exports = TaskingDateTimes
