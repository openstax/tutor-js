React = require 'react'
BS    = require 'react-bootstrap'
_     = require 'underscore'
moment = require 'moment-timezone'

{TimeStore} = require '../../../flux/time'
TimeHelper  = require '../../../helpers/time'
{default: Courses} = require '../../../models/courses-map'
{TaskingActions, TaskingStore} = require '../../../flux/tasking'

Icon = require '../../icon'
DateTime = require './date-time'

TaskingDateTimes = React.createClass
  propTypes:
    id:                  React.PropTypes.string.isRequired
    courseId:            React.PropTypes.string.isRequired
    termStart:           TimeHelper.PropTypes.moment
    termEnd:             TimeHelper.PropTypes.moment
    isEditable:          React.PropTypes.bool.isRequired
    isVisibleToStudents: React.PropTypes.bool
    taskingIdentifier:   React.PropTypes.string.isRequired
    period:              React.PropTypes.object
    bsSizes:             React.PropTypes.object

  getDefaultProps: ->
    bsSizes: { sm: 8, md: 9 }

  getError: ->
    return false unless @refs?.due?.hasValidInputs() and @refs?.open?.hasValidInputs()

    {id, period} = @props

    return false if TaskingStore.isTaskingValid(id, period?.serialize())

    _.first(TaskingStore.getTaskingErrors(id, period))

  setDefaultTime: (timeChange) ->
    {courseId, period} = @props
    model = if period then period else Courses.get(courseId)
    _.assign(model, timeChange)
    model.save()
    @forceUpdate()

  isSetting: ->
    {courseId} = @props
    Courses.get(courseId).api.isPending

  setDate: (type, value) ->
    {id, period} = @props
    value = value.format(TimeHelper.ISO_DATE_FORMAT) if moment.isMoment(value)
    TaskingActions.updateDate(id, period?.serialize(), type, value)

  setTime: (type, value) ->
    {id, period} = @props
    value = value.format(TimeHelper.ISO_DATE_FORMAT) if moment.isMoment(value)
    TaskingActions.updateTime(id, period?.serialize(), type, value)

  render: ->
    {isVisibleToStudents, isEditable, period, courseId, id, termStart, termEnd} = @props
    period = period.serialize() if period
    commonDateTimesProps = _.pick @props, 'required', 'currentLocale', 'taskingIdentifier'

    model = if period then period else Courses.get(courseId)
    { default_open_time, default_due_time } = model

    defaults = TaskingStore.getDefaultsForTasking(id, period)
    {open_time, open_date, due_time, due_date} = TaskingStore._getTaskingFor(id, period)

    now = TimeHelper.getMomentPreserveDate(TimeStore.getNow())
    nowString = now.format(TimeHelper.ISO_DATE_FORMAT)

    termStartString = termStart.format(TimeHelper.ISO_DATE_FORMAT)
    termEndString   = termEnd.format(TimeHelper.ISO_DATE_FORMAT)

    minOpensAt = if termStart.isAfter(now) then termStartString else nowString
    maxOpensAt = due_date or termEndString

    openDate = open_date or minOpensAt

    minDueAt = if TaskingStore.isTaskOpened(id) then minOpensAt else openDate
    maxDueAt = termEndString

    error = @getError()

    extraError = <BS.Col xs=12 md=6 mdOffset=6>
      <p className="due-before-open">
        {error}
        <Icon type='exclamation-circle' />
      </p>
    </BS.Col> if error


    <BS.Col
      {...@props.bsSizes}
      className="tasking-date-times"
      data-period-id={if period then period.id else 'all'}
    >
      <DateTime
        {...commonDateTimesProps}
        disabled={isVisibleToStudents or not isEditable}
        label="Open"
        ref="open"
        min={minOpensAt}
        max={maxOpensAt}
        setDate={_.partial(@setDate, 'open')}
        setTime={_.partial(@setTime, 'open')}
        value={ openDate }
        defaultValue={open_time or defaults.open_time}
        defaultTime={default_open_time}
        setDefaultTime={@setDefaultTime}
        timeLabel='default_open_time'
        isSetting={@isSetting}
      />
      <DateTime
        {...commonDateTimesProps}
        disabled={not isEditable}
        label="Due"
        ref="due"
        min={minDueAt}
        max={maxDueAt}
        setDate={_.partial(@setDate, 'due')}
        setTime={_.partial(@setTime, 'due')}
        value={due_date}
        defaultValue={due_time or defaults.due_time}
        defaultTime={default_due_time}
        setDefaultTime={@setDefaultTime}
        timeLabel='default_due_time'
        isSetting={@isSetting}
      />
      {extraError}
    </BS.Col>

module.exports = TaskingDateTimes
